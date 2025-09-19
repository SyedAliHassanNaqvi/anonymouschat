import mongoose,{Schema, Document, mongo} from 'mongoose';
// we imported 'Document' from mongoose because we want to use it as a type for our user model because of tpescript basically its for just typesafety

//we'll create interface for user model(a datatype)  its basically similar to structs in c language
export interface Message extends Document{
  content:string;
  createdAt:Date;
} 
//now we create a schema for user model
//a schema is basically a structure of a model
//it defines how the data will be stored in the database
// the part :Schema<Message> is for typesafety in typescript
//we are saying that this schema is for the Message interface we created above
//so now if we try to add a field which is not in the Message interface it will give an error
const MessageSchema:Schema<Message>= new Schema({
  content:{
    type:String,
    required:true
  },
  createdAt:{
    type:Date,
    required:true,
    default:Date.now
  }
})

export interface User extends Document{
  username:string;
  password:string;
  email:string;
  verifyCode:string;
  verifyCodeExpiry:Date;
  isVerified:boolean;
  isAcceptingMessage:boolean;
  messages:Message[]
}

//now we create a model for user schema

const UserSchema:Schema<User>= new Schema({
  username:{
    type:String,
    required:[true,'Username is required'],
    trim:true,
    unique:true
  },
  email:{
    type:String,
    required:[true,'Email is required'],
    unique:true,
    match:[ /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/ ,'Please enter a valid email address'] //regex for email validation regex is wrapped in / / and the second part is the error message
  },
  password:{
    type:String,
    required:[true,'Passwrod is required'],
  },
  verifyCode:{
    type:String,
    required:[true,'Verify Code is required'],
  },
  verifyCodeExpiry:{
    type:Date,
    required:[true,'Verify Code Expiry is required'],
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  isAcceptingMessage:{
    type:Boolean,
    default:true
  },
  messages:[MessageSchema] //embedding the MessageSchema in the UserSchema as an array of messages

})

const UserModel=(mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema)) // in case there is existing model we use it in line 'mongoose.models.User as mongoose.Model<User>' and 'as mongoose.Model<User>' is for typesafety

export default UserModel;