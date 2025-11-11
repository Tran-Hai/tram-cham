import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productId,
      senderName,
      recipientName,
      messageType,
      content,
      password,
      audioUrl,
      videoUrl,
      podcastUrl
    } = body;

    // Validate required fields
    if (!productId || !senderName || !recipientName || !messageType || !content) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Generate unique message ID
    const messageId = crypto.randomBytes(16).toString('hex');

    // Hash the password for security
    const hashedPassword = password ? crypto.createHash('sha256').update(password).digest('hex') : null;

    // Save to Google Apps Script
    const SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL!;
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'createMessage',
        data: {
          id: messageId,
          productId,
          senderName,
          recipientName,
          messageType,
          content,
          hashedPassword,
          audioUrl: audioUrl || '',
          videoUrl: videoUrl || '',
          podcastUrl: podcastUrl || '',
          createdAt: new Date().toISOString(),
          viewCount: 0
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save to Google Sheets');
    }

    // Generate QR code URL
    const qrUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/loi-chuc/${messageId}`;

    return NextResponse.json({
      success: true,
      messageId,
      qrUrl,
      password: password || null
    });

  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Lỗi server khi tạo thông điệp' },
      { status: 500 }
    );
  }
}

// Utility function to get message (will be used by other endpoints)
export async function getMessage(messageId: string) {
  const SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL!;
  const response = await fetch(`${SCRIPT_URL}?action=getMessage&id=${messageId}`);

  if (!response.ok) return null;

  const data = await response.json();
  return data.success ? data.message : null;
}

export async function incrementViewCount(messageId: string) {
  const SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL!;
  await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'incrementViewCount',
      id: messageId
    })
  });
}
