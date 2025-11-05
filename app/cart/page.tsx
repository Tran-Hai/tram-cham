'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CartPage() {
  const { cartItems, cartCount, totalPrice, updateQuantity, removeFromCart } = useCart();

  if (cartCount === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-gray-800">Giỏ hàng của bạn đang trống</h1>
        <p className="mt-4 text-gray-600">Hãy khám phá và thêm sản phẩm bạn yêu thích vào giỏ hàng nhé.</p>
        <Link href="/products" className="mt-8 inline-block bg-pink-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-pink-600 transition-colors duration-300">
          Tiếp tục mua sắm
        </Link>
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Giỏ hàng của bạn</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map(item => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="flex items-center bg-white p-4 border rounded-lg shadow-sm"
              >
                <div className="relative w-24 h-24 rounded-md overflow-hidden">
                  <Image src={item.imageUrl} alt={item.name} layout="fill" objectFit="cover" />
                </div>
                <div className="flex-grow ml-4">
                  <h2 className="font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-sm text-gray-500">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 border rounded-md hover:bg-gray-100">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 border rounded-md hover:bg-gray-100">+</button>
                </div>
                <div className="ml-6 text-right">
                  <p className="font-semibold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:underline mt-1">Xóa</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white p-6 border rounded-lg shadow-sm sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Tổng cộng</h2>
            <div className="flex justify-between mb-2">
              <span>Tạm tính</span>
              <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
            </div>
            <div className="flex justify-between mb-6">
              <span>Phí vận chuyển</span>
              <span>Miễn phí</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Tổng tiền</span>
              <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
            </div>
            <button className="w-full mt-6 bg-pink-500 text-white font-bold py-3 rounded-lg hover:bg-pink-600 transition-colors duration-300">
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
