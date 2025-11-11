'use client';

import Link from 'next/link';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Sản phẩm', href: '/products' },
  { name: 'Tạo QR', href: '/create-qr' },
  { name: 'Lời chúc', href: '/loi-chuc' },
  { name: 'Feedback', href: '/feedback' },
  { name: 'Về chúng tôi', href: '/about' },
  { name: 'Liên hệ', href: '/contact' },
];

export default function Header() {
  const { cartCount } = useCart();

  return (
    <header className="bg-pastel-pink/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          <Link href="/">Trạm Chạm</Link>
        </div>
        <div className="flex items-center space-x-8">
          <ul className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="text-gray-700 hover:text-pink-500 transition-colors duration-300">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/cart" className="relative text-gray-700 hover:text-pink-500 transition-colors duration-300">
            <ShoppingCartIcon className="w-6 h-6" />
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
