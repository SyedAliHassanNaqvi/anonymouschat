// most of the next auth things are done in options
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions:NextAuthOptions={
    providers:[
      CredentialsProvider({
        id: "credentials",
        name: "Credentials",

        credentials: {
            email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
            password: { label: "Password", type: "password" }
             },
    async authorize(credentials:any):Promise<any>{
        await dbConnect();
        try{
            const user = await UserModel.findOne({
          $or:[
            {email:credentials.identifier.email},
            {username:credentials.identifier.username}
          ]
          
        })
        if(!user){
            throw new Error("User not found with these credentials")
          }
          if(!user.isVerified){
            throw new Error("please verify your account first")
          }

          const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password)
          if(isPasswordCorrect){
            return user;
          }else{
            throw new Error("Password is Incorrect")
          }

        }
        catch(err:any){
            throw new Error(err)
        }
    }


      }) 
    ],
    callbacks:{
      async session({ session, token }) {
        if(token){
          session.user._id=token._id;
          session.user.isVerified=token.isVerified
          session.user.isAcceptingMessages=token.isAcceptingMessages
          session.user.username=token.username
        }
      return session
    },
    async jwt({ token, user }) {
      // in this we'll extract data from user and pass it to token , so that when we have to get user related data we can get it from token instead of making db calls.
          if(user){
            token._id=user._id?.toString();
            token.isVerified= user.isVerified;
            token.isAcceptingMessages=user.isAcceptingMessages;
            token.username=user.username;
          }
      return token
    }
    },
    pages:{
      signIn:"/sign-in"
    },
    session:{
      strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET,



}