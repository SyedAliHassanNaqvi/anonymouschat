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
      
    ]
}