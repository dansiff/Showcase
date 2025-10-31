import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const bucket = process.env.SUPABASE_EMILY_BUCKET || 'emily'

    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Missing SUPABASE config (URL or SERVICE_ROLE_KEY)' }, { status: 500 })
    }

    const form = await req.formData()
    const file = form.get('file') as File | null
    const folder = (form.get('folder') as string | null) || 'uploads'

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

    // Using SSR client with service key for server-side upload
    const cookieStore = await cookies()
    const supabase = createServerClient(url, serviceKey, {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    })

    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error } = await supabase.storage.from(bucket).upload(key, file, {
      contentType: file.type || undefined,
      upsert: false,
    })
    if (error) throw error

  const pub = supabase.storage.from(bucket).getPublicUrl(data.path)

  return NextResponse.json({ url: pub.data.publicUrl, path: data.path })
  } catch (err: any) {
    console.error('[EMILY-UPLOAD] Error', err)
    return NextResponse.json({ error: err?.message || 'Upload failed' }, { status: 500 })
  }
}
