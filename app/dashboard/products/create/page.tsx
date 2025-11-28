import Form from '@/app/ui/products/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCategories, fetchBrands } from '@/app/lib/products_data';
import { Suspense } from 'react';

// 2. Page cha KHÔNG "async"
export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/dashboard/products' },
          {
            label: 'Create Product',
            href: '/dashboard/products/create',
            active: true,
          },
        ]}
      />
      <Suspense fallback={<div>Loading form...</div>}>
        <CreateFormWrapper />
      </Suspense>
    </main>
  );
}
 
// 5. Component con "async" để fetch dữ liệu
async function CreateFormWrapper() {
  const brands = await fetchBrands();
  const categories = await fetchCategories();
  return <Form brands={brands} categories={categories}/>;
}