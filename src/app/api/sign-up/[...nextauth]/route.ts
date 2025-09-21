/*Just for clarity  [...nextauth] ---> route.ts

means [...nextauth] will catch all -->  api/auth/id    or api/auth/id/id2 or api/auth/params1/params2/.....  will be all catch in route.ts in [...nextauth]


while [nextauth]  only catch api/auth/id*/ 
import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler  = NextAuth(authOptions)

export {handler as GET,handler as POST }