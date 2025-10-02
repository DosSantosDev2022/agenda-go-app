import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

const publicRoutes = [
	{
		path: "/login",
		whenAuthenticated: "redirect",
	},
	{
		path: "/register",
		whenAuthenticated: "redirect",
	},
	{
		path: "/verify-email",
		whenAuthenticated: "next",
	},
	{
		path: "/",
		whenAuthenticated: "next",
	},
	{
		path: "/about",
		whenAuthenticated: "redirect",
	},
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login";

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const publicRoute = publicRoutes.find((route) => route.path === path);

	const isProduction = process.env.NODE_ENV === "production";
	const authCookieName = isProduction
		? "__Secure-next-auth.session-token"
		: "next-auth.session-token";

	const authToken = request.cookies.get(authCookieName);

	if (!authToken && publicRoute) {
		return NextResponse.next();
	}

	if (!authToken && !publicRoute) {
		const redirectUrl = request.nextUrl.clone();

		redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;

		return NextResponse.redirect(redirectUrl);
	}

	if (
		authToken &&
		publicRoute &&
		publicRoute.whenAuthenticated === "redirect"
	) {
		const redirectUrl = request.nextUrl.clone();

		redirectUrl.pathname = "/dashboard";

		return NextResponse.redirect(redirectUrl);
	}

	if (authToken && !publicRoute) {
		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config: MiddlewareConfig = {
	matcher: [
		"/",
		"/login",
		"/register",
		"/verify-email",
		"/dashboard/:path*",
	],
};