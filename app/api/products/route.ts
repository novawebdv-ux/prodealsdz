import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { products } from '@/shared/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allProducts = await db.select().from(products);
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, price, downloadLink } = body;
    
    const [newProduct] = await db.insert(products).values({
      title,
      description,
      price,
      downloadLink: downloadLink || null,
    }).returning();
    
    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
