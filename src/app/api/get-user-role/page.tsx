import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../firebase/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();
    const user = await auth.getUser(uid);
    const customClaims = user.customClaims || {};

    if (customClaims.role) {
      return NextResponse.json({ role: customClaims.role });
    } else {
      return NextResponse.json({ message: 'No role assigned to this user.' });
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
    return NextResponse.json({ message: 'Error fetching user role.' }, { status: 500 });
  }
}