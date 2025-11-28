import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/brands/table';
import { CreateBrand } from '@/app/ui/brands/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchBrandsPages } from '@/app/lib/data';

// 1. Component "Vỏ" (Shell): Chỉ truyền Promise xuống dưới, KHÔNG async
export default function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Brands</h1>
      </div>
      
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* Search được bọc Suspense giống mẫu bạn gửi */}
        <Suspense fallback={<div>Loading Search...</div>}>
          <Search placeholder="Search Brands..." />
        </Suspense>
        <CreateBrand />
      </div>
      
      {/* 2. Suspense cho Table (Wrapper) */}
      <Suspense fallback={<InvoicesTableSkeleton />}>
        <BrandsTableWrapper searchParams={props.searchParams} />
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
async function BrandsTableWrapper({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  // Await dữ liệu động Ở ĐÂY (bên trong Suspense)
  const params = await searchParams;
  const query = params?.query || '';
  const currentPage = Number(params?.page) || 1;

  // Truyền dữ liệu xuống Table
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

  // Fetch tổng số trang brands
  const totalPages = await fetchBrandsPages(query);

  return <Pagination totalPages={totalPages} />;
}