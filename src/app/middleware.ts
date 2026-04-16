// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value;

//   const isLoginPage = request.nextUrl.pathname === "/login";

//   // chưa login → về login
//   if (!token && !isLoginPage) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // đã login → không cho vào login nữa
//   if (token && isLoginPage) {
//     return NextResponse.redirect(new URL("/trang-chu", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next|favicon.ico).*)"],
// };
