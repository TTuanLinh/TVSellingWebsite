import { fetchProducts } from '@/app/lib/products_data';
import { AddToCartButton } from '@/app/ui/cart/add-buttons';
import Image from 'next/image';
import Search from '@/app/ui/search';
import { Suspense } from 'react';

// Hàm format tiền
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Next.js 15: searchParams là Promise. 
// QUAN TRỌNG: Không await searchParams ở đây để tránh chặn render (blocking).
export default function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Sản phẩm mới nhất</h1>
      
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8 mb-8">
        {/* Search Component (Client Component) tự xử lý logic của nó */}
        <div className="w-full sm:w-1/3">
          <Suspense fallback={<div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>}>
            <Search placeholder="Tìm kiếm sản phẩm..." />
          </Suspense>
        </div>
      </div>
      
      {/* Truyền Promise searchParams xuống component con.
          Component con sẽ await nó bên trong Suspense. */}
      <Suspense fallback={<ProductsLoading />}>
        <ProductList searchParamsPromise={props.searchParams} />
      </Suspense>
    </main>
  );
}

// Component con: Nhận Promise, await nó, sau đó fetch dữ liệu
async function ProductList({ 
  searchParamsPromise 
}: { 
  searchParamsPromise?: Promise<{ query?: string }> 
}) {
  // Await searchParams BÊN TRONG component con (nơi đã được bọc Suspense)
  const params = await searchParamsPromise;
  const query = params?.query || '';
  
  // Fetch data
  const products = await fetchProducts(query);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào phù hợp với "{query}".</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 group">
          
          <div className="relative aspect-square bg-gray-100 overflow-hidden">
            <Image 
              src={product.image || '/placeholder.png'} 
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-medium text-gray-900 text-lg line-clamp-1" title={product.name}>
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[40px]">
              {product.description}
            </p>
            
            <div className="mt-4 flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
              <span className="font-bold text-blue-600 text-lg">
                {formatCurrency(product.price)}
              </span>
              <AddToCartButton productId={product.id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Component Skeleton Loading
function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden h-[400px] flex flex-col">
           <div className="bg-gray-200 aspect-square w-full"></div>
           <div className="p-4 flex-grow space-y-3">
             <div className="h-6 bg-gray-200 rounded w-3/4"></div>
             <div className="h-4 bg-gray-200 rounded w-full"></div>
             <div className="h-4 bg-gray-200 rounded w-1/2"></div>
             <div className="mt-auto flex justify-between items-center pt-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
             </div>
           </div>
        </div>
      ))}
    </div>
  );
}