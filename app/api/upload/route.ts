import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    const apiKey = process.env.IMGBB_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'ImgBB API key not configured' }, { status: 500 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    
    const imgbbFormData = new FormData();
    imgbbFormData.append('image', base64Image);
    
    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: imgbbFormData,
    });
    
    if (!imgbbResponse.ok) {
      const errorData = await imgbbResponse.json();
      console.error('ImgBB upload failed:', errorData);
      return NextResponse.json({ error: 'Failed to upload to ImgBB' }, { status: 500 });
    }
    
    const imgbbData = await imgbbResponse.json();
    
    if (imgbbData.success && imgbbData.data && imgbbData.data.url) {
      return NextResponse.json({ url: imgbbData.data.url });
    } else {
      return NextResponse.json({ error: 'Invalid response from ImgBB' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
