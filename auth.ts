import NextAuth from 'next-auth';
import { authConfig } from './auth.config'; // Import file config (ở trên)
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { User as PrismaUser } from '@/generated/prisma/client';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcrypt';

async function getUser(email: string): Promise<PrismaUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    console.log('User fetched from DB:', user);
    return user;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user data');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  // 1. Tải TẤT CẢ config (bao gồm 'pages', 'callbacks: {authorized, jwt, session}')
  ...authConfig, 
  
  // 2. Chỉ định 'providers'
  providers: [
    Credentials({
      async authorize(credentials, request) { 
        const parsedCredenticals = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (parsedCredenticals.success) {
          const {email, password} = parsedCredenticals.data;
          const user = await getUser(email);
          console.log('User from authorize:', user);
          if (!user) return null;

          // (Hãy chắc chắn mật khẩu trong CSDL của bạn đã được HASH)
          const passwordsMatch = await bcrypt.compare(password, user.password);
          
          if (passwordsMatch){
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              image: user.avatar,
              role: user.role,
            };
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    })
  ],
});