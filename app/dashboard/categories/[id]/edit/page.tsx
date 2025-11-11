import Form from '@/app/ui/categories/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCategoriesById } from '@/app/lib/data';
 
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const category = await fetchCategoriesById(id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Categories', href: '/dashboard/categories' },
          {
            label: 'Edit Category',
            href: `/dashboard/categories/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form category={category} />
    </main>
  );
}