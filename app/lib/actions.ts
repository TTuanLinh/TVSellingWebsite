'use server';

import { z } from 'zod';
import prisma from './prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

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

const CategoryFormSchema = z.object({
  id: z.number(),
  name: z.string().min(1, {
    message: 'Category name is required.',
  }),
});

const BrandFormSchema = z.object({
  id: z.number(),
  name: z.string().min(1, {
    message: 'Brand name is required.',
  }),
});


const UpdateOrder = FormSchema.omit({ id: true, createdAt: true, updatedAt: true });
const CreateOrder = FormSchema.omit({ id: true, createdAt: true, updatedAt: true });

const UpdateCategory = CategoryFormSchema.omit({ id: true });
const CreateCategory = CategoryFormSchema.omit({ id: true });

const UpdateBrand = BrandFormSchema.omit({ id: true });
const CreateBrand = BrandFormSchema.omit({ id: true });

export type State = {
  errors?: {
    userId?: string[];
    total?: string[];
    status?: string[];
  };
  message: string | null;
};

export type CategoryState = {
  errors?: {
    name?: string[];
  };
  message: string | null;
};

export type BrandState = {
  errors?: {
    name?: string[];
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

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({
    where: {
      id: Number(id),
    },
  });
  revalidatePath('/dashboard/categories');
}

export async function createCategory(prevState: CategoryState, formData: FormData) {
  const validatedFields = CreateCategory.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Please check the form again.',
    }
  }

  const { name } = validatedFields.data;
  
  try {
    await prisma.category.create({
      data: {
        name: name,
        // createdAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Category.',
    }
  }
  
  revalidatePath('/dashboard/categories');
  redirect('/dashboard/categories');
}

export async function updateCategory(prevState: CategoryState, formData: FormData) {
  const validatedFields = UpdateCategory.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Please check the form again.',
    }
  }
  const { name } = validatedFields.data;

  try {
    await prisma.category.update({
    where: {
      id: Number(formData.get('id')),
    },
    data: {
      name: name,
      // updatedAt: new Date().toISOString(),
    }
  });
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update order.',
    }
  }
 
  revalidatePath('/dashboard/categories');
  redirect('/dashboard/categories');
}

export async function deleteBrand(id: string) {
  await prisma.brand.delete({
    where: {
      id: Number(id),
    },
  });
  revalidatePath('/dashboard/brands');
}


// Create, Update Brands
export async function createBrand(prevState: BrandState, formData: FormData) {
  const validatedFields = CreateBrand.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Please check the form again.',
    }
  }

  const { name } = validatedFields.data;
  
  try {
    await prisma.brand.create({
      data: {
        name: name,
        // createdAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Brand.',
    }
  }
  
  revalidatePath('/dashboard/brands');
  redirect('/dashboard/brands');
}

export async function updateBrand(prevState: BrandState, formData: FormData) {
  const validatedFields = UpdateBrand.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Please check the form again.',
    }
  }
  const { name } = validatedFields.data;
  const id = formData.get('id');

  try {
    await prisma.brand.update({
    where: {
      id: Number(id),
    },
    data: {
      name: name,
      // updatedAt: new Date().toISOString(),
    }
  });
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update brand.',
    }
  }
 
  revalidatePath('/dashboard/brands');
  revalidatePath(`/dashboard/brands/${id}/edit`);
  redirect('/dashboard/brands');
}
