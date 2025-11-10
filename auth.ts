import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { User } from '@/generated/prisma/client';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcrypt';

async function getUser(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user data');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredenticals = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (parsedCredenticals.success) {
          const {email, password} = parsedCredenticals.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch){
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              image: user.avatar,
            };
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    })
  ],
});