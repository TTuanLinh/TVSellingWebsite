import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchOrdersPages } from '@/app/lib/data';

/**
 * 1. Sửa lại typing của searchParams (không cần Promise)
 * 2. Page KHÔNG còn "async"
 */
export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  // 3. Lấy query và page một cách đồng bộ (synchronously)
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Orders</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search orders..." />
        <CreateInvoice />
      </div>
      
      {/* Suspense cho Table (Giữ nguyên, đã đúng) */}
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      
      {/* 4. Thêm Suspense cho Pagination */}
      <div className="mt-5 flex w-full justify-center">
        <Suspense fallback={<div>Loading pagination...</div>}>
          <PaginationWrapper query={query} />
        </Suspense>
      </div>
    </div>
  );
}

/**
 * 5. Tạo component con "async" để fetch totalPages
 */
async function PaginationWrapper({ query }: { query: string }) {
  const totalPages = await fetchOrdersPages(query);
  return <Pagination totalPages={totalPages} />;
}