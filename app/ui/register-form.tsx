'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useState, useActionState } from 'react';
import { register } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, formAction, isPending] = useActionState(
    register,
    undefined,
  );
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please sign up to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                minLength={6}
                pattern="(?=.*\d)(?=.*[a-zA-Z]).{6,}"
                title="Password must be at least 6 characters, including at least one letter and one number."
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="repassword"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="repassword"
                type="password"
                name="repassword"
                placeholder="Confirm your password"
                required
                minLength={6}
                pattern="(?=.*\d)(?=.*[a-zA-Z]).{6,}"
                title="Password must be at least 6 characters, including at least one letter and one number."
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="mt-4 flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            // Liên kết trạng thái
            checked={isTermsChecked}
            // Cập nhật trạng thái khi nhấp
            onChange={(e) => setIsTermsChecked(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="terms"
            className="ml-2 block text-sm text-gray-900"
          >
            I agree to the{' '}
            <Link
              href="/terms" // Thay đổi thành đường dẫn đến trang điều khoản
              className="font-medium text-blue-600 hover:text-blue-500"
              target="_blank" // Mở trong tab mới
            >
              Terms of Service
            </Link>
          </label>
        </div>
        <Button className="mt-4 w-full" aria-disabled={isPending || isTermsChecked} disabled={isPending || !isTermsChecked} type="submit">
          Sign up <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
          {/* Add form errors here */}
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">Have an account?</span>{' '}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Log in
          </Link>
        </div>
      </div>
    </form>
  );
}
