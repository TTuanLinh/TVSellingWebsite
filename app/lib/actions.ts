'use server';

import { z } from 'zod';
import prisma from './prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
import { auth } from '@/auth';
import { verifyTurnstileToken } from './turnstile';

const registerSchema = z.object({
  email: z.string().email({ 
    message: 'Please enter a valid email address.' 
  }),
  password: z
    .string()
    .min(12, { message: 'Mật khẩu phải có ít nhất 12 ký tự.' })
    .regex(/[a-z]/, { message: 'Mật khẩu phải chứa ít nhất một chữ thường.' })
    .regex(/[A-Z]/, { message: 'Mật khẩu phải chứa ít nhất một chữ hoa.' })
    .regex(/[0-9]/, { message: 'Mật khẩu phải chứa ít nhất một số.' })
    .regex(/[\W_]/, { message: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt.' }),
  repassword: z.string()
});

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

const ChangePassSchema = z.object({
  newPassword: z.string().min(6),
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

export async function updateOrder(
  id: string, // <-- SỬA: Thêm ID làm tham số
  prevState: State,
  formData: FormData,
) {
  // 1. Validate ID
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return { message: 'Invalid Order ID.' };
  }

  // 2. Validate Form
  const validatedFields = UpdateOrder.safeParse({
    userId: formData.get('customerId'),
    total: formData.get('total'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Please check the form again.',
    };
  }
  const { userId, total, status } = validatedFields.data;

  // 3. Update Database
  try {
    await prisma.order.update({
      where: {
        id: numericId, // <-- SỬA: Dùng ID đã validate
      },
      data: {
        userId: userId,
        total: total,
        status: status,
      },
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update order.',
    };
  }

  revalidatePath('/dashboard/orders');
  revalidatePath(`/dashboard/orders/${numericId}/edit`); // Thêm revalidate cho trang edit
  redirect('/dashboard/orders');
}

export async function deleteOrder(id:string) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    console.error('Invalid ID for deletion:', id);
    throw new Error('Invalid ID.');
  }
  try {
    await prisma.order.delete({
      where: {
        id: numericId, 
      },
    });
    revalidatePath('/dashboard/orders');
  } catch (error) {
    console.error('Delete Error:', error);
    throw new Error('Database Error: Failed to delete order.');
  }
  revalidatePath('/dashboard/orders');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // 1. Lấy token từ form (Cloudflare Turnstile tự động thêm input này)
    const token = formData.get('cf-turnstile-response') as string;
    
    // 2. Kiểm tra Token với Cloudflare (Server-side validation)
    // Nếu không có token (chưa tick vào widget) hoặc token giả mạo -> Chặn luôn
    if (!token) {
      return 'Vui lòng xác thực bạn không phải là robot.';
    }
    
    const isHuman = await verifyTurnstileToken(token);
    
    if (!isHuman) {
      return 'Xác thực robot thất bại. Vui lòng thử lại.';
    }

    // 3. Nếu là người thật, mới cho phép tiếp tục đăng nhập
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

export async function register(
  prevState: string | undefined, // <-- 'prevState' (sẽ là 'errorMessage' trong Form)
  formData: FormData,
) {
  // 3. Lấy dữ liệu từ Form
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = registerSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return validatedFields.error.errors[0].message; // Trả về 'string' lỗi
  }

  const { email, password, repassword } = validatedFields.data;

  // 4. Kiểm tra mật khẩu khớp
  if (password !== repassword) {
    return 'Passwords do not match.'; // Trả về 'string' lỗi
  }

  try {
    // 5. Kiểm tra email tồn tại
    const existingUser = await prisma.user.findFirst({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return 'An account with this email already exists.'; // Trả về 'string' lỗi
    }

    // 6. Băm mật khẩu (Rất quan trọng)
    const hashedPassword = await bcrypt.hash(password, 10); 

    // 7. Tạo người dùng mới (Mặc định role = 0)
    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: email.split('@')[0], 
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    return 'Failed to create account. Please try again.'; // Trả về 'string' lỗi
  }
  
  // 8. Đăng ký thành công -> Chuyển hướng đến trang Đăng nhập
  redirect('/login');
}

export async function changePassword(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return 'Chưa đăng nhập';

  const parsed = ChangePassSchema.safeParse({
    newPassword: formData.get('newPassword'),
  });

  if (!parsed.success) return 'Mật khẩu phải có ít nhất 6 ký tự';

  // Mã hóa mật khẩu mới
  const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 10);

  try {
    await prisma.user.update({
      where: { id: Number(session.user.id) },
      data: {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      },
    });
  } catch (e) {
    return 'Lỗi cơ sở dữ liệu';
  }

  await signIn("credentials", {
    email: session.user.email,
    password: parsed.data.newPassword,
    redirect: false,
  });

  // Đổi xong thì redirect về đúng nơi
  redirect(session.user.role === 1 ? '/dashboard' : '/userDashboard');
}

export async function deleteCategory(id: string) {
  // 1. Validate ID
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    console.error('Invalid ID for deletion:', id);
    throw new Error('Invalid ID.');
  }

  // 2. Delete Database (thêm try...catch)
  try {
    await prisma.category.delete({
      where: {
        id: numericId, // <-- SỬA: Dùng ID đã validate
      },
    });
    revalidatePath('/dashboard/categories');
  } catch (error) {
    console.error('Delete Error:', error);
    throw new Error('Database Error: Failed to delete category.');
  }
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

export async function updateCategory(
  id: string, // <-- SỬA: Thêm ID làm tham số
  prevState: CategoryState,
  formData: FormData,
) {
  // 1. Validate ID
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return { message: 'Invalid Category ID.' };
  }

  // 2. Validate Form
  const validatedFields = UpdateCategory.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Please check the form again.',
    };
  }
  const { name } = validatedFields.data;

  // 3. Update Database
  try {
    await prisma.category.update({
      where: {
        id: numericId, // <-- SỬA: Dùng ID đã validate
      },
      data: {
        name: name,
      },
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update category.',
    };
  }

  revalidatePath('/dashboard/categories');
  revalidatePath(`/dashboard/categories/${numericId}/edit`); // Thêm revalidate cho trang edit
  redirect('/dashboard/categories');
}

export async function deleteBrand(id: string) {
  // 1. Validate ID
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    console.error('Invalid ID for deletion:', id);
    throw new Error('Invalid ID.');
  }

  // 2. Delete Database (thêm try...catch)
  try {
    await prisma.brand.delete({
      where: {
        id: numericId, // <-- SỬA: Dùng ID đã validate
      },
    });
    revalidatePath('/dashboard/brands');
  } catch (error) {
    console.error('Delete Error:', error);
    throw new Error('Database Error: Failed to delete brand.');
  }
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

export async function updateBrand(
  id: string, // <-- SỬA: Thêm ID làm tham số
  prevState: BrandState,
  formData: FormData,
) {
  // 1. Validate ID
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return { message: 'Invalid Brand ID.' };
  }

  // 2. Validate Form
  const validatedFields = UpdateBrand.safeParse({
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Please check the form again.',
    };
  }
  const { name } = validatedFields.data;

  // 3. Update Database
  try {
    await prisma.brand.update({
      where: {
        id: numericId, // <-- SỬA: Dùng ID đã validate
      },
      data: {
        name: name,
      },
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update brand.',
    };
  }

  revalidatePath('/dashboard/brands');
  revalidatePath(`/dashboard/brands/${numericId}/edit`);
  redirect('/dashboard/brands');
}

