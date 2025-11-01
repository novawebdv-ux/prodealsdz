
import { NextResponse } from 'next/server';
import { firestoreService } from '@/lib/firestore';
import { ADMIN_EMAILS } from '@/lib/auth';

export async function GET() {
  try {
    const adminSettings = await firestoreService.admins.get();
    const emails = adminSettings?.emails || ADMIN_EMAILS;
    return NextResponse.json({ emails });
  } catch (error) {
    console.error('Error fetching admin emails:', error);
    return NextResponse.json({ emails: ADMIN_EMAILS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    
    await firestoreService.admins.addEmail(email.toLowerCase().trim());
    const updated = await firestoreService.admins.get();
    
    return NextResponse.json({ emails: updated?.emails || [] });
  } catch (error) {
    console.error('Error adding admin:', error);
    return NextResponse.json({ error: 'Failed to add admin' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }
    
    await firestoreService.admins.removeEmail(email.toLowerCase().trim());
    const updated = await firestoreService.admins.get();
    
    return NextResponse.json({ emails: updated?.emails || [] });
  } catch (error) {
    console.error('Error removing admin:', error);
    return NextResponse.json({ error: 'Failed to remove admin' }, { status: 500 });
  }
}
