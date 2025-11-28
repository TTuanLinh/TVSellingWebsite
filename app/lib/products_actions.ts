'use server';

import { z } from 'zod';
import prisma from './prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import cloudinary from './cloudinary'; // Đảm bảo file này đã cấu hình đúng

const ProductFormSchema = z.object({
  id: z.coerce.number(),
  name: z.string().min(1, { message: 'Product name is required.' }),
  price: z.coerce.number().gt(0, { message: 'Price must be greater than 0.' }),
  // (FIX) Image có thể null/undefined (để không bắt buộc khi update)
  image: z.string().optional().nullable(), 
  description: z.string().optional(),
  specification: z.string().optional(),
  size: z.coerce.number().gt(0, { message: "Size must be valid" }).optional(),
  quantity: z.coerce.number().min(0, { message: 'Quantity must be a non-negative number.' }),
  brandId: z.coerce.number().gt(0, { message: 'Please select a brand.' }),
  categoryId: z.coerce.number().gt(0, { message: 'Please select a category.' }),
});

const UpdateProduct = ProductFormSchema.omit({});
const CreateProduct = ProductFormSchema.omit({ id: true });

export type ProductState = {
  errors?: {
    name?: string[];
    price?: string[];
    image?: string[];
    description?: string[];
    specification?: string[];
    size?: string[];
    quantity?: string[];
    brandId?: string[];
    categoryId?: string[];
  };
  message: string | null;
};

export async function deleteProduct(id: string) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error('Invalid ID.');
  }
  try {
    // Soft delete
    await prisma.product.update({
      where: { id: numericId },
      data: { deletedAt: new Date() },
    });
    revalidatePath('/dashboard/products');
  } catch (error) {
    throw new Error('Database Error: Failed to delete product.');
  }
}

export async function createProduct(prevState: ProductState, formData: FormData) {
  const imageFile = formData.get('image') as File;
  let imageUrl = '';

  if (imageFile && imageFile.size > 0) {
    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
      
      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: 'tivi_shop_products',
        resource_type: 'auto',
        timeout: 60000,
      });
      imageUrl = uploadResponse.secure_url;
    } catch (error) {
      return { message: 'Failed to upload image.' };
    }
  }

  const validatedFields = CreateProduct.safeParse({
    name: formData.get('name'),
    price: formData.get('price'),
    image: imageUrl,
    description: formData.get('description'),
    specification: formData.get('specification'),
    size: formData.get('size'),
    quantity: formData.get('quantity'),
    brandId: formData.get('brandId'),
    categoryId: formData.get('categoryId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Please check the form again.',
    }
  }

  const { name, price, description, specification, size, quantity, brandId, categoryId } = validatedFields.data;
  
  try {
    await prisma.product.create({
      data: {
        name, price, image: imageUrl || null, description, specification, size, quantity, brandId, categoryId, buyTurn: 0,
      }
    });
  } catch (error) {
    return { message: 'Database Error: Failed to Create Product.' }
  }
  
  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

// --- HÀM UPDATE (ĐÃ SỬA) ---
export async function updateProduct(
  id: string,
  prevState: ProductState,
  formData: FormData,
) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return { message: 'Invalid Product ID.' };
  }

  const imageFile = formData.get('image') as File;
  
  // (FIX) Mặc định là undefined (để phân biệt với chuỗi rỗng)
  let newImageUrl: string | undefined = undefined; 

  // 1. Chỉ upload nếu có file mới được chọn
  if (imageFile && imageFile.size > 0) {
    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
      
      console.log('Uploading new image...');
      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: 'tivi_shop_products',
        resource_type: 'auto',
        timeout: 60000,
      });
      newImageUrl = uploadResponse.secure_url;
    } catch (error) {
      console.error('Cloudinary Error:', error);
      return { message: 'Failed to upload new image.' };
    }
  }

  const validatedFields = UpdateProduct.safeParse({
    id: numericId,
    name: formData.get('name'),
    price: formData.get('price'),
    image: newImageUrl, 
    description: formData.get('description'),
    specification: formData.get('specification'),
    size: formData.get('size'),
    quantity: formData.get('quantity'),
    brandId: formData.get('brandId'),
    categoryId: formData.get('categoryId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Please check the form again.',
    };
  }

  const { name, price, description, specification, size, quantity, brandId, categoryId } = validatedFields.data;

  try {
    const dataToUpdate: any = {
      name, 
      price, 
      description, 
      specification, 
      size, 
      quantity, 
      brandId, 
      categoryId
    };
    if (newImageUrl) {
      dataToUpdate.image = newImageUrl;
    }

    await prisma.product.update({
      where: { id: numericId },
      data: dataToUpdate,
    });
  } catch (error) {
    console.error('Update DB Error:', error);
    return { message: 'Database Error: Failed to Update product.' };
  }

  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}