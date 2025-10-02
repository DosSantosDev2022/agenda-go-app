import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // A 'secret' deve ser a mesma que você usa nas suas authOptions.
  // É comum colocá-la em uma variável de ambiente (process.env.NEXTAUTH_SECRET).
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // Adiciona o pathname nos headers para o layout ler de forma confiável
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  const isAuthPage = pathname.startsWith('/auth');

  // Se o usuário NÃO tem um token (não está logado) E não está tentando acessar
  // uma página de autenticação, redirecione-o para o login.
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Se o usuário TEM um token (está logado) E está tentando acessar uma página de
  // autenticação (como /auth/login), redirecione-o para o dashboard.
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Se nenhuma das condições acima for atendida, continue a requisição com o header do pathname.
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// O matcher garante que o middleware rode nas páginas corretas.
export const config = {
  matcher: ['/dashboard/:path*', '/onboarding', '/auth/:path*'],
};