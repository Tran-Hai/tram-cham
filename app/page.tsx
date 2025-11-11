'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';

// Icon components for Why Choose Us section
const QualityIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const GiftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const TruckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-4-1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1h-1a1 1 0 00-1 1v1z" />
  </svg>
);

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
      
      {/* Why Choose Us Section */}
      <section className="w-full bg-gradient-to-br from-pink-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Tại sao bạn chọn Trạm Chạm?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi không chỉ mang đến sản phẩm, mà còn mang đến trải nghiệm và cảm xúc đặc biệt cho bạn
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <QualityIcon className="w-12 h-12 text-pink-500" />,
                title: "Chất lượng hoàn hảo",
                description: "Mỗi sản phẩm đều được chọn lọc kỹ lưỡng, đảm bảo chất lượng tốt nhất cho bạn"
              },
              {
                icon: <HeartIcon className="w-12 h-12 text-pink-500" />,
                title: "Từ trái tim",
                description: "Mỗi sản phẩm được gói ghém với tình cảm và tâm huyết, mang lại cảm xúc chân thành"
              },
              {
                icon: <GiftIcon className="w-12 h-12 text-pink-500" />,
                title: "Quà tặng ý nghĩa",
                description: "Món quà nhỏ nhưng chứa đựng nhiều ý nghĩa, phù hợp cho mọi dịp đặc biệt"
              },
              {
                icon: <TruckIcon className="w-12 h-12 text-pink-500" />,
                title: "Giao hàng nhanh",
                description: "Đảm bảo giao hàng nhanh chóng và an toàn đến tận tay bạn"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 p-4 bg-pink-50 rounded-full">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link 
                href="/products" 
                className="inline-block bg-pink-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Khám phá sản phẩm ngay
              </Link>
            </motion.div>
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