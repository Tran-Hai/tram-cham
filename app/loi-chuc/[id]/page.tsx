'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

interface MessageData {
  id: string;
  senderName: string;
  recipientName: string;
  messageType: 'text' | 'audio' | 'video' | 'podcast';
  content: string;
  audioUrl?: string;
  videoUrl?: string;
  podcastUrl?: string;
  createdAt: string;
  viewCount: number;
}

export default function LoiChucPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const messageId = params.id as string;
  const password = searchParams.get('password') || '';

  const [message, setMessage] = useState<MessageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passwordInput, setPasswordInput] = useState(password);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const fetchMessage = async (passwordToUse: string = '') => {
    try {
      setLoading(true);
      setError('');

      const url = `/api/messages/${messageId}${passwordToUse ? `?password=${passwordToUse}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(data.message);
        setShowPasswordForm(false);
      } else if (response.status === 401) {
        setShowPasswordForm(true);
      } else {
        setError(data.error || 'Không thể tải lời chúc');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải lời chúc');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessage(password);
  }, [messageId, password]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMessage(passwordInput);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải lời chúc...</p>
        </div>
      </div>
    );
  }

  if (error && !showPasswordForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">😔</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (showPasswordForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full"
        >
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Yêu cầu mật khẩu</h2>
            <p className="text-gray-600">Lời chúc này được bảo vệ bằng mật khẩu</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Mở lời chúc
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (!message) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="text-6xl mb-4">💌</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Lời chúc đặc biệt</h1>
            <p className="text-gray-600">Dành cho {message.recipientName}</p>
          </div>

          {/* Message Content */}
          <div className="mb-8 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
            <div className="mb-4">
              <p className="text-lg text-gray-700 leading-relaxed">{message.content}</p>
            </div>

            <div className="text-right">
              <p className="text-gray-600 font-medium">— {message.senderName}</p>
            </div>
          </div>

          {/* Media Content */}
          {message.messageType !== 'text' && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Nội dung đính kèm</h3>

              {message.messageType === 'audio' && message.audioUrl && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <audio controls className="w-full">
                    <source src={message.audioUrl} type="audio/mpeg" />
                    Trình duyệt của bạn không hỗ trợ audio.
                  </audio>
                </div>
              )}

              {message.messageType === 'video' && message.videoUrl && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <video controls className="w-full max-w-full">
                    <source src={message.videoUrl} type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ video.
                  </video>
                </div>
              )}

              {message.messageType === 'podcast' && message.podcastUrl && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <audio controls className="w-full">
                    <source src={message.podcastUrl} type="audio/mpeg" />
                    Trình duyệt của bạn không hỗ trợ podcast.
                  </audio>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Được tạo vào: {formatDate(message.createdAt)}</span>
              <span>Đã xem: {message.viewCount} lần</span>
            </div>

            <div className="mt-6">
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Về trang chủ Trạm Chạm
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}