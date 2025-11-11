import Form from '@/app/ui/brands/create-form'; 
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
 
export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Brands', href: '/dashboard/brands' },
          {
            label: 'Create brand',
            href: '/dashboard/brands/create',
            active: true,
          },
        ]}
      />
      <Form brands={[]} />
    </main>
  );
}