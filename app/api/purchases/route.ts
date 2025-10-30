import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { purchases } from '@/shared/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }
    
    const userPurchases = await db
      .select()
      .from(purchases)
      .where(eq(purchases.customerEmail, email))
      .orderBy(desc(purchases.purchasedAt));
    
    return NextResponse.json(userPurchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 });
  }
}
