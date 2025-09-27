import { getServerSession } from "next-auth";
// we can extract user from session using getServerSession as we have already added it in the session.
import { authOptions } from "../sign-up/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import {User} from "next-auth";

export async function POST (request: Request){
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
  const userId = user._id
  const {acceptMessages}=  await request.json()

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId,{isAcceptingMessage:acceptMessages},{new:true})
    // the {new:true} means that in return we'll get the updated value
    if(!updatedUser){
      return Response.json({
      success: false,
      message:"failed to update user status to accept messages"
    },{status:401})
    }else{
      return Response.json({
      success: true,
      message:"Message acceptance status updated successfully",
      updatedUser
    },{status:200})
    }
  } catch (error) {
      console.log("failed to update user status to accept messages")
       return Response.json({
      success: false,
      message:"failed to update user status to accept messages"
    },{status:500})
  }
}

export async function GET (request: Request){
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
  const userId = user._id
  try {
    const foundUser = await UserModel.findById(userId)
  if(!foundUser){
      return Response.json({
      success: false,
      message:"User not found"
    },{status:404})

  }
   return Response.json({
      success: true,
      isAcceptingMessages:foundUser.isAcceptingMessage
    },{status:200})
  } catch (error) {
     console.log("Error in getting messages acceptance status")
       return Response.json({
      success: false,
      message:"Error in getting messages acceptance status"
    },{status:500})
    
  }
}