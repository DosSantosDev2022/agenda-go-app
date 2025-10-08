// middleware.ts

import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Coleta o Token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { pathname } = request.nextUrl;

  // Definições de rota
  const isAuthPage = pathname.startsWith("/auth");
  const isProtectedPath =
    pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding");
  const isHomePage = pathname === "/";

  // O Next.js/Auth.js faz isso automaticamente, mas é bom ter uma verificação explícita
  if (isAuthPage) {
    // 2. Se o usuário está logado E tenta acessar /auth, joga para /dashboard.
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // Se NÃO está logado, permite que ele acesse a página /auth.
    return NextResponse.next();
  }

  // 3. Se o usuário NÃO está logado E tenta acessar uma rota protegida, redireciona para login.
  if (!token && (isProtectedPath || isHomePage)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 4. Se o usuário está logado, ou se a rota não é protegida, ou se a rota é a home (e ele está logado), continua.
  // Adiciona o pathname nos headers (Seu código original)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// O matcher garante que o middleware rode nas páginas corretas.
// Não incluímos o '/auth' aqui porque a lógica de exclusão está no código acima.
export const config = {
  // Cobrir todas as rotas que precisam de checagem.
  matcher: ["/", "/dashboard/:path*", "/onboarding", "/auth/:path*"],
};
