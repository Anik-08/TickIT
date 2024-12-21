import { getServerSession } from "next-auth";
import { authOptions } from "./app/api/auth/[...nextauth]/route"; // Adjust the path

export async function middleware(req) {
  const session = await getServerSession(authOptions, { req });

  if (session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/register", // Apply middleware to the register page only
};
