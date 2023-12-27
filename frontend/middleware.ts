import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { PAGE_LOGIN } from './constants/page'
import { KEY_ACCESS_TOKEN } from './constants/app'

export function middleware(request: NextRequest) {
    const accessToken = cookies().get(KEY_ACCESS_TOKEN)
    const hasAccessToken = accessToken && accessToken.value
    if (!hasAccessToken) {
        return NextResponse.redirect(new URL(PAGE_LOGIN, request.url))
    }
    return NextResponse.next();
}
 
export const config = {
  matcher: '/dashboard/:path*',
}