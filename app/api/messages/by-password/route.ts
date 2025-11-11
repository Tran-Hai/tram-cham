import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const password = searchParams.get('password');

    if (!password) {
      return NextResponse.json(
        { error: 'Thiếu mật khẩu' },
        { status: 400 }
      );
    }

    // Hash the input password
    const hashedInputPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Find message with matching password via Google Apps Script
    const SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL!;
    const response = await fetch(`${SCRIPT_URL}?action=getMessageByPassword&password=${encodeURIComponent(hashedInputPassword)}`);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Không tìm thấy lời chúc với mật khẩu này' },
        { status: 404 }
      );
    }

    const data = await response.json();

    if (!data.success || !data.message) {
      return NextResponse.json(
        { error: 'Không tìm thấy lời chúc với mật khẩu này' },
        { status: 404 }
      );
    }

    const message = data.message;

    // Return message data (excluding sensitive information)
    const responseData = {
      id: message._id.toString(),
      senderName: message.senderName,
      recipientName: message.recipientName,
      messageType: message.messageType,
      content: message.content,
      audioUrl: message.audioUrl,
      videoUrl: message.videoUrl,
      podcastUrl: message.podcastUrl,
      createdAt: message.createdAt,
      viewCount: message.viewCount + 1
    };

    return NextResponse.json({
      success: true,
      message: responseData
    });

  } catch (error) {
    console.error('Error fetching message by password:', error);
    return NextResponse.json(
      { error: 'Lỗi server khi lấy lời chúc' },
      { status: 500 }
    );
  }
}
