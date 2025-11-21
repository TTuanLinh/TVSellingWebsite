import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchOrdersById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

// 1. Component "Vỏ" (Shell): Không được await dữ liệu động ở đây
export default function Page(props: { params: Promise<{ id: string }> }) {
  // LƯU Ý: KHÔNG 'await props.params' ở đây.
  // Truyền thẳng Promise xuống component con.
  
  return (
    <main>
      {/* 2. Bọc toàn bộ phần nội dung động (bao gồm cả Breadcrumbs và Form) vào Suspense */}
      <Suspense fallback={<div>Loading editor...</div>}>
        <EditOrderContent params={props.params} />
      </Suspense>
    </main>
  );
}

// 3. Component "Nội dung" (Content): Nơi thực sự xử lý dữ liệu
async function EditOrderContent({ params }: { params: Promise<{ id: string }> }) {
  // Bây giờ chúng ta mới await params (An toàn vì đang ở trong Suspense)
  const { id } = await params;

  // Gọi dữ liệu song song
  const [order, customers] = await Promise.all([
    fetchOrdersById(id),
    fetchCustomers(),
  ]);

  if (!order) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Orders', href: '/dashboard/orders' },
          {
            label: 'Edit Order',
            href: `/dashboard/orders/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form order={order} customers={customers} />
    </>
  );
}