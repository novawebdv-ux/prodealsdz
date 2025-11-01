import { NextResponse } from 'next/server';
import { firestoreService } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (email) {
      const userOrders = await firestoreService.orders.getByEmail(email);
      return NextResponse.json(userOrders);
    }
    
    const allOrders = await firestoreService.orders.getAll();
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
    
    const orderId = await firestoreService.orders.create({
      customerEmail,
      customerName,
      customerPhone,
      productId,
      productTitle,
      productPrice,
      total,
      receiptImageUrl,
      status: 'pending',
    });
    
    const newOrder = await firestoreService.orders.getById(orderId);
    return NextResponse.json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
