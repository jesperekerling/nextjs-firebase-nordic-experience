import { NextRequest, NextResponse } from 'next/server';
import { getUserClaims } from '../../../../firebase/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();
    const claims = await getUserClaims(uid);
    return NextResponse.json({ claims });
  } catch (error) {
    console.error('Error fetching user claims:', error);
    return NextResponse.json({ error: 'Failed to get user claims' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ allow: ['POST'] }, { status: 200 });
}