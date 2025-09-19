// most of the next auth things are done in options
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions:NextAuthOptions={
    providers:[
      CredentialsProvider({
        id: "domain-login",
    name: "Domain Account"
      })
      
    ]
}