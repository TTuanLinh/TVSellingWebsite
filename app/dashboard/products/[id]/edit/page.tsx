import Form from '@/app/ui/products/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchProductsById, fetchCategories, fetchBrands } from '@/app/lib/products_data';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export default function Page(props: { params: Promise<{ id: string }> }) {
  return (
    <main>
      <Suspense fallback={<div>Loading editor...</div>}>
        <EditProductContent params={props.params} />
      </Suspense>
    </main>
  );
}

// 3. Component "Nội dung" (Content): Nơi thực sự xử lý dữ liệu
async function EditProductContent({ params }: { params: Promise<{ id: string }> }) {
  // Bây giờ chúng ta mới await params (An toàn vì đang ở trong Suspense)
  const { id } = await params;

  // Gọi dữ liệu song song
  const [product, categories, brands] = await Promise.all([
    fetchProductsById(id),
    fetchCategories(),
    fetchBrands()
  ]);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/dashboard/products' },
          {
            label: 'Edit Product',
            href: `/dashboard/products/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form product={product} categories={categories} brands={brands} />
    </>
  );
}