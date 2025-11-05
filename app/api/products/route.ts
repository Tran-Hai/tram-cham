import { NextResponse } from 'next/server';

// Define the structure of a product
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

// Mock data provided by the user
const mockProducts: Product[] = [
  { id: '1', name: 'Gel Tắm Nước Hoa Dưỡng Da Love Charm', price: 189000, description: '', imageUrl: 'https://drive.google.com/uc?id=1yaOohm_W-yXKhLE7qWiPJ75cIb5FOn87' },
  { id: '2', name: 'Gel Tắm Nước Hoa Dưỡng Da PomPeii', price: 189000, description: '', imageUrl: 'https://drive.google.com/uc?id=1FdvfefNRBm0QPtI5JJyMAiFILw8nURTP' },
  { id: '3', name: 'Gel Tắm Nước Hoa Dưỡng Da Eden', price: 189000, description: '', imageUrl: 'https://drive.google.com/uc?id=1RSp-hAfqYQrXpqszjLKHrKc5iIc63g2O' },
  { id: '4', name: 'Gel Tắm Nước Hoa Dưỡng Da Gondola', price: 189000, description: '', imageUrl: 'https://drive.google.com/uc?id=1Gcrd8AeFxoYttnixQcicxyNrFG9jsqg5' },
  { id: '5', name: 'Gel Tắm Nước Hoa Dưỡng Da Siena', price: 189000, description: '', imageUrl: 'https://drive.google.com/uc?id=1a4Qxh7Jx0Y1XjhfSp3q8ba0n5BFSDgE1' },
  { id: '6', name: 'Gel Tắm Nước Hoa Dưỡng Da Rome', price: 189000, description: '', imageUrl: 'https://drive.google.com/uc?id=1_V2lQGINfHKpF4aCtPhCvXy5ptSNKCTy' },
  { id: '7', name: 'Gel Tắm Nước Hoa Dưỡng Da 3in1 Caesar’s', price: 229000, description: '', imageUrl: 'https://drive.google.com/uc?id=1_bETAkjKrKqhEnMl9n6JdkAf7OBgLsXI' },
  { id: '8', name: 'Bodymist Love Charm( 250ml)', price: 249000, description: '', imageUrl: 'https://drive.google.com/uc?id=1JArzenjjKVbcucCCrJyoMvZbtkg0mZK9' },
  { id: '9', name: 'Bodymist Caesar’ Legend(250ml)', price: 249000, description: '', imageUrl: 'https://drive.google.com/uc?id=1yB-Lwp95HzUKM8V1Jy_tHmDcLXbHGyZj' },
];

export async function GET() {
  // Now, we simply return the mock data.
  // The Google Sheets connection is temporarily removed.
  return NextResponse.json(mockProducts);
}