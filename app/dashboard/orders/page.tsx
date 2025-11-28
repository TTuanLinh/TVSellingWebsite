import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table'; // (Lưu ý: Bạn đang dùng Table của Orders)
import { CreateInvoice } from '@/app/ui/invoices/buttons'; // (Lưu ý: Bạn đang dùng Buttons của Orders)
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { fetchOrdersPages } from '@/app/lib/data';

// 1. Component "Vỏ" (Shell): Chỉ truyền Promise xuống dưới
export default function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  // KHÔNG await searchParams ở đây
  
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Orders</h1>
      </div>
      
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* Search là Client Component nên nó tự dùng useSearchParams(), không cần truyền prop */}
        <Suspense fallback={<div>Loading search...</div>}>
          <Search placeholder="Search Orders..." />
        </Suspense>
        <CreateInvoice />
      </div>
      
      {/* 2. Suspense cho Table (Wrapper) */}
      <Suspense fallback={<InvoicesTableSkeleton />}>
        <OrdersTableWrapper searchParams={props.searchParams} />
      </Suspense>
      
      {/* 3. Suspense cho Pagination (Wrapper) */}
      <div className="mt-5 flex w-full justify-center">
        <Suspense fallback={<div>Loading pagination...</div>}>
          <PaginationWrapper searchParams={props.searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

// --- CÁC COMPONENT CON (Nơi thực sự lấy dữ liệu) ---

// Wrapper cho Table
async function OrdersTableWrapper({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  // Await dữ liệu động Ở ĐÂY (bên trong Suspense)
  const params = await searchParams;
  const query = params?.query || '';
  const currentPage = Number(params?.page) || 1;

  return <Table query={query} currentPage={currentPage} />;
}

// Wrapper cho Pagination
async function PaginationWrapper({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  // Await dữ liệu động Ở ĐÂY (bên trong Suspense)
  const params = await searchParams;
  const query = params?.query || '';

  const totalPages = await fetchOrdersPages(query);

  return <Pagination totalPages={totalPages} />;
}