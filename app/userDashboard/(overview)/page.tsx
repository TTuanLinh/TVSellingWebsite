import { fetchProducts } from '@/app/lib/products_data';
import { AddToCartButton } from '@/app/ui/cart/add-buttons';
import Image from 'next/image';
import Search from '@/app/ui/search';
import { Suspense } from 'react';

// Hàm format tiền
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Trong Next.js 15, searchParams là một Promise
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Sản phẩm mới nhất</h1>
      
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8 mb-8">
        {/* Search Component */}
        <div className="w-full sm:w-1/3">
          <Suspense fallback={<div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>}>
            <Search placeholder="Tìm kiếm sản phẩm..." />
          </Suspense>
        </div>
      </div>
      
      {/* Bọc danh sách sản phẩm trong Suspense. 
         Next.js sẽ render khung trang trước, sau đó stream dữ liệu sản phẩm vào sau.
         Giúp trang load ngay lập tức mà không bị chặn (blocking).
      */}
      <Suspense fallback={<ProductsLoading />}>
        <ProductList query={query} />
      </Suspense>
    </main>
  );
}

// Component con: Chịu trách nhiệm fetch dữ liệu
async function ProductList({ query }: { query: string }) {
  // Fetch data bên trong component con
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
          
          {/* Ảnh sản phẩm */}
          <div className="relative aspect-square bg-gray-100 overflow-hidden">
             {/* Nhớ config domain ảnh trong next.config.js nếu dùng ảnh ngoài */}
            <Image 
              src={product.image || '/placeholder.png'} 
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
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
              {/* Client Component Button */}
              <AddToCartButton productId={product.id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Component Skeleton Loading cho danh sách sản phẩm
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