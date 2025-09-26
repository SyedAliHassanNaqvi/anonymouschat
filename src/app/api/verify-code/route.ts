import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {success, z} from "zod";
import {usernameValidation} from "@/Schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation 
})

export async function POST(request:Request){
  await dbConnect()
  const {username,code} =await  request.json()
  //above we're getting it from body but we can also get it through para
  const decodedUsername=decodeURIComponent(username)
  //sometimes when we pass something as parameter, it gets encoded. So it is better to pass it through decodeURIComponent to decode it e.g if there is space in URI it shows '%20' on URI.Since we're getting it through bod so it's not needed. JUST FOR EDUCATIONAL PURPOSE


  const user = await UserModel.findOne({username:decodedUsername})
  if(!user){
    return Response.json({
      success:false,
      message:"User not found"
    },{status:400})
  }
  const isCodeValid= user.verifyCode === code

  const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
  if(isCodeValid && isCodeNotExpired){
    user.isVerified = true;
    await user.save()
    return Response.json({
      success:true,
      message:"User Verified Successfully"
    },{status:200})

  } else if(!isCodeNotExpired){
    return Response.json({
      success:false,
      message:"Verification Code is Expired.Sign Up again to get a new Code."
    },{status:400})
  } else{
    return Response.json({
      success:false,
      message:"Verification Code is Incorrect ! "
    },{status:400})
  }


  try {
    
  } catch (error) {
    console.log("Error verifying code")
    return Response.json({
      success:false,
      message:"Error verifying Code"
    },{status:500})
  }
}