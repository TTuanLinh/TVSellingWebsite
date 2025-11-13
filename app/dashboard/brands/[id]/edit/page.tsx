import Form from '@/app/ui/brands/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchBrandsById } from '@/app/lib/data';
import { Suspense } from 'react';
 
export default async function Page(props: { params: { id: string } }) {
  const id = props.params.id;

  return (
    <main>
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
      <Suspense fallback={<div>Loading...</div>}>
        <EditFormLoader id={id} />
      </Suspense>
    </main>
  );
}

async function EditFormLoader({ id }: { id: string }) {
  // Dữ liệu động được fetch ở đây
  const brand = await fetchBrandsById(id);
  return <Form brand={brand} />;
}