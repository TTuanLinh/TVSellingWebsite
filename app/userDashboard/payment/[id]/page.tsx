import prisma from '@/app/lib/prisma';
import { auth } from '@/auth';
import { confirmPayment } from '@/app/lib/confirmPayment';
import { redirect, notFound } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, ArrowLeft, Copy } from 'lucide-react';
import { Suspense } from 'react';

// Component chính: Chỉ render khung và Suspense
export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  // await params ở đây vẫn ổn trong hầu hết trường hợp của Next.js 15, 
  // nhưng nếu vẫn lỗi strict, có thể cần chuyển xuống dưới. 
  // Tuy nhiên auth() mới là nguyên nhân chính gây lỗi blocking.
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Nút quay lại */}
        <a href="/userDashboard/orders" className="flex items-center text-gray-600 hover:text-gray-900 mb-6 w-fit">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại đơn hàng
        </a>

        <Suspense fallback={<PaymentLoading />}>
          <PaymentDetails orderIdStr={id} />
        </Suspense>
      </div>
    </div>
  );
}

// Component con: Xử lý dữ liệu nặng (Auth, DB)
async function PaymentDetails({ orderIdStr }: { orderIdStr: string }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const orderId = Number(orderIdStr);
  const userId = Number(session.user.id);

  // Lấy thông tin đơn hàng
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderDetails: {
        include: { product: true }
      }
    }
  });

  // Validate đơn hàng
  if (!order || order.userId !== userId) {
    notFound();
  }

  // Nếu đơn không phải trạng thái chờ thanh toán
  if (order.status !== 1) {
    redirect('/userDashboard/orders');
  }

  // Cấu hình VietQR
  const BANK_ID = 'MB'; 
  const ACCOUNT_NO = '123456789'; 
  const ACCOUNT_NAME = 'NGUYEN VAN A'; 
  const DESCRIPTION = `THANHTOAN DONHANG ${order.id}`; 
  
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.jpg?amount=${order.total}&addInfo=${DESCRIPTION}&accountName=${ACCOUNT_NAME}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Cột trái: Thông tin chuyển khoản & QR */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Quét mã để thanh toán</h2>
        
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 mb-6 border-2 border-blue-100 rounded-lg overflow-hidden">
            <Image 
              src={qrUrl} 
              alt="VietQR Payment" 
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          <div className="w-full space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Ngân hàng</span>
              <span className="font-medium">MB Bank</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Số tài khoản</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{ACCOUNT_NO}</span>
              </div>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Chủ tài khoản</span>
              <span className="font-medium uppercase">{ACCOUNT_NAME}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Số tiền</span>
              <span className="font-bold text-blue-600 text-lg">
                {order.total.toLocaleString('vi-VN')} đ
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Nội dung</span>
              <span className="font-medium text-red-500">{DESCRIPTION}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cột phải: Tóm tắt đơn hàng & Xác nhận */}
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex-grow">
          <h3 className="text-lg font-semibold mb-4">Chi tiết đơn hàng #{order.id}</h3>
          
          <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
            {order.orderDetails.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image 
                      src={item.product?.image || '/placeholder.png'} 
                      alt={item.product?.name || ''} 
                      fill
                      className="object-cover"
                    />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{item.product?.name}</p>
                  <p className="text-gray-500 text-xs">SL: {item.quantity}</p>
                </div>
                <div className="font-medium text-sm">
                  {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">Tổng thanh toán</span>
              <span className="text-2xl font-bold text-blue-600">
                {order.total.toLocaleString('vi-VN')} đ
              </span>
            </div>

            {/* Form xác nhận thanh toán */}
            <form action={confirmPayment.bind(null, order.id)}>
              <p className="text-xs text-gray-500 mb-3 text-center">
                Sau khi chuyển khoản thành công, vui lòng bấm nút bên dưới để hoàn tất.
              </p>
              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-all shadow-lg shadow-green-200 active:scale-[0.98]"
              >
                <CheckCircle className="w-5 h-5" />
                Xác nhận đã thanh toán
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component Loading đơn giản
function PaymentLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
      <div className="bg-white h-96 rounded-2xl"></div>
      <div className="bg-white h-96 rounded-2xl"></div>
    </div>
  );
}