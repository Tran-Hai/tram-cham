'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
// @ts-ignore
import QRCode from 'qrcode';
import Link from 'next/link';

interface MessageForm {
  senderName: string;
  recipientName: string;
  messageType: 'text' | 'audio' | 'video' | 'podcast';
  content: string;
  password: string;
  confirmPassword: string;
}

export default function CreateQrPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [messageId, setMessageId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');

  const { 
    register, 
    handleSubmit, 
    watch,
    setValue,
    formState: { errors },
    reset 
  } = useForm<MessageForm>();

  const watchedMessageType = watch('messageType');
  const watchedPassword = watch('password');

  const onSubmit = async (data: MessageForm) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          productId: productId || 'general',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessageId(result.messageId);
        setGeneratedPassword(result.password || '');
        
        // Generate QR code
        const qrDataUrl = await QRCode.toDataURL(result.qrUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        
        setQrCodeUrl(qrDataUrl);
        reset();
      } else {
        alert('Có lỗi xảy ra: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating message:', error);
      alert('Có lỗi xảy ra khi tạo thông điệp!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateRandomPassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8);
    setValue('password', randomPassword);
    setValue('confirmPassword', randomPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Tạo QR lời chúc</h1>
          <p className="text-lg text-gray-600">
            Tạo mã QR dẫn đến trang xem lời chúc của bạn
          </p>
        </div>

        {!qrCodeUrl ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Sender Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên người gửi *
                </label>
                <input
                  type="text"
                  {...register('senderName', { required: 'Vui lòng nhập tên người gửi' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Nhập tên của bạn"
                />
                {errors.senderName && (
                  <p className="text-red-500 text-sm mt-1">{errors.senderName.message}</p>
                )}
              </div>

              {/* Recipient Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên người nhận *
                </label>
                <input
                  type="text"
                  {...register('recipientName', { required: 'Vui lòng nhập tên người nhận' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Nhập tên người nhận"
                />
                {errors.recipientName && (
                  <p className="text-red-500 text-sm mt-1">{errors.recipientName.message}</p>
                )}
              </div>

              {/* Message Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại thông điệp *
                </label>
                <select
                  {...register('messageType', { required: 'Vui lòng chọn loại thông điệp' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="text">Văn bản</option>
                  <option value="audio">Âm thanh</option>
                  <option value="video">Video</option>
                  <option value="podcast">Podcast</option>
                </select>
                {errors.messageType && (
                  <p className="text-red-500 text-sm mt-1">{errors.messageType.message}</p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung thông điệp *
                </label>
                {watchedMessageType === 'text' ? (
                  <textarea
                    {...register('content', { required: 'Vui lòng nhập nội dung' })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Viết lời chúc của bạn ở đây..."
                  />
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      {...register('content', { required: 'Vui lòng nhập đường dẫn' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder={`Nhập đường dẫn ${watchedMessageType} (Google Drive, YouTube, v.v.)`}
                    />
                    <p className="text-sm text-gray-500">
                      Vui lòng cung cấp đường dẫn đến file {watchedMessageType} của bạn
                    </p>
                  </div>
                )}
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu bảo vệ (tùy chọn)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Nhập mật khẩu"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? 'Ẩn' : 'Hiện'}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      validate: value =>
                        value === watchedPassword || 'Mật khẩu xác nhận không khớp'
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Xác nhận lại mật khẩu"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Tạo mật khẩu ngẫu nhiên
                </button>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Đang tạo...' : 'Tạo QR'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">QR đã được tạo!</h2>
            <p className="text-gray-600 mb-6">
              Hãy in hoặc chia sẻ mã QR này để người nhận xem lời chúc
            </p>
            
            {qrCodeUrl && (
              <div className="mb-6">
                <img src={qrCodeUrl} alt="QR Code" className="mx-auto" />
              </div>
            )}

            {generatedPassword && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800 mb-2">
                  <strong>Mật khẩu để xem thông điệp:</strong>
                </p>
                <p className="text-lg font-mono text-yellow-900">{generatedPassword}</p>
                <p className="text-xs text-yellow-700 mt-2">
                  Hãy chia sẻ mật khẩu này với người nhận!
                </p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={() => window.open(qrCodeUrl, '_blank')}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Tải xuống QR
              </button>
              
              <Link
                href={`/loi-chuc?messageId=${messageId}&password=${encodeURIComponent(generatedPassword)}`}
                className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center"
              >
                Xem thử lời chúc
              </Link>
              
              <button
                onClick={() => {
                  setQrCodeUrl('');
                  setMessageId('');
                  setGeneratedPassword('');
                }}
                className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Tạo QR mới
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}