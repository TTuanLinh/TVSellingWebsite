'use server';

import { z } from 'zod';
import prisma from './prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.number(),
  userId: z.coerce.number().gt(0, {
    message: 'Please select a customer.',
  }),
  total: z.coerce.number().gt(0, {
    message: 'Total amount must be greater than 0.',
  }),
  status: z.enum(['0', '1'], {
    invalid_type_error: 'Please select a status.',
  }).pipe(z.coerce.number()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const UpdateOrder = FormSchema.omit({ id: true, createdAt: true, updatedAt: true });
const CreateOrder = FormSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type State = {
  errors?: {
    userId?: string[];
    total?: string[];
    status?: string[];
  };
  message: string | null;
};
 
export async function createOrder(prevState: State, formData: FormData) {
  const validatedFields = CreateOrder.safeParse({
    userId: formData.get('customerId'),
    total: formData.get('total'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Please check the form again.',
    }
  }

  const { userId, total, status } = validatedFields.data;
  
  try {
    await prisma.order.create({
      data: {
        userId: userId,
        total: total,
        status: status,
        // createdAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create order.',
    }
  }
  

  revalidatePath('/dashboard/orders');
  redirect('/dashboard/orders');
}

export async function updateOrder(prevState: State, formData: FormData) {
  const validatedFields = UpdateOrder.safeParse({
    userId: formData.get('customerId'),
    total: formData.get('total'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Please check the form again.',
    }
  }
  const { userId, total, status } = validatedFields.data;

  try {
    await prisma.order.update({
    where: {
      id: Number(formData.get('id')),
    },
    data: {
      userId: userId,
      total: total,
      status: status,
      // updatedAt: new Date().toISOString(),
    }
  });
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update order.',
    }
  }
 
  revalidatePath('/dashboard/orders');
  redirect('/dashboard/orders');
}

export async function deleteOrder(id:string) {
  await prisma.order.delete({
    where: {
      id: Number(id),
    },
  });
  revalidatePath('/dashboard/orders');
}