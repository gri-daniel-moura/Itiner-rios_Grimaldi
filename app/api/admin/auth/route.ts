import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const validEmail = process.env.ADMIN_EMAIL || 'seu.email@grimaldi.com.br';
    const validPassword = process.env.ADMIN_PASSWORD || 'sua_senha_aqui';

    if (email === validEmail && password === validPassword) {
      // Create JWT
      const token = await signToken({ email });

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

    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Erro Interno do Servidor' }, { status: 500 });
  }
}
