export async function GET() {
    return new Response(
        JSON.stringify({
            ok: false,
            message:
                'NextAuth is disabled in this project. Auth uses Supabase. Remove this notice and add NextAuth only if needed.'
        }),
        { status: 410, headers: { 'content-type': 'application/json' } }
    )
}

export async function POST() {
    return GET()
}
