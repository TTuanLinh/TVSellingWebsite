'use client';

import { Plus } from 'lucide-react';
import { addToCart } from '@/app/lib/cart-actions';
import { useState } from 'react';

export function AddToCartButton({ productId }: { productId: number }) {
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    setIsPending(true);
    try {
      await addToCart(productId);
      alert("Đã thêm vào giỏ!");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi thêm vào giỏ");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center justify-center rounded-full p-2 text-white transition-colors ${
        isPending ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      <Plus size={20} />
    </button>
  );
}