import prisma from '@/app/lib/prisma';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

// Component chính: Chỉ render khung (Shell)
export default function OrdersPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
      
      <Suspense fallback={<OrdersLoading />}>
        <OrderList />
      </Suspense>
    </div>
  );
}

// Component con: Xử lý dữ liệu nặng (Auth + DB)
async function OrderList() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }
  
  const userId = Number(session.user.id);

  // Lấy đơn hàng của user này (trừ giỏ hàng đang pending)
  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
      status: { not: 0 }, 
    },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { orderDetails: true } }
    }
  });

  if (orders.length === 0) {
    return <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SL SP</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                #{order.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.createdAt.toLocaleDateString('vi-VN', {
                  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                {order.total.toLocaleString('vi-VN')} đ
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order._count.orderDetails} sản phẩm
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${order.status === 1 
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                    : 'bg-green-100 text-green-800 border border-green-200'}`}>
                  {order.status === 1 ? 'Chờ thanh toán' : 'Hoàn tất'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {order.status === 1 && (
                  <Link 
                    // Lưu ý: Cập nhật đường dẫn này cho khớp với folder của bạn (ví dụ: /userDashboard/payment/...)
                    href={`/userDashboard/payment/${order.id}`}
                    className="inline-block text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md transition-colors shadow-sm text-xs"
                  >
                    Thanh toán
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Component Loading (Skeleton)
function OrdersLoading() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="h-12 bg-gray-100 border-b border-gray-200"></div>
      
      {/* Rows Skeleton */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
           <div className="h-4 w-12 bg-gray-200 rounded"></div> {/* ID */}
           <div className="h-4 w-24 bg-gray-200 rounded"></div> {/* Date */}
           <div className="h-4 w-20 bg-gray-200 rounded"></div> {/* Total */}
           <div className="h-4 w-16 bg-gray-200 rounded"></div> {/* Count */}
           <div className="h-6 w-24 bg-gray-200 rounded-full"></div> {/* Status */}
           <div className="h-8 w-20 bg-gray-200 rounded"></div> {/* Button */}
        </div>
      ))}
    </div>
  );
}