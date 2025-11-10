import type { NextAuthConfig, DefaultSession } from 'next-auth';
import 'next-auth';
import 'next-auth/jwt';
// import { inter } from './app/ui/fonts'; // (Bình luận hoặc xóa dòng này nếu không dùng)

// Khai báo kiểu (type)
declare module 'next-auth' {
  interface User {
    role?: number | null;
  }
  interface Session {
    user: {
      role?: number | null;
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
    async jwt({ token, user }) {
      console.log('JWT callback:', { tokenBefore: token, user }); // Log của bạn
      if (user) {
        token.role = user.role;
      }
      console.log('JWT after set:', token); // Log của bạn
      return token;
    },
    
    // Logic gắn 'role' vào Session (chạy khi gọi await auth())
    async session({ session, token }) {
      console.log('Session callback:', { session, token }); // Log của bạn
      if (session.user) {
        session.user.id = token.sub || (token.id as string); 
        session.user.role = token.role;
      }
      console.log('Session after set:', session); // Log của bạn
      return session;
    },
  },
  providers: [], // Luôn để trống ở file config
} satisfies NextAuthConfig;