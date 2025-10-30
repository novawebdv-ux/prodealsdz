import { NextResponse } from 'next/server';
import { firestoreService } from '@/lib/firestore';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, rejectionReason } = body;
    
    await firestoreService.orders.update(params.id, {
      status,
      rejectionReason: rejectionReason || undefined,
    });
    
    const updatedOrder = await firestoreService.orders.getById(params.id);
    
    if (status === 'confirmed' && updatedOrder) {
      const product = await firestoreService.products.getById(updatedOrder.productId);
      
      if (product) {
        await firestoreService.purchases.create({
          orderId: updatedOrder.id,
          customerEmail: updatedOrder.customerEmail,
          productId: updatedOrder.productId,
          productTitle: updatedOrder.productTitle,
          downloadLink: product.downloadLink || '',
        });
      }
    }
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
