import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE LOWER(username) = LOWER(?) AND password = ?', [cleanUser, cleanPass]);
    console.log("Login attempt:", { username: cleanUser, password: cleanPass, foundUser: user });

    if (!user) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set('user_role', user.role, { path: '/', maxAge: 60 * 60 * 24 * 7 });
    cookieStore.set('user_username', user.username, { path: '/', maxAge: 60 * 60 * 24 * 7 });
    if (user.client_id) {
      cookieStore.set('user_client_id', user.client_id.toString(), { path: '/', maxAge: 60 * 60 * 24 * 7 });
    }

    return NextResponse.json({ success: true, role: user.role }, { status: 200 });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
