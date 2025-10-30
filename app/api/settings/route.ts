import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { settings } from '@/shared/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const [currentSettings] = await db.select().from(settings).limit(1);
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
    
    const [currentSettings] = await db.select().from(settings).limit(1);
    
    if (currentSettings) {
      const [updated] = await db
        .update(settings)
        .set({ ccpNumber, ccpName, updatedAt: new Date() })
        .where(eq(settings.id, currentSettings.id))
        .returning();
      return NextResponse.json(updated);
    } else {
      const [created] = await db.insert(settings).values({ ccpNumber, ccpName }).returning();
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
