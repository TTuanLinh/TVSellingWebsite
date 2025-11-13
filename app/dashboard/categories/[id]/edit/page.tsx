import Form from '@/app/ui/categories/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCategoriesById } from '@/app/lib/data';
import { Suspense } from 'react';
 
export default function Page(props: { params: { id: string } }) {
  const id = props.params.id;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Categories', href: '/dashboard/categories' },
          {
            label: 'Edit Category',
            href: `/dashboard/categories/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <EditFormLoader id={id} />
      </Suspense>
    </main>
  );
}

async function EditFormLoader({ id }: { id: string }) {
  // Dữ liệu động được fetch ở đây
  const category = await fetchCategoriesById(id);

  // (Nên thêm: if (!brand) { notFound(); } )

  return <Form category={category} />
}