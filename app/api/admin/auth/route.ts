import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validPassword) {
      return NextResponse.json({ error: 'Senha de acesso não configurada no servidor' }, { status: 500 });
    }

    if (password === validPassword) {
      // Create JWT
      const token = await signToken({ role: 'admin' });

      // Create response and set cookie
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Erro Interno do Servidor' }, { status: 500 });
  }
}
