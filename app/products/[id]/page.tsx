'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      alert('Đã thêm sản phẩm vào giỏ hàng!');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || `Error: ${response.status}`);
        }
        const data: Product = await response.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Đang tải chi tiết sản phẩm...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500"><h2>Lỗi: {error}</h2></div>;
  }

  if (!product) {
    return <div className="text-center py-20">Không tìm thấy sản phẩm.</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-square rounded-lg overflow-hidden shadow-lg"
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
          />
        </motion.div>
        
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-3xl font-semibold text-pink-500 mb-6">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </p>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {product.description}
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleAddToCart}
              className="w-full bg-pink-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-pink-600 transition-colors duration-300 shadow-md"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
          
          <div className="mt-6">
            <p className="text-gray-600 mb-4">Muốn gửi thông điệp cá nhân cùng món quà?</p>
            <Link
              href={`/create-qr?productId=${id}`}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tạo lời chúc đặc biệt
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
