import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// 1. KHÔNG "gói" (wrap) hàm auth.
// 2. Chỉ cần export 'auth' trực tiếp từ NextAuth.
// 3. Logic 'callbacks.authorized' bên trong 'authConfig' (file kia)
//    sẽ tự động chạy vì 'authConfig' đã được truyền vào đây.
export default NextAuth(authConfig).auth;
 
// Matcher giữ nguyên để tối ưu hiệu suất
// Nó chỉ chạy logic 'authorized' trên các trang này
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/cart/:path*', 
    '/checkout/:path*',
    '/login',
    '/userDashboard/:path*'
  ],
};