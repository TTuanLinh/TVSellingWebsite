import Form from '@/app/ui/customers/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomersById } from '@/app/lib/customers_data';
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
  const customer = await fetchCustomersById(id);

  if (!customer) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: 'Edit Customer',
            href: `/dashboard/customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form customer={customer} />
    </>
  );
}