import { NextResponse } from 'next/server';
import { firestoreService } from '@/lib/firestore';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, price, imageUrl, postPurchaseContent, discountPrice, discountEndDate } = body;
    
    await firestoreService.products.update(params.id, {
      title,
      description,
      price,
      imageUrl,
      postPurchaseContent,
      discountPrice,
      discountEndDate,
    });
    
    const updatedProduct = await firestoreService.products.getById(params.id);
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
    await firestoreService.products.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
