import Link from 'next/link';
import { UserCircleIcon, KeyIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';

// Định nghĩa kiểu dữ liệu User (từ session)
type UserProfile = {
  name?: string | null;
  email?: string | null;
  role?: number | null;
  image?: string | null;
};

export default function ProfileView({ user }: { user: UserProfile }) {
  const changePasswordHref = user.role === 1 
    ? '/dashboard/profile/change-password' 
    : '/userDashboard/profile/change-password';
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-lg bg-gray-50 p-6 md:p-8 shadow-sm border border-gray-200">
        
        {/* Header: Avatar & Tên */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            {user.image ? (
              // Nếu có ảnh thì hiện ảnh (cần cấu hình next/image domain)
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <UserCircleIcon className="h-12 w-12" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name || 'Người dùng'}</h2>
            <p className="text-sm text-gray-500">
              Vai trò: <span className="font-medium text-blue-600">{user.role === 1 ? 'Quản trị viên (Admin)' : 'Khách hàng (User)'}</span>
            </p>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200">
                <UserIcon className="h-5 w-5 text-gray-500" />
             </div>
             <div>
                <p className="text-xs text-gray-500 font-medium">Họ và tên</p>
                <p className="text-gray-900">{user.name || 'Chưa cập nhật'}</p>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200">
                <EnvelopeIcon className="h-5 w-5 text-gray-500" />
             </div>
             <div>
                <p className="text-xs text-gray-500 font-medium">Email</p>
                <p className="text-gray-900">{user.email}</p>
             </div>
          </div>
        </div>

        {/* Nút Đổi mật khẩu */}
        <div className="flex justify-end">
          <Link href={changePasswordHref}>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500">
              <KeyIcon className="h-5 w-5" />
              Đổi Mật Khẩu
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}