import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { orders, purchases, products } from '@/shared/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, rejectionReason } = body;
    const orderId = parseInt(params.id);
    
    const [updatedOrder] = await db
      .update(orders)
      .set({
        status,
        rejectionReason: rejectionReason || null,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();
    
    if (status === 'confirmed') {
      const product = await db.select().from(products).where(eq(products.id, updatedOrder.productId)).limit(1);
      
      if (product[0]) {
        await db.insert(purchases).values({
          orderId: updatedOrder.id,
          customerEmail: updatedOrder.customerEmail,
          productId: updatedOrder.productId,
          productTitle: updatedOrder.productTitle,
          downloadLink: product[0].downloadLink || '',
        });
      }
    }
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
