import Form from '@/app/ui/brands/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchBrandsById } from '@/app/lib/data';
 
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const brand = await fetchBrandsById(id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Brands', href: '/dashboard/brands' },
          {
            label: 'Edit Brand',
            href: `/dashboard/brands/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form brand={brand} />
    </main>
  );
}