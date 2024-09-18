import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";


export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
  }

export async function middleware(req: NextRequest) {
    const session = await auth()
    const url = req.nextUrl;

    console.log(session,"session")
    // Redirect to dashboard if the user is already authenticated
    // and trying to access sign-in, sign-up, or home page
    if (
        session?.user &&
        (url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname === '/')
    ) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (!session?.user && url.pathname.startsWith('/dashboard')) {
        console.log("first")
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    return NextResponse.next();
}
