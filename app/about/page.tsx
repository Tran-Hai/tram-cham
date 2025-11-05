'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Câu chuyện về Trạm Chạm</h1>
          <p className="mt-4 text-lg text-pink-500">"Trạm của những cảm xúc – Chạm của ký ức"</p>
        </div>

        <div className="grid md:grid-cols-5 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:col-span-2 aspect-square rounded-lg bg-pink-100 shadow-lg flex items-center justify-center"
          >
             <Image src="/logo.png" alt="Trạm Chạm Logo" width={200} height={200} className="object-contain" />
          </motion.div>

          <div className="md:col-span-3 text-gray-600 leading-relaxed space-y-6">
            <p>
              Tại một góc nhỏ của thế giới số, "Trạm Chạm" được sinh ra từ một ý niệm đơn giản: mỗi mùi hương là một ký ức, mỗi món quà là một "cú chạm" tinh tế đến trái tim. Chúng tôi không chỉ bán sản phẩm, chúng tôi gói ghém những câu chuyện, những hoài niệm và những lời chúc tốt đẹp nhất.
            </p>
            <p>
              "Trạm" là nơi dừng chân cho những tâm hồn tìm kiếm sự đồng điệu, một nơi để bạn chậm lại, lắng nghe và cảm nhận. "Chạm" là khoảnh khắc mà một món quà nhỏ bé có thể kết nối hai con người, là sự tinh tế trong từng sản phẩm được lựa chọn kỹ lưỡng, từ mùi hương của một chai nước hoa đến sự mềm mại của một dải ruy băng.
            </p>
            <blockquote className="border-l-4 border-pink-300 pl-4 italic text-gray-700">
              "Chúng tôi tin rằng, những điều đẹp đẽ nhất không cần phải quá xa hoa, mà chúng đến từ sự chân thành và một trái tim biết yêu thương."
            </blockquote>
            <p>
              Hành trình của Trạm Chạm là hành trình đi tìm và lan tỏa vẻ đẹp trong những điều bình dị. Cảm ơn bạn đã ghé qua trạm dừng này. Hy vọng bạn sẽ tìm thấy một "cú chạm" cho riêng mình.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
