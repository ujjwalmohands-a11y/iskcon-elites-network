import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    // 1. Zero-Trust Auth Guard
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 2. Parse FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer for strict Node compatibility with Supabase storage upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Create a unique filename
    const uniqueFilename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    // 4. Upload to Supabase Storage (Assumes a public bucket named 'profiles' exists)
    const { data, error } = await supabase.storage
      .from('profiles')
      .upload(uniqueFilename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase Upload Error:', error.message);
      return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
    }

    // 5. Return the public URL
    const { data: publicUrlData } = supabase.storage
      .from('profiles')
      .getPublicUrl(uniqueFilename);

    return NextResponse.json({ url: publicUrlData.publicUrl });

  } catch (error: any) {
    console.error('Supabase Upload Exception:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}
