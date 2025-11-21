import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchOrdersPages } from '@/app/lib/data';

export default async function Page(props:{
  searchParams?: Promise<{ query?: string; page?: string; }>;
}) {
  const searchParams = await props.searchParams;
  
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Orders</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Suspense fallback={<div>Loading Search...</div>}>
          <Search placeholder="Search Orders..." />
        </Suspense>
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