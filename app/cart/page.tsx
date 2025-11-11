'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function CartPage() {
  const { cartItems, cartCount, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = () => {
    setShowCheckoutModal(true);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkoutData.name.trim() || !checkoutData.phone.trim() || !checkoutData.email.trim() || !checkoutData.address.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsSubmitting(true);

    try {
      // Format order items
      const orderItems = cartItems.map(item => `${item.name}(${item.quantity})`).join(', ');

      // Prepare order data
      const orderData = {
        id: `ORDER_${Date.now()}`,
        customerName: checkoutData.name.trim(),
        customerPhone: checkoutData.phone.trim(),
        customerEmail: checkoutData.email.trim(),
        customerAddress: checkoutData.address.trim(),
        orderItems: orderItems,
        totalPrice: totalPrice,
        orderDate: new Date().toISOString(),
        status: 'pending'
      };

      // Send to Google Apps Script
      const SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!;
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'createOrder',
          data: orderData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const data = await response.json();
      if (data.success) {
        alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
        clearCart();
        setShowCheckoutModal(false);
        setCheckoutData({ name: '', phone: '', email: '', address: '' });
      } else {
        alert('Có lỗi xảy ra: ' + data.error);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCheckoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-pink-500 text-white font-bold py-3 rounded-lg hover:bg-pink-600 transition-colors duration-300"
            >
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Thông tin giao hàng</h2>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={checkoutData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={checkoutData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={checkoutData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Nhập email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ giao hàng *
                  </label>
                  <textarea
                    name="address"
                    value={checkoutData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Nhập địa chỉ giao hàng"
                    required
                  />
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Tóm tắt đơn hàng</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Sản phẩm:</strong> {cartItems.map(item => `${item.name}(${item.quantity})`).join(', ')}</p>
                    <p><strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
