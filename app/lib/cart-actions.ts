'use server';

import prisma from './prisma'; // Đường dẫn tới file prisma client của bạn
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export async function addToCart(productId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }
  const userId = Number(session.user.id);

  if (session.user.role === 1) {
    throw new Error("Admin không thể thực hiện chức năng mua hàng");
  }
  // 1. Tìm xem user này có đơn hàng nào đang "Pending" (status = 0) không

  let order = await prisma.order.findFirst({
    where: {
      userId: userId,
      status: 0, // 0 nghĩa là Giỏ hàng đang mở
    },
    include: { orderDetails: true }
  });

  // 2. Nếu chưa có, tạo Order mới
  if (!order) {
    order = await prisma.order.create({
      data: {
        userId: userId,
        status: 0,
        total: 0,
      },
      include: { orderDetails: true }
    });
  }

  // 3. Lấy thông tin sản phẩm để lấy giá hiện tại
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) throw new Error('Sản phẩm không tồn tại');

  // 4. Kiểm tra xem sản phẩm này đã có trong OrderDetail của Order này chưa
  const existingDetail = await prisma.orderDetail.findFirst({
    where: {
      orderId: order.id,
      productId: productId,
    },
  });

  if (existingDetail) {
    // Nếu có rồi -> Tăng số lượng
    await prisma.orderDetail.update({
      where: { id: existingDetail.id },
      data: { quantity: existingDetail.quantity + 1 },
    });
  } else {
    // Nếu chưa có -> Tạo dòng mới trong OrderDetail
    await prisma.orderDetail.create({
      data: {
        orderId: order.id,
        productId: productId,
        price: product.price, // Lưu giá tại thời điểm mua
        quantity: 1,
      },
    });
  }

  // 5. Cập nhật lại tổng tiền (Total) cho Order
  // (Tính toán lại toàn bộ orderDetails để đảm bảo chính xác)
  const allDetails = await prisma.orderDetail.findMany({
    where: { orderId: order.id }
  });
  
  const newTotal = allDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  await prisma.order.update({
    where: { id: order.id },
    data: { total: newTotal }
  });

  // 6. Refresh lại cache để UI cập nhật số lượng giỏ hàng
  revalidatePath('/userDashboard');
  revalidatePath('/userDashboard/cart');
}

// Action xử lý nút "Tạo Hoá Đơn" (Checkout)
export async function submitOrder(orderId: number) {
  // Chuyển status từ 0 (Pending) sang 1 (Completed/Waiting Payment)
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 1, // Đã đặt hàng
      createdAt: new Date() // Cập nhật lại ngày tạo thành ngày chốt đơn
    }
  });

  revalidatePath('/userDashboard/orders');
  revalidatePath('/userDashboard/cart');
  redirect('/userDashboard/orders');
}