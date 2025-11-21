import Form from '@/app/ui/categories/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCategoriesById } from '@/app/lib/data';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
 
export default function Page(props: { params: Promise<{ id: string }> }) {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <EditFormLoader params={props.params} />
      </Suspense>
    </main>
  );
}

async function EditFormLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await fetchCategoriesById(id);

  if (!category) {
    notFound();
  }

  return (
    <>
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
      <Form category={category} />
    </>
  );
}