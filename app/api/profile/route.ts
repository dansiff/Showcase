import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// GET - Fetch current user's profile
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.user.findUnique({
      where: { email: user.email! },
      include: {
        profile: true,
        creator: true,
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (err: any) {
    console.error('GET profile API error', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

// POST - Create/update profile and set role
export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { role, name, company } = body || {}

    // Normalize to DB user by email (Prisma uses internal id; Supabase uses external id)
    let dbUser = await prisma.user.findUnique({ where: { email: user.email! } })
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: user.email!,
          name: user.user_metadata?.name ?? null,
        } as any,
      })
    }

    // Handle role-based signup (from OAuth callback)
    if (role) {
      const userRole = role === "creator" ? "CREATOR" : "USER"
      
      // Update user role
      await prisma.user.update({
        where: { email: user.email! },
        data: { role: userRole },
      })

      // If creator, ensure Creator record exists
      if (userRole === "CREATOR") {
        const existingCreator = await prisma.creator.findUnique({
          where: { userId: dbUser.id },
        })

        if (!existingCreator) {
          await prisma.creator.create({
            data: {
              userId: dbUser.id,
              displayName: user.user_metadata?.name || user.email?.split('@')[0] || 'Creator',
              promoEndsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90-day launch promo
            } as any,
          })
        }
      }

      return NextResponse.json({ ok: true, role: userRole }, { status: 200 })
    }

    // Legacy: Handle old profile update (name + company)
    if (name) {
      await prisma.user.update({
        where: { email: user.email! },
        data: { name },
      })
    }

    if (company) {
      const existingProfile = await prisma.profile.findUnique({
        where: { userId: dbUser.id },
      })

      if (!existingProfile) {
        await prisma.profile.create({
          data: { userId: dbUser.id, bio: `Company: ${company}` },
        })
      } else {
        await prisma.profile.update({
          where: { userId: dbUser.id },
          data: { bio: `Company: ${company}` },
        })
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err: any) {
    console.error('POST profile API error', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
