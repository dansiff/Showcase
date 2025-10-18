import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { message: 'Referral tracking is currently disabled.' },
    { status: 503 } // 503 = Service Unavailable
  );
}
