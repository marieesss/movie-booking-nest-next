import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/movies"];

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token");
  
  if (!token && protectedRoutes.includes(req.nextUrl.pathname)) {
    const absoluteURL = new URL("/auth/register", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  return NextResponse.next(); 
}
