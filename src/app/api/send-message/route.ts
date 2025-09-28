import UserModel from "@/model/User";
import {Message} from "@/model/User"; //imported message interface from user mode;
import dbConnect from "@/lib/dbConnect";

export async function POST ( request :Request ){
  await dbConnect();

  const {username,content} = await request.json()
  try {
    const user = await UserModel.findOne({username})
    if(!user){
      return Response.json({
              success: false,
             message:"User not found "
           },{status:404})
    }

    // is user accepting the messages 
    if(!user.isAcceptingMessage){
      return Response.json({
              success: false,
             message:"User is not accepting messages"
           },{status:403})
    }
    const newMessage= {content,createdAt: new Date()}
      user.messages.push(newMessage as Message) //as Message is written because of type script we are strongly tellling typescript that this newmessage is of message type you dont have to worry
      await user.save();
      return Response.json({
              success: false,
             message:"Message has been sent successfully"
           },{status:403})
      
    
  } catch (error) {
    console.log("Error adding meesages ",error)
     return Response.json({
              success: false,
             message:"internal server error "
           },{status:500})

    
  }
}