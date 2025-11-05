'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';

// Define the structure of a product
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

const categories = ["Tất cả", "Gel tắm", "Bodymist"];

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  // Fetch all products once on component mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || `Error: ${response.status}`);
        }
        const data: Product[] = await response.json();
        setAllProducts(data);
        setFilteredProducts(data); // Initially, show all products
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Handle filtering when activeCategory changes
  useEffect(() => {
    if (activeCategory === "Tất cả") {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(activeCategory.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [activeCategory, allProducts]);

  if (loading) {
    return <div className="text-center py-20">Đang tải sản phẩm...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        <h2 className="text-2xl font-bold">Lỗi khi tải sản phẩm</h2>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Khám phá sản phẩm</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Mỗi sản phẩm là một câu chuyện, một cảm xúc được gói ghém cẩn thận, chờ bạn tự tay trải nghiệm.
        </p>
      </div>

      <div className="flex justify-center items-center space-x-4 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeCategory === category
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-pink-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
