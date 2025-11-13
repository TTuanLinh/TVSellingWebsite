import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
import { Suspense } from 'react'; // 1. Import Suspense
// import { CreateFormSkeleton } from '@/app/ui/skeletons'; // Giả sử bạn có Skeleton

// 2. Page cha KHÔNG "async"
export default function Page() {
  return (
    <main>
      {/* 3. Breadcrumbs render ngay lập tức */}
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Orders', href: '/dashboard/orders' },
          {
            label: 'Create Order',
            href: '/dashboard/orders/create',
            active: true,
          },
        ]}
      />
      {/* 4. Bọc phần động (Form) trong Suspense */}
      <Suspense fallback={<div>Loading form...</div> /* Hoặc <CreateFormSkeleton /> */}>
        <CreateFormWrapper />
      </Suspense>
    </main>
  );
}
 
// 5. Component con "async" để fetch dữ liệu
async function CreateFormWrapper() {
  const customers = await fetchCustomers();
  return <Form customers={customers} />;
}