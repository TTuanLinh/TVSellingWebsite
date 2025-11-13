import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/brands/table';
import { CreateBrand } from '@/app/ui/brands/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchBrandsPages } from '@/app/lib/data';

/**
 * 1. Sửa typing của searchParams (bỏ Promise)
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
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Brands</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Suspense fallback={<div>Loading Search...</div>}>
          <Search placeholder="Search Brands..." />
        </Suspense>
        <CreateBrand />
      </div>

      {/* Suspense cho Table (Giữ nguyên) */}
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>

      {/* 3. THÊM SUSPENSE CHO PAGINATION */}
      <div className="mt-5 flex w-full justify-center">
        <Suspense fallback={<div>Loading pagination...</div>}>
          <PaginationWrapper query={query} />
        </Suspense>
      </div>
    </div>
  );
}

/**
 * 4. Tạo component con "async" để fetch totalPages
 */
async function PaginationWrapper({ query }: { query: string }) {
  const totalPages = await fetchBrandsPages(query);
  return <Pagination totalPages={totalPages} />;
}