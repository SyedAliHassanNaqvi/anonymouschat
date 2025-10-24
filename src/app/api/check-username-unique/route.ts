import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {success, z} from "zod";
import {usernameValidation} from "@/Schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username:usernameValidation


})

export async function GET(request:Request){
  //TODO:use this in all other routes
  //it is a get function what if we send request in post or some other method we should handle that error right.But next js handle it automatically so no need for the following code:
  /*if(request.method !== 'GET'){
     return Response.json({
        success:true,
        message:'This function is a GET method. This method not allowed'
      },{status:405})
  }*/
  await dbConnect();
  try {
    const {searchParams} = new URL(request.url)
    const queryParam ={username:searchParams.get('username')} 
    /*equivalent to :const url = new URL(request.url)
const searchParams = url.searchParams*/
    const result = UsernameQuerySchema.safeParse(queryParam)
    console.log(result) // todo remove
    if(!result.success){
      const usernameErrors= result.error.format().username?._errors || []
      return Response.json({
        success:false,
        message:usernameErrors?.length>0 ? usernameErrors.join(','): 'invalid query parameter'
      },{status:400})
    }
    const {username} = result.data
    const existingVerifiedUser = await UserModel.findOne({username,isVerified:true})
    if(existingVerifiedUser){
      return Response.json({
        success:false,
        message:'Username is already taken'
      },{status:200})
    }
    return Response.json({
        success:true,
        message:'Username is available'
      },{status:200})

  } catch (error) {
    console.log("Error checking username")
    return Response.json({
      success:false,
      message:"Error checking username"
    },{status:500})
    
  }
}