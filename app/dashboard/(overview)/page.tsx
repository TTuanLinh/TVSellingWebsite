// 1. IMPORT CÁC COMPONENT GIAO DIỆN CỦA BẠN
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestOrder from '@/app/ui/dashboard/latest-invoices';
import { Card } from '@/app/ui/dashboard/cards';
import { lusitana } from '@/app/ui/fonts';

// 2. IMPORT CÁC HÀM FETCH DỮ LIỆU
// (Lưu ý: Bạn import 6 hàm, nhưng tôi gộp 4 hàm 'Card' vào 1 Promise.all ở dưới)
import {
  fetchRevenue,
  fetchLastestOrder,
  fetchCollectedOrder,
  fetchPendingOrder,
  fetchTotalOrder,
  fetchTotalCustomers,
} from '../../lib/data';

// 3. IMPORT SUSPENSE
import { Suspense } from 'react';

// 4. IMPORT CÁC SKELETON (KHUNG XƯƠNG)
// Đây là các component 'loading' để hiển thị trong fallback
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton, // <-- SKELETON NÀY SẼ CHỨA 4 CARD
} from '@/app/ui/skeletons';

/**
 * 5. COMPONENT CHA (PAGE)
 * - KHÔNG còn "async"
 * - Nhiệm vụ: Render layout TĨNH và các <Suspense> fallback
 */
export default function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>

      {/* PHẦN 1: CÁC CARD (GỘP CHUNG 1 SUSPENSE) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>

      {/* PHẦN 2: CHART VÀ LATEST ORDERS (2 SUSPENSE RIÊNG) */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChartWrapper />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestOrderWrapper />
        </Suspense>
      </div>
    </main>
  );
}

/**
 * 6. CÁC COMPONENT CON (WRAPPER)
 * - Đây là các component "async"
 * - Nhiệm vụ: Fetch dữ liệu và render component thực sự
 */

// COMPONENT CON CHO CÁC CARD
async function CardWrapper() {
  // Chạy 4 truy vấn song song để tăng tốc
  const [
    collectedOrder,
    pendingOrder,
    totalOrder,
    totalCustomers
  ] = await Promise.all([
    fetchCollectedOrder(),
    fetchPendingOrder(),
    fetchTotalOrder(),
    fetchTotalCustomers(),
  ]);

  return (
    <>
      <Card title="Collected" value={collectedOrder + 'đ'} type="collected" />
      <Card title="Pending" value={pendingOrder} type="pending" />
      <Card title="Total Orders" value={totalOrder} type="invoices" />
      <Card title="Total Customers" value={totalCustomers} type="customers" />
    </>
  );
}

// COMPONENT CON CHO REVENUE CHART
async function RevenueChartWrapper() {
  const revenue = await fetchRevenue();
  return <RevenueChart revenue={revenue} />;
}

// COMPONENT CON CHO LATEST ORDER
async function LatestOrderWrapper() {
  const latestOrder = await fetchLastestOrder();
  return <LatestOrder latestOrder={latestOrder} />;
}