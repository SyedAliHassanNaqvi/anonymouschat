'use client'
/*
An AuthProvider is an object or service that handles a web application's authentication and authorization logic, providing standardized methods for user login, logout, identity verification, and access control. Instead of developers implementing these complex security features from scratch, they can integrate an AuthProvider to manage user sessions and interact with external authentication services like Auth0, Firebase, or custom methods, ensuring a consistent and secure way to handle user authentication. */
import { SessionProvider } from "next-auth/react"
import React from "react"

export default function AuthProvider({
  children,
  
}:{children:React.ReactNode}) {
  return (
    <SessionProvider >
     {children}
    </SessionProvider>
  )
}


