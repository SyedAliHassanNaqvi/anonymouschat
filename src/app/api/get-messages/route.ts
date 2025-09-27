import { getServerSession } from "next-auth";
// we can extract user from session using getServerSession as we have already added it in the session.
import { authOptions } from "../sign-up/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import {User} from "next-auth";
import mongoose from "mongoose";


export async function GET(request: Request){
   await dbConnect();
  //getServerSession requires authOptions because it needs credentialsProvider
  const session = await getServerSession(authOptions)
  const user:User = session?.user as User 

  if(!session || !session.user){
    return Response.json({
      success: false,
      message:"Not authenticated "
    },{status:401})
  }
  const userId = new mongoose.Types.ObjectId(user._id); 
  try {
      
  } catch (error) {
    
  }
}