import Image from 'next/image';
import { UpdateProduct, DeleteProduct } from '@/app/ui/products/buttons';
import { formatDateToLocal } from '@/app/lib/utils';
import { fetchFilteredProducts } from '@/app/lib/products_data';

export default async function ProductsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const products = await fetchFilteredProducts(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile view */}
          <div className="md:hidden">
            {products?.map((product) => (
              <div
                key={product.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{product.name || 'Unknown category'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>{formatDateToLocal(product.createdAt.toISOString())}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateProduct id={product.id.toString()} />
                    <DeleteProduct id={product.id.toString()} />
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
                  Product
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Price
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Image
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Description
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Specification
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Size
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Quantity
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products?.map((product) => (
                <tr
                  key={product.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{product.name || 'Unknown product'}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-3 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{product.price.toFixed(2) || '0.00'}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {product.image ? (
                      <div className="flex items-center gap-3">
                        {/* Cách 1: Hiển thị ảnh thu nhỏ (Thumbnail) */}
                        <div className="relative h-10 w-10 overflow-hidden rounded-md border border-gray-200">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                            />
                        </div>
                        
                        {/* Cách 2: Hiển thị Link rút gọn "Xem ảnh" */}
                        <a 
                          href={product.image} 
                          target="_blank" // Mở tab mới
                          rel="noopener noreferrer" // Bảo mật
                          className="text-blue-600 hover:underline"
                        >
                          Xem
                        </a>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No Image</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-3 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{product.description || 'No description'}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-3 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{product.specification || 'No specification'}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-3 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{product.size || 'Unknown size'}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-3 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{product.quantity.toString() || '0'}</p>
                    </div>
                  </td> 
                      
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateProduct id={product.id.toString()} />
                      <DeleteProduct id={product.id.toString()} />
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
