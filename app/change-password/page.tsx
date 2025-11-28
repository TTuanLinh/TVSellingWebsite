import ChangePasswordForm from '@/app/ui/change-password-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Profile', href: '/dashboard' },
          {
            label: 'Change Password',
            href: '/change-password',
            active: true,
          },
        ]}
      />
      <div className="max-w-md mx-auto mt-10">
        <ChangePasswordForm isExpired={true}/>
      </div>
    </main>
  );
}