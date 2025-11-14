import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchOrdersById } from '@/app/lib/data';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
 
export default function Page(props: { params: { id: string } }) {
  const id = props.params.id;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Suspense fallback={<div>Loading form...</div> /* Hoặc <EditFormSkeleton /> */}>
        <EditInvoiceLoader id={id} />
      </Suspense>
    </main>
  );
}

async function EditInvoiceLoader({ id }: { id: string }) {
  // Dữ liệu động được fetch ở đây
  const [order, customers] = await Promise.all([
    fetchOrdersById(id),
    fetchCustomers(),
  ]);

  // (Nên thêm: if (!order) { notFound(); } )
  if (!order) {
    notFound();
  }
  return <Form order={order} customers={customers} />;
}