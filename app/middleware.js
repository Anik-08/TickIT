import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If user has a valid session token, redirect to the dashboard
  if (token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Allow access to the register page if not authenticated
  return NextResponse.next();
}

export const config = {
  matcher: "/register", // Apply middleware to the register page only
};
