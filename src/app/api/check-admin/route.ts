import { NextRequest, NextResponse } from 'next/server';
import { getUserClaims } from '../../../../firebase/firebaseAdmin';

export async function POST(req: NextRequest) {
  const { uid } = await req.json();

  if (!uid) {
    return NextResponse.json({ message: 'Missing uid' }, { status: 400 });
  }

  try {
    const claims = await getUserClaims(uid);
    if (claims && claims.admin) {
      return NextResponse.json({ message: `User ${uid} is an admin` }, { status: 200 });
    } else {
      return NextResponse.json({ message: `User ${uid} is not an admin` }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ message: `Error: ${(error as Error).message}` }, { status: 500 });
  }
}