'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';

// The Product interface should be consistent with what the API provides
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) return;
        const data: Product[] = await response.json();
        // Feature the first 4 products
        setFeaturedProducts(data.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch products for homepage", err);
      }
    }
    fetchProducts();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white"
      >
        <Image
          src="/banner.png"
          alt="Trạm Chạm Banner"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority // Prioritize loading of the main banner
          className="brightness-75"
        />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 p-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}>
            Trạm của những cảm xúc
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-light" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}>
            Chạm của ký ức
          </p>
          <Link href="/products" className="mt-8 inline-block bg-pink-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-pink-600 transition-all duration-300 shadow-lg">
            Khám phá ngay
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="w-full bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Sản phẩm nổi bật</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Us Teaser Section */}
      <section className="w-full bg-white py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Câu chuyện về Trạm Chạm</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            "Trạm" là nơi dừng chân cho những tâm hồn tìm kiếm sự đồng điệu, một nơi để bạn chậm lại, lắng nghe và cảm nhận. "Chạm" là khoảnh khắc mà một món quà nhỏ bé có thể kết nối hai con người, là sự tinh tế trong từng sản phẩm được lựa chọn kỹ lưỡng.
          </p>
          <Link href="/about" className="font-semibold text-pink-500 hover:underline">
            Tìm hiểu thêm về chúng tôi &rarr;
          </Link>
        </div>
      </section>
    </main>
  );
}