import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory storage for reviews (in production, use a database)
const reviews: any[] = [
  // Sample reviews
  {
    id: '1',
    name: 'Nguyễn Văn Minh',
    rating: 5,
    comment: 'Trạm Chạm là một ý tưởng tuyệt vời! Tôi rất thích cách tạo QR lời chúc.',
    createdAt: '2024-11-11T10:00:00.000Z'
  },
  {
    id: '2',
    name: 'Trần Thị Phương Quỳnh',
    rating: 4,
    comment: 'Giao diện đẹp, dễ sử dụng. Chỉ mong có thêm nhiều mẫu QR hơn.',
    createdAt: '2024-11-10T15:30:00.000Z'
  },
  {
    id: '3',
    name: 'Lê Văn Sơn',
    rating: 5,
    comment: 'Đã tạo được lời chúc rất ý nghĩa cho người thân. Cảm ơn Trạm Chạm!',
    createdAt: '2024-11-09T09:15:00.000Z'
  }
];

export async function GET() {
  try {
    const SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL!;

    // Try to get reviews from Google Apps Script
    try {
      const response = await fetch(`${SCRIPT_URL}?action=getReviews`);
      if (response.ok) {
        const data = await response.json();
        // Combine with sample reviews if any
        const scriptReviews = data.reviews || [];
        const sampleReviews = [
          {
            id: 'sample-1',
            name: 'Nguyễn Văn Minh',
            rating: 5,
            comment: 'Trạm Chạm là một ý tưởng tuyệt vời! Tôi rất thích cách tạo QR lời chúc.',
            createdAt: '2024-11-11T10:00:00.000Z'
          },
          {
            id: 'sample-2',
            name: 'Trần Thị Phương Quỳnh',
            rating: 4,
            comment: 'Giao diện đẹp, dễ sử dụng. Chỉ mong có thêm nhiều mẫu QR hơn.',
            createdAt: '2024-11-10T15:30:00.000Z'
          },
          {
            id: 'sample-3',
            name: 'Lê Văn Sơn',
            rating: 5,
            comment: 'Đã tạo được lời chúc rất ý nghĩa cho người thân. Cảm ơn Trạm Chạm!',
            createdAt: '2024-11-09T09:15:00.000Z'
          }
        ];

        // Combine and sort by creation date (newest first)
        const allReviews = [...scriptReviews, ...sampleReviews].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json({
          success: true,
          reviews: allReviews
        });
      }
    } catch (scriptError) {
      console.log('Google Apps Script not available, using sample reviews');
    }

    // Fallback to sample reviews only
    return NextResponse.json({
      success: true,
      reviews: [
        {
          id: 'sample-1',
          name: 'Nguyễn Văn Minh',
          rating: 5,
          comment: 'Trạm Chạm là một ý tưởng tuyệt vời! Tôi rất thích cách tạo QR lời chúc.',
          createdAt: '2024-11-11T10:00:00.000Z'
        },
        {
          id: 'sample-2',
          name: 'Trần Thị Phương Quỳnh',
          rating: 4,
          comment: 'Giao diện đẹp, dễ sử dụng. Chỉ mong có thêm nhiều mẫu QR hơn.',
          createdAt: '2024-11-10T15:30:00.000Z'
        },
        {
          id: 'sample-3',
          name: 'Lê Văn Sơn',
          rating: 5,
          comment: 'Đã tạo được lời chúc rất ý nghĩa cho người thân. Cảm ơn Trạm Chạm!',
          createdAt: '2024-11-09T09:15:00.000Z'
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Lỗi server khi lấy đánh giá' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, rating, comment } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Tên không được để trống' },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Đánh giá phải từ 1 đến 5 sao' },
        { status: 400 }
      );
    }

    if (!comment || !comment.trim()) {
      return NextResponse.json(
        { error: 'Nội dung đánh giá không được để trống' },
        { status: 400 }
      );
    }

    // Generate unique review ID
    const reviewId = crypto.randomBytes(8).toString('hex');

    // Create review object
    const review = {
      id: reviewId,
      name: name.trim(),
      rating: parseInt(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    // Save to Google Apps Script
    const SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL!;
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'createReview',
        data: review
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save review');
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Lỗi server khi tạo đánh giá' },
      { status: 500 }
    );
  }
}
