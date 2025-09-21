import { defaultConfig } from 'next/dist/server/config-shared'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export {default}  from "next-auth/middleware" // using middleware for entire file
import {getToken} from "next-auth/jwt"
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token= await getToken({req:request})
  const url = request.nextUrl

  if(token && (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up') || url.pathname.startsWith('/verify') || url.pathname.startsWith('/')))
  return NextResponse.redirect(new URL('/home', request.url))

  if(!token && url.pathname.startsWith('/dashboard')){
    return NextResponse.redirect(new URL('/sign-in',request.url))
  }
}
  
// See "Matching Paths" below to learn more
//config has routes where we want to run the middleware
export const config = {
  matcher: ['/sign-in',
  '/sign-up',
  '/dashboard/:path*',
  '/',
  '/verify/:path*'
  // :path* means that jo bhi aagy dashboard k routes hain sb py middleware apply hoga
  ]
}