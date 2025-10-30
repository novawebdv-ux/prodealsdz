import { NextResponse } from 'next/server';
import { firestoreService } from '@/lib/firestore';

export async function GET() {
  try {
    const currentSettings = await firestoreService.settings.get();
    return NextResponse.json(currentSettings || { ccpNumber: '0000000000', ccpName: 'ProDeals DZ' });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { ccpNumber, ccpName } = body;
    
    await firestoreService.settings.createOrUpdate({ ccpNumber, ccpName });
    const updated = await firestoreService.settings.get();
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
