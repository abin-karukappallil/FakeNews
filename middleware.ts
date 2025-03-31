import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.SECRET_KEY || " ";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    // If no token is found, redirect to login if not already on login/signup pages
    if (!token) {
        if (pathname !== '/auth/login' && pathname !== '/auth/signup') {
            console.log("No token found, redirecting to login...");
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }
        return NextResponse.next();
    }

    try {
        // Decode and verify the JWT token
        const secretKey = new TextEncoder().encode(SECRET_KEY);
        const { payload } = await jwtVerify(token, secretKey);
        console.log("Decoded Token:", payload);

        // If the user is logged in and tries to visit login or signup page, redirect them to the home page
        if (pathname === '/auth/login' || pathname === '/auth/signup') {
            return NextResponse.redirect(new URL('/', req.url));
        }

        return NextResponse.next();

    } catch (error) {
        console.log("Invalid token, redirecting to login...");
        const response = NextResponse.redirect(new URL('/auth/login', req.url));
        response.cookies.delete("token"); // Remove the invalid token from cookies
        return response;
    }
}

export const config = {
    matcher: ['/', '/auth/signup', '/auth/login'], // Updated matcher paths
};
