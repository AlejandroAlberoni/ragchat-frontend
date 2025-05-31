import { type NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
    const protectedRoutes = ['/admin'];

    const path = req.nextUrl.pathname;
    const isProtected = protectedRoutes.includes(path);

    const token = req.cookies.get('access_token')?.value;

    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/auth', req.nextUrl));
    }

    return NextResponse.next();
}