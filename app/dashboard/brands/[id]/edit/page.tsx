import Form from '@/app/ui/brands/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchBrandsById } from '@/app/lib/data';
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
  const brand = await fetchBrandsById(id);

  if (!brand) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Brands', href: '/dashboard/brands' },
          {
            label: 'Edit Brand',
            href: `/dashboard/brands/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form brand={brand} />
    </>
  );
}