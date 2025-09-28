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

  
    /*this is the method to write aggregation pipeline: await UserModel.aggregate([
      {}, //first pipeline 
      {},// second pipeline 
      there is a pipeline method called 'unwind' which returns opened array objects which wil unable us to perform opertions like sorting etc.
    ]) */
    try {
      const user= await UserModel.aggregate([
        {$match:{id:userId}},
        {$unwind: '$messages'}, // unwind operation on array messages[] in user model
        {$sort:{'messages.createdAt':-1}}, // -1 tells MongoDB to sort the documents by the field messages.createdAt in descending order (newest first). 
        {$group:{_id:'$_id',messages:{$push:'$messages'}}}
       ])
       if(!user || user.length === 0){
        return Response.json({
              success: false,
             message:"User not found "
           },{status:404})
       }
       return Response.json({
        success: true,
         messages:user[0].messages //we've to send messages[] in return but this is the method because aggregation pipeline returns method in this way 
    },{status:401})
    } catch (error) {

      console.log("Unexpected eror occured while getting messages ",error)
       return Response.json({
              success: false,
             message:"Error getting messages  "
           },{status:500})
    }
      
 
}