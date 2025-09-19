import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request){
  await dbConnect();
  try{
    const{username,email,password}=await request.json();
    const existingUserVerifiedByUsername= await UserModel.findOne({
      username,
      isVerified:true
    })
    if(existingUserVerifiedByUsername){
      return Response.json({
        success:false,
        message:"Username already taken!"
      },{status:400})
    }

    const existingUserVerifiedByEmail= await UserModel.findOne({
      email
    })

    const verifyCode= Math.floor(100000+ Math.random() * 900000).toString()

    if(existingUserVerifiedByEmail){
      if(existingUserVerifiedByEmail.isVerified){
        return Response.json ({
        success:false,
        message:"User already exists with this email"
      },{status:400})
      }
      else 
      {
        const hashedPassword= await bcrypt.hash(password,10)
        existingUserVerifiedByEmail.password = hashedPassword
        existingUserVerifiedByEmail.verifyCode = verifyCode;
        existingUserVerifiedByEmail.verifyCodeExpiry= new Date(Date.now() + 3600000)
        await existingUserVerifiedByEmail.save();
      }
    }
    else{
      //10 rounds of hashing of password
      const hashedPassword = await bcrypt.hash(password,10)
      const expiryDate= new Date();
      expiryDate.setHours(expiryDate.getHours() + 1 )

      const newUser = new UserModel({
        username,
          password:hashedPassword,
          email,
          verifyCode:verifyCode,
          verifyCodeExpiry:expiryDate,
          isVerified:false,
          isAcceptingMessage:true,
          messages:[]
      })
      await newUser.save()
    }
    const emailResponse = await sendVerificationEmail(
      email,username,verifyCode
    )

    if(!emailResponse.success){
      return Response.json ({
        success:false,
        message:emailResponse.message
      },{status:500})
    }
    return Response.json ({
      success:true,
      message:"User registered successfully, Please verify your email"
    },{status:201})
    
  }
  catch (error){
    console.error("Error in sign-up route:",error);
    return Response.json({success:false,message:"Error registering user"}, {status:500});
  }

}