import { NextResponse } from 'next/server';

// Define the structure of a product
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

// This data should ideally be shared from a single source,
// but for this mock API, we can redefine it.
const mockProducts: Product[] = [
  { id: '1', name: 'Gel Tắm Nước Hoa Dưỡng Da Love Charm', price: 189000, description: 'Hương thơm ngọt ngào, quyến rũ, lưu lại trên da suốt nhiều giờ.', imageUrl: 'https://drive.google.com/uc?id=1yaOohm_W-yXKhLE7qWiPJ75cIb5FOn87' },
  { id: '2', name: 'Gel Tắm Nước Hoa Dưỡng Da PomPeii', price: 189000, description: 'Hương thơm sang trọng, bí ẩn, mang lại cảm giác tự tin và quyền lực.', imageUrl: 'https://drive.google.com/uc?id=1FdvfefNRBm0QPtI5JJyMAiFILw8nURTP' },
  { id: '3', name: 'Gel Tắm Nước Hoa Dưỡng Da Eden', price: 189000, description: 'Hương thơm trong trẻo, tươi mát như khu vườn địa đàng.', imageUrl: 'https://drive.google.com/uc?id=1RSp-hAfqYQrXpqszjLKHrKc5iIc63g2O' },
  { id: '4', name: 'Gel Tắm Nước Hoa Dưỡng Da Gondola', price: 189000, description: 'Hương thơm lãng mạn, cổ điển, gợi nhớ về một buổi chiều trên sông Venice.', imageUrl: 'https://drive.google.com/uc?id=1Gcrd8AeFxoYttnixQcicxyNrFG9jsqg5' },
  { id: '5', name: 'Gel Tắm Nước Hoa Dưỡng Da Siena', price: 189000, description: 'Hương thơm ấm áp, nồng nàn, mang đậm phong cách Ý.', imageUrl: 'https://drive.google.com/uc?id=1a4Qxh7Jx0Y1XjhfSp3q8ba0n5BFSDgE1' },
  { id: '6', name: 'Gel Tắm Nước Hoa Dưỡng Da Rome', price: 189000, description: 'Hương thơm mạnh mẽ, nam tính, thể hiện đẳng cấp phái mạnh.', imageUrl: 'https://drive.google.com/uc?id=1_V2lQGINfHKpF4aCtPhCvXy5ptSNKCTy' },
  { id: '7', name: 'Gel Tắm Nước Hoa Dưỡng Da 3in1 Caesar’s', price: 229000, description: 'Sản phẩm 3 trong 1 tiện lợi, vừa là sữa tắm, dầu gội và sữa rửa mặt.', imageUrl: 'https://drive.google.com/uc?id=1_bETAkjKrKqhEnMl9n6JdkAf7OBgLsXI' },
  { id: '8', name: 'Bodymist Love Charm( 250ml)', price: 249000, description: 'Xịt thơm toàn thân với hương Love Charm ngọt ngào, quyến rũ.', imageUrl: 'https://drive.google.com/uc?id=1JArzenjjKVbcucCCrJyoMvZbtkg0mZK9' },
  { id: '9', name: "Bodymist Caesar' Legend(250ml)", price: 249000, description: 'Xịt thơm toàn thân với hương Caesar mạnh mẽ, nam tính.', imageUrl: 'https://drive.google.com/uc?id=1yB-Lwp95HzUKM8V1Jy_tHmDcLXbHGyZj' },
  { id: '10', name: 'Bodymist Siena(250ml)', price: 249000, description: 'Xịt thơm toàn thân với hương Siena ấm áp, nồng nàn.', imageUrl: 'https://drive.google.com/uc?export=download&id=1_CFcbBnuNsTpg_i9t-z28xbmpnACMdv_' },
  { id: '11', name: 'Bodymist PomPeii( 250ml)', price: 249000, description: 'Xịt thơm toàn thân với hương PomPeii sang trọng, bí ẩn.', imageUrl: 'https://drive.google.com/uc?export=download&id=11lAfkPF20TerYjrf1VJ-7HJZ6eZEaCqy' },
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  const product = mockProducts.find(p => p.id === productId);

  if (product) {
    return NextResponse.json(product);
  } else {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
}
