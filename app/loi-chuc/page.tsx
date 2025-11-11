'use client';

import { useState, useEffect } from 'react';
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
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<MessageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPassword = urlParams.get('password');

    if (urlPassword) {
      setPassword(urlPassword);
      // Auto-submit if password is present
      handleAutoSubmit(urlPassword);
    }
  }, []);

  const handleAutoSubmit = async (pwd: string) => {
    setLoading(true);
    setError('');

    try {
      // Try to find message by password (this would require API modification)
      // For now, we'll keep the current approach but remove messageId from UI
      const url = `/api/messages/by-password?password=${encodeURIComponent(pwd)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(data.message);
      } else {
        setError(data.error || 'Không thể tải lời chúc');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải lời chúc');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Try to find message by password - this requires a new API endpoint
      const url = `/api/messages/by-password?password=${encodeURIComponent(password)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(data.message);
      } else {
        setError(data.error || 'Không thể tải lời chúc');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải lời chúc');
    } finally {
      setLoading(false);
    }
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

  if (message) {
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

                {message.messageType === 'audio' && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <audio controls className="w-full">
                      <source src={message.audioUrl} type="audio/mpeg" />
                      Trình duyệt của bạn không hỗ trợ audio.
                    </audio>
                  </div>
                )}

                {message.messageType === 'video' && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <video controls className="w-full max-w-full">
                      <source src={message.videoUrl} type="video/mp4" />
                      Trình duyệt của bạn không hỗ trợ video.
                    </video>
                  </div>
                )}

                {message.messageType === 'podcast' && (
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
                  onClick={() => {
                    setMessage(null);
                    setPassword('');
                  }}
                  className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Xem lời chúc khác
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🔐</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Xem lời chúc</h1>
            <p className="text-gray-600">Nhập mật khẩu để xem lời chúc của bạn</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Đang tải...' : 'Xem lời chúc'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Bạn có thể tìm mật khẩu trong email hoặc tin nhắn từ người gửi
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}