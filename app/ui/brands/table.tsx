import Image from 'next/image';
import { UpdateBrand, DeleteBrand } from '@/app/ui/brands/buttons';
import { formatDateToLocal } from '@/app/lib/utils';
import { fetchFilteredBrands } from '@/app/lib/data';

export default async function BrandsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const brands = await fetchFilteredBrands(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile view */}
          <div className="md:hidden">
            {brands?.map((brand) => (
              <div
                key={brand.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{brand.name || 'Unknown brand'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>{formatDateToLocal(brand.createdAt.toISOString())}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateBrand id={brand.id.toString()} />
                    <DeleteBrand id={brand.id.toString()} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Brand
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Add Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total products
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {brands?.map((brand) => (
                <tr
                  key={brand.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{brand.name || 'Unknown brand'}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(brand.createdAt.toISOString())}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateBrand id={brand.id.toString()} />
                      <DeleteBrand id={brand.id.toString()} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
