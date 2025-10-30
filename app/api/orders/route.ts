import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { orders, products, purchases } from '@/shared/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (email) {
      const userOrders = await db.select().from(orders).where(eq(orders.customerEmail, email)).orderBy(desc(orders.createdAt));
      return NextResponse.json(userOrders);
    }
    
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return NextResponse.json(allOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerEmail, customerName, customerPhone, productId, productTitle, productPrice, total, receiptImageUrl } = body;
    
    const [newOrder] = await db.insert(orders).values({
      customerEmail,
      customerName,
      customerPhone,
      productId,
      productTitle,
      productPrice,
      total,
      receiptImageUrl,
      status: 'pending',
    }).returning();
    
    return NextResponse.json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
