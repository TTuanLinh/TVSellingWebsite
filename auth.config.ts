import type { NextAuthConfig, DefaultSession } from 'next-auth';
import 'next-auth';
import 'next-auth/jwt';

// Khai báo kiểu (type)
declare module 'next-auth' {
  interface User {
    role?: number | null;
    passwordChangedAt?: Date | null;
  }
  interface Session {
    user: {
      role?: number | null;
      passwordChangedAt?: Date | null; // <-- Thêm trường này
      id: string;
    } & DefaultSession['user'];
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    role?: number | null;
  }
}
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // Logic "Gác cổng" Phân quyền (chạy ở proxy.ts)
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role; 
      const { pathname } = nextUrl;

      if (isLoggedIn) {
        // @ts-ignore: TypeScript có thể chưa nhận diện trường này ngay
        const passwordChangedAt = auth?.user?.passwordChangedAt
          ? new Date(auth.user.passwordChangedAt)
          : new Date();
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - passwordChangedAt.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const isExpired = diffDays > 90;
        const isOnChangePasswordPage = pathname === '/change-password';

        // Nếu hết hạn VÀ chưa ở trang đổi mật khẩu -> Bắt buộc chuyển hướng
        if (isExpired && !isOnChangePasswordPage) {
           return Response.redirect(new URL('/change-password', nextUrl));
        }

        // Nếu chưa hết hạn mà cố vào trang đổi mật khẩu -> Đá về trang chủ tương ứng
        if (!isExpired && isOnChangePasswordPage) {
           const homeUrl = userRole === 1 ? '/dashboard' : '/userDashboard';
           return Response.redirect(new URL(homeUrl, nextUrl));
        }

        console.log("passwordChangedAt =", passwordChangedAt);
        console.log("now =", now);
        console.log("diffDays =", diffDays);
      }

      // Logic Phân Quyền (Authorization)
      if (pathname.startsWith('/dashboard')) {
        if (!isLoggedIn) return false; // Chặn nếu chưa đăng nhập
        if (userRole === 1) return true; // Admin -> Cho phép
        if (userRole === 0) { // User -> Đá về /userDashboard
          return Response.redirect(new URL('/userDashboard', nextUrl));
        }
        return false; 
      }

      if (pathname.startsWith('/userDashboard')) {
         if (!isLoggedIn) return false; // Chặn nếu chưa đăng nhập
         if (userRole === 0) return true; // User (role 0) -> Cho phép
         if (userRole === 1) { // Admin (role 1) -> Đá về dashboard
           return Response.redirect(new URL('/dashboard', nextUrl));
         }
         return false;
      }
      
      if (pathname.startsWith('/cart') || pathname.startsWith('/checkout')) {
        if (!isLoggedIn) return false; 
        if (userRole === 0) return true; // User -> Cho phép
        if (userRole === 1) { // Admin -> Đá về dashboard
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return false;
      }
      
      if (isLoggedIn && pathname.startsWith('/login')) {
        return Response.redirect(new URL(userRole === 1 ? '/dashboard' : '/userDashboard', nextUrl));
      }
      return true; // Cho phép tất cả các request khác
    },

    // Logic gắn 'role' vào Token (chạy khi đăng nhập)
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.passwordChangedAt = user.passwordChangedAt
          ? user.passwordChangedAt.toISOString()
          : null;
      }

      if (trigger === 'update' && session?.passwordChangedAt) {
        token.passwordChangedAt = session.passwordChangedAt;
      }

      return token;
    },
    
    // Logic gắn 'role' vào Session (chạy khi gọi await auth())
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || (token.id as string);
        session.user.role = token.role;

        session.user.passwordChangedAt = token.passwordChangedAt
          ? new Date(token.passwordChangedAt as string)
          : null;
      }
      return session;
    }
  },
  providers: [], // Luôn để trống ở file config
} satisfies NextAuthConfig;