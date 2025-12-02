import { fetchProducts } from '@/app/lib/products_data';
import { AddToCartButton } from '@/app/ui/cart/add-buttons';
import Image from 'next/image';
import Search from '@/app/ui/search';
import { Suspense } from 'react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default async function Page() {
  const products = await fetchProducts();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Sản phẩm mới nhất</h1>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          {/* Search được bọc Suspense giống mẫu bạn gửi */}
          <Suspense fallback={<div>Loading Search...</div>}>
            <Search placeholder="Search Products..." />
          </Suspense>
        </div>
        <div>

          .
        </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            
            {/* Ảnh sản phẩm */}
            <div className="relative aspect-square">
               {/* Nhớ config domain ảnh trong next.config.js nếu dùng ảnh ngoài */}
              <Image 
                src={product.image || ''} 
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-medium text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
              
              <div className="mt-4 flex items-center justify-between mt-auto">
                <span className="font-bold text-blue-600">
                  {formatCurrency(product.price)}
                </span>
                {/* Client Component Button */}
                <AddToCartButton productId={product.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}