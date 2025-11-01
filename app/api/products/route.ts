import { NextResponse } from 'next/server';
import { firestoreService } from '@/lib/firestore';

export async function GET() {
  try {
    const allProducts = await firestoreService.products.getAll();
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, price, imageUrl, downloadLink } = body;
    
    const productId = await firestoreService.products.create({
      title,
      description,
      price,
      imageUrl: imageUrl || undefined,
      downloadLink: downloadLink || undefined,
    });
    
    const newProduct = await firestoreService.products.getById(productId);
    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
