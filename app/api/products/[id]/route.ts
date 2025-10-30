import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { products } from '@/shared/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, price, downloadLink } = body;
    const productId = parseInt(params.id);
    
    const [updatedProduct] = await db
      .update(products)
      .set({ title, description, price, downloadLink })
      .where(eq(products.id, productId))
      .returning();
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    await db.delete(products).where(eq(products.id, productId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
