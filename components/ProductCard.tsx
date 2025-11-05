import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the link from being triggered
    e.preventDefault(); // Prevent default link behavior
    addToCart(product);
    console.log(`Added ${product.name} to cart`);
    // Optional: Add a visual confirmation like a toast notification
  };

  return (
    <div className="group flex flex-col overflow-hidden border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 h-full">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative h-64">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-4 bg-white flex flex-col flex-grow">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-800 min-h-[3.5rem] break-words">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto">
          <p className="mt-2 text-md font-bold text-pink-500">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </p>
          <button 
            onClick={handleAddToCart}
            className="w-full mt-4 bg-pink-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors duration-300"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}
