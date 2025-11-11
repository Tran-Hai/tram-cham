import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getMessage, incrementViewCount } from '../route';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messageId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const password = searchParams.get('password');

    if (!messageId) {
      return NextResponse.json(
        { error: 'Thiếu ID thông điệp' },
        { status: 400 }
      );
    }

    // Get message from MongoDB
    const message = await getMessage(messageId);

    if (!message) {
      return NextResponse.json(
        { error: 'Không tìm thấy thông điệp' },
        { status: 404 }
      );
    }

    // Check if password is required and valid
    if (message.hashedPassword) {
      if (!password) {
        return NextResponse.json(
          { error: 'Yêu cầu mật khẩu để xem thông điệp' },
          { status: 401 }
        );
      }

      const hashedInputPassword = crypto.createHash('sha256').update(password).digest('hex');

      if (hashedInputPassword !== message.hashedPassword) {
        return NextResponse.json(
          { error: 'Mật khẩu không chính xác' },
          { status: 403 }
        );
      }
    }

    // Increment view count
    await incrementViewCount(messageId);

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
    console.error('Error fetching message:', error);
    return NextResponse.json(
      { error: 'Lỗi server khi lấy thông điệp' },
      { status: 500 }
    );
  }
}
