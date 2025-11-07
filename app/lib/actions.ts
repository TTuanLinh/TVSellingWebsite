'use server';

import { z } from 'zod';
import prisma from './prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormCreateSchema = z.object({
  id: z.number(),
  userId: z.coerce.number(),
  total: z.coerce.number(),
  status: z.preprocess(
    (val) => Number(val),
    z.union([z.literal(0), z.literal(1)])
  ),
  createdAt: z.string(),
});

const FormUpdateSchema = z.object({
  id: z.number(),
  userId: z.coerce.number(),
  total: z.coerce.number(),
  status: z.preprocess(
    (val) => Number(val),
    z.union([z.literal(0), z.literal(1)])
  ),
  updatedAt: z.string(),
});

const UpdateOrder = FormUpdateSchema.omit({ id: true, updatedAt: true });
const CreateOrder = FormCreateSchema.omit({ id: true, createdAt: true });
 
export async function createOrder(formData: FormData) {
  const { userId, total, status} = CreateOrder.parse({
    userId: formData.get('customerId'),
    total: formData.get('total'),
    status: formData.get('status'),
  });

  await prisma.order.create({
    data: {
      userId: userId,
      total: total,
      status: status,
      createdAt: new Date().toISOString(),
    }
  });

  revalidatePath('/dashboard/orders');
  redirect('/dashboard/orders');
}

export async function updateOrder(id: string, formData: FormData) {
  const { userId, total, status } = UpdateOrder.parse({
    userId: formData.get('customerId'),
    total: formData.get('total'),
    status: formData.get('status'),
  });

  await prisma.order.update({
    where: {
      id: Number(id),
    },
    data: {
      userId: userId,
      total: total,
      status: status,
      updatedAt: new Date().toISOString(),
    }
  });
 
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