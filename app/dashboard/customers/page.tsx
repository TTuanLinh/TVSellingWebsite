import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/customers/table'; 
import { CreateCustomer } from '@/app/ui/customers/buttons'; 
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons'; 
import { Suspense } from 'react';
import { fetchCustomersPages } from '@/app/lib/customers_data';

// 1. Component "Vỏ" (Shell): Chỉ truyền Promise xuống dưới
export default function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
      </div>
      
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* Search là Client Component nên tự dùng useSearchParams */}
        <Suspense fallback={<div>Loading search...</div>}>
          <Search placeholder="Search Customers..." />
        </Suspense>
        <CreateCustomer />
      </div>
      
      {/* 2. Suspense cho Table (Wrapper) */}
      <Suspense fallback={<InvoicesTableSkeleton />}>
        <CustomersTableWrapper searchParams={props.searchParams} />
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
async function CustomersTableWrapper({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
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
  const params = await searchParams;
  const query = params?.query || '';
  const totalPages = await fetchCustomersPages(query);

  return <Pagination totalPages={totalPages} />;
}