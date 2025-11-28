'use client';

import { Product } from '@prisma/client';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateProduct, ProductState } from '@/app/lib/products_actions';
import { useActionState } from 'react';

type CategoryField = {
  id: number;
  name: string;
};

type BrandField = {
  id: number;
  name: string;
};

export default function EditProductForm({
  categories,
  brands,
  product,
}: {
  categories: CategoryField[];
  brands: BrandField[];
  product: Product,
}) {
  const updateProductWithId = updateProduct.bind(null, product.id.toString());
  const initialState: ProductState = { message: null, errors: {} };
  const [state, formAction] = useActionState(updateProductWithId, initialState);
  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Enter product name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter product name"
              defaultValue={product.name}
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="name-error"
            >
            </input>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        {/* Image */}
        <div className="mb-4">
          <label htmlFor="image" className="mb-2 block text-sm font-medium">
            Product Image
          </label>
          <div className="relative">
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              aria-describedby="image-error"
            />
          </div>
          <div id="image-error" aria-live="polite" aria-atomic="true">
            {state.errors?.image &&
              state.errors.image.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
              ))}
          </div>
        </div>
        {/* Category & Brand */}
        <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Category Dropdown */}
          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-medium">
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                name="categoryId"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={product.categoryId}
                aria-describedby="category-error"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div id="category-error" aria-live="polite" aria-atomic="true">
                {state.errors?.categoryId && state.errors.categoryId.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                ))}
            </div>
          </div>

          {/* Brand Dropdown */}
          <div>
            <label htmlFor="brand" className="mb-2 block text-sm font-medium">
              Brand
            </label>
            <div className="relative">
              <select
                id="brand"
                name="brandId"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={product.brandId}
                aria-describedby="brand-error"
              >
                <option value="" disabled>Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div id="brand-error" aria-live="polite" aria-atomic="true">
                {state.errors?.brandId && state.errors.brandId.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                ))}
            </div>
          </div>
        </div>
        {/* Price & Quantity */}
        <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Price */}
          <div>
            <label htmlFor="price" className="mb-2 block text-sm font-medium">
              Price
            </label>
            <div className="relative">
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                placeholder="Enter price"
                defaultValue={product.price}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="price-error"
              />
            </div>
            <div id="price-error" aria-live="polite" aria-atomic="true">
                {state.errors?.price && state.errors.price.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
              Quantity
            </label>
            <div className="relative">
              <input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="Enter quantity"
                defaultValue={product.quantity}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="quantity-error"
              />
            </div>
            <div id="quantity-error" aria-live="polite" aria-atomic="true">
                {state.errors?.quantity && state.errors.quantity.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
                ))}
            </div>
          </div>
        </div>
        {/* Size */}
        <div className="mb-4">
          <label htmlFor="size" className="mb-2 block text-sm font-medium">
            Size (inch)
          </label>
          <div className="relative">
            <input
              id="size"
              name="size"
              type="number"
              placeholder="Enter size (e.g. 55)"
              defaultValue={product.size || 'Unknown'} 
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="size-error"
            />
          </div>
          <div id="size-error" aria-live="polite" aria-atomic="true">
            {state.errors?.size && state.errors.size.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
            ))}
          </div>
        </div>
        {/* Specification */}
        <div className="mb-4">
          <label htmlFor="specification" className="mb-2 block text-sm font-medium">
            Specification
          </label>
          <div className="relative">
            <textarea
              id="specification"
              name="specification"
              placeholder="Enter product specifications..."
              defaultValue={product.specification || 'Unknown'}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 min-h-[100px]"
              aria-describedby="specification-error"
            />
          </div>
          <div id="specification-error" aria-live="polite" aria-atomic="true">
            {state.errors?.specification && state.errors.specification.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
            ))}
          </div>
        </div>
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter product description..."
            defaultValue={product.description || "No description"}
            className="peer block w-full rounded-md border border-gray-200 p-2 text-sm outline-2 placeholder:text-gray-500 min-h-[100px]"
          />
        </div>

        {/* Hiển thị lỗi chung từ Database */}
        <div aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/products"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Product</Button>
      </div>
    </form>
  );
}
