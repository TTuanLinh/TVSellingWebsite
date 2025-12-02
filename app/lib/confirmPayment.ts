'use server';

// CHÚ Ý: Đảm bảo đường dẫn này trỏ đúng file cấu hình Prisma Client của bạn
// Dựa theo file auth.ts của bạn thì nó là: '@/app/lib/prisma'
import prisma from '@/app/lib/prisma'; 
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth'; 

export async function confirmPayment(orderId: number) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const userId = Number(session.user.id);

  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });

  if (!order || order.userId !== userId) {
    throw new Error("Bạn không có quyền thao tác.");
  }

  // Chỉ cho phép thanh toán nếu đơn đang ở trạng thái Pending (1)
  if (order.status !== 1) {
    throw new Error("Đơn hàng không ở trạng thái chờ thanh toán.");
  }

  // Cập nhật trạng thái thành Đã thanh toán (2)
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 2, 
      updatedAt: new Date()
    }
  });

  revalidatePath('/userDashboard/orders');
  redirect('/userDashboard/orders');
}