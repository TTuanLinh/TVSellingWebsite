import ChangePasswordForm from '@/app/ui/change-password-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Suspense } from 'react';

// 2. Page cha KHÔNG "async"
export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Profile', href: '/dashboard/profile' },
          {
            label: 'Change Password',
            href: '/dashboard/profile/change-password',
            active: true,
          },
        ]}
      />
      <div className="max-w-md mx-auto mt-10">
        <ChangePasswordForm />
      </div>
    </main>
  );
}