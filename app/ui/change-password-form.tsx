'use client';

import { lusitana } from '@/app/ui/fonts';
import { KeyIcon, ExclamationCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useActionState } from 'react';
import { changePassword } from '@/app/lib/actions';

const PASSWORD_PATTERN = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{12,}$";
const PASSWORD_TITLE = "Mật khẩu phải có ít nhất 12 ký tự, bao gồm: chữ hoa, chữ thường, số và ký tự đặc biệt.";

// Thêm prop 'isExpired' để biết là bắt buộc hay tự nguyện
export default function ChangePasswordForm({ isExpired = false }: { isExpired?: boolean }) {
  const [errorMessage, formAction, isPending] = useActionState(changePassword, undefined);

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        
        {/* Logic hiển thị tiêu đề dựa trên 'isExpired' */}
        {isExpired ? (
          <h1 className={`${lusitana.className} mb-3 text-lg text-red-600 font-bold text-center`}>
            Mật khẩu hết hạn (90 ngày). Vui lòng đổi mật khẩu để tiếp tục.
          </h1>
        ) : (
          <h1 className={`${lusitana.className} mb-3 text-2xl text-gray-900 font-bold text-center`}>
            Đổi Mật Khẩu
          </h1>
        )}
        
        <div className="w-full">
          {/* (Các ô input giữ nguyên như cũ) */}
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="newPassword">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="newPassword"
                type="password"
                name="newPassword"
                placeholder="Nhập mật khẩu mới"
                required
                minLength={12}
                pattern={PASSWORD_PATTERN}
                title={PASSWORD_TITLE}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="confirmPassword">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu mới"
                required
                minLength={12}
                pattern={PASSWORD_PATTERN}
                title={PASSWORD_TITLE}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        
        <Button className="mt-4 w-full" aria-disabled={isPending}>
          Đổi Mật Khẩu <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        
        <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}