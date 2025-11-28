'use server';

import { z } from 'zod';
import prisma from './prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';

const CustomerFormSchema = z.object({
  id: z.number(),
  name: z.string().min(1, {
    message: 'Customer name is required.',
  }),
  email: z.string().email({
    message: 'Invalid email address.',
  }),
  phone: z.string().min(10, {
    message: 'Phone number must be at least 10 digits.',
  }),
});

const UpdateCustomer = CustomerFormSchema.omit({ id: true });
const CreateCustomer = CustomerFormSchema.omit({ id: true });

export type CustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
  };
  message: string | null;
};

export async function deleteCustomer(id: string) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    console.error('Invalid ID for deletion:', id);
    throw new Error('Invalid ID.');
  }

  try {
    await prisma.user.delete({
      where: {
        id: numericId,
      },
    });
    revalidatePath('/dashboard/customers');
  } catch (error) {
    console.error('Delete Error:', error);
    throw new Error('Database Error: Failed to delete customer.');
  }
}

export async function createCustomer(prevState: CustomerState, formData: FormData) {
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Please check the form again.',
    }
  }

  const { name, email, phone } = validatedFields.data;
  
  try {
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        phone: phone,
        password: await bcrypt.hash('defaultpassword', 10),
        // createdAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Customer.',
    }
  }
  
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

export async function updateCustomer(
  id: string,
  prevState: CustomerState,
  formData: FormData,
) {

  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return { message: 'Invalid Customer ID.' };
  }

  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Please check the form again.',
    };
  }
  const { name, email, phone } = validatedFields.data;

  try {
    await prisma.user.update({
      where: {
        id: numericId,
      },
      data: {
        name: name,
        email: email,
        phone: phone,
      },
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update customer.',
    };
  }

  revalidatePath('/dashboard/customers');
  revalidatePath(`/dashboard/customers/${numericId}/edit`);
  redirect('/dashboard/customers');
}
