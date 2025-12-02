import prisma from '@/app/lib/prisma';
import { submitOrder } from '@/app/lib/cart-actions';
import { auth } from '@/auth'; // Import auth
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function CartPage() {
  // 1. Xác thực session
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = Number(session.user.id);

  // 2. Lấy dữ liệu với userId thật
  const cart = await prisma.order.findFirst({
    where: {
      userId: userId,
      status: 0,
    },
    include: {
      orderDetails: {
        include: { product: true },
        orderBy: { createdAt: 'desc' } // Sắp xếp sản phẩm mới thêm lên đầu
      }
    }
  });

  if (!cart || cart.orderDetails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-xl text-gray-500">Giỏ hàng của bạn đang trống</p>
        <a href="/dashboard" className="text-blue-600 hover:underline">
          Quay lại mua sắm
        </a>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
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
                        src={item.product?.image || ''} 
                        alt={item.product?.name || ''} 
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
    </div>
  );
}