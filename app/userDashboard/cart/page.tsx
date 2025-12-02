import prisma from '@/app/lib/prisma';
import { submitOrder } from '@/app/lib/cart-actions'; // Giữ nguyên đường dẫn import của bạn
import { auth } from '@/auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

// 1. Component Chính: Chỉ đóng vai trò là khung (Shell)
export default function CartPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto min-h-[80vh]">
      {/* Suspense sẽ hiển thị CartLoading ngay lập tức trong khi chờ CartDetails tải dữ liệu */}
      <Suspense fallback={<CartLoading />}>
        <CartDetails />
      </Suspense>
    </div>
  );
}

// 2. Component Con: Xử lý logic nặng (Auth, Database)
async function CartDetails() {
  // Xác thực session
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = Number(session.user.id);

  // Lấy dữ liệu
  const cart = await prisma.order.findFirst({
    where: {
      userId: userId,
      status: 0,
    },
    include: {
      orderDetails: {
        include: { product: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  // Xử lý giỏ hàng trống
  if (!cart || cart.orderDetails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-xl text-gray-500">Giỏ hàng của bạn đang trống</p>
        <a href="/userDashboard" className="text-blue-600 hover:underline">
          Quay lại mua sắm
        </a>
      </div>
    );
  }

  // Render giỏ hàng
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng của {session.user.name}</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cart.orderDetails.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                      <Image 
                        src={item.product?.image || '/placeholder.png'} 
                        alt={item.product?.name || 'Product'} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{item.product?.name}</div>
                      <div className="text-xs text-gray-500">Mã: #{item.productId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.price.toLocaleString('vi-VN')} đ
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                  {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-end gap-6 border-t pt-6">
        <div className="text-2xl font-bold">
          Tổng cộng: <span className="text-blue-600">{cart.total.toLocaleString('vi-VN')} đ</span>
        </div>
        
        <form action={submitOrder.bind(null, cart.id)}>
          <button 
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium shadow-lg transition-transform active:scale-95"
          >
            Tạo Hoá Đơn (Đặt hàng)
          </button>
        </form>
      </div>
    </>
  );
}

// 3. Component Loading: Hiển thị khung xương khi đang tải
function CartLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="h-12 bg-gray-100 border-b border-gray-200"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center p-4 border-b border-gray-100">
            <div className="h-16 w-16 bg-gray-200 rounded mr-4"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/6"></div>
            </div>
            <div className="h-4 w-20 bg-gray-200 rounded mx-4"></div>
            <div className="h-4 w-10 bg-gray-200 rounded mx-4"></div>
            <div className="h-4 w-24 bg-gray-200 rounded ml-4"></div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-end gap-4">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        <div className="h-12 w-40 bg-blue-200 rounded"></div>
      </div>
    </div>
  );
}