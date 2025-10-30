import { NextResponse } from 'next/server';
import { firestoreService } from '@/lib/firestore';

export async function POST() {
  try {
    const deletedCount = await firestoreService.orders.deleteOldOrders(7);
    
    return NextResponse.json({ 
      success: true, 
      message: `تم حذف ${deletedCount} طلب قديم`,
      deletedCount 
    });
  } catch (error) {
    console.error('Error cleaning up old orders:', error);
    return NextResponse.json({ error: 'Failed to cleanup old orders' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const deletedCount = await firestoreService.orders.deleteOldOrders(7);
    
    return NextResponse.json({ 
      success: true, 
      message: `تم حذف ${deletedCount} طلب قديم`,
      deletedCount 
    });
  } catch (error) {
    console.error('Error cleaning up old orders:', error);
    return NextResponse.json({ error: 'Failed to cleanup old orders' }, { status: 500 });
  }
}
