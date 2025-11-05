'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

// Simple SVG Icon components (can be moved to separate files later if needed)
const FacebookIcon = ({ className = 'w-8 h-8' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
);
const ZaloIcon = ({ className = 'w-8 h-8' }) => (
  // Placeholder - a simple chat icon as a stand-in for Zalo
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z" /></svg>
);
const PhoneIcon = ({ className = 'w-8 h-8' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
);
const EmailIcon = ({ className = 'w-8 h-8' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);

const contactMethods = [
  {
    icon: <FacebookIcon />,
    title: 'Facebook',
    description: 'Nhắn tin cho chúng tôi qua fanpage chính thức.',
    link: 'https://facebook.com/your-page-here', // Placeholder
    cta: 'Gửi tin nhắn'
  },
  {
    icon: <ZaloIcon />,
    title: 'Zalo',
    description: 'Kết nối và trò chuyện trực tiếp qua Zalo.',
    link: 'https://zalo.me/your-phone-number', // Placeholder
    cta: 'Chat ngay'
  },
  {
    icon: <PhoneIcon />,
    title: 'Hotline',
    description: 'Gọi cho chúng tôi để được tư vấn nhanh nhất.',
    link: 'tel:0987654321', // Placeholder
    cta: '098.765.4321'
  },
  {
    icon: <EmailIcon />,
    title: 'Email',
    description: 'Gửi yêu cầu hoặc góp ý của bạn qua email.',
    link: 'mailto:contact@tramcham.com', // Placeholder
    cta: 'Gửi Email'
  }
];

export default function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Liên hệ với Trạm Chạm</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Chúng tôi luôn sẵn lòng lắng nghe. Dù bạn có câu hỏi, góp ý hay chỉ muốn gửi một lời chào, đừng ngần ngại kết nối nhé.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {contactMethods.map((method, index) => (
          <motion.div
            key={method.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link href={method.link} target="_blank" rel="noopener noreferrer" className="block bg-white p-8 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 h-full text-center">
              <div className="inline-block text-pink-500 mb-4">
                {method.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{method.title}</h3>
              <p className="text-gray-500 mb-6">{method.description}</p>
              <span className="font-semibold text-pink-500 hover:underline">
                {method.cta}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
