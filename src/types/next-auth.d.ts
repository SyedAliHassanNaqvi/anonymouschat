// in this file we'll modify existing data types
import "next-auth"
import { DefaultSession } from "next-auth";


// we cannot use interface to modify the types of package. To make package fully aware about the type we modified/created new datatype, we use declare module syntax . In model(user) we did use interface because it was our code written in typescript but this is a package and we're interfaring with the interface of ths package.
// here we'll change the interface "User" of next-auth
// we did this because we wanted to allow next-auth to add values to the token in callbacks (jwt) in options to make next auth know that these field exist in user as its user did'nt have this we had to manually modify the user module of next auth
declare module 'next-auth'{
    interface User{
      _id?:string; //added _id field in the existing "User" interface of next-auth
      isVerified?:boolean;
      isAcceptingMessages?:boolean;
      username?:string 
    }
    interface Session{
      user:{
          _id?:string; 
      isVerified?:boolean;
      isAcceptingMessages?:boolean;
      username?:string 
      }& DefaultSession ['user'] // it sayss wherever there will be default session there must be a key named 'user' irrespective of k usky ander values ati hain ya ni ati
      
    }

}
// another way
declare module "next-auth/jwt"{
  interface JWT{
    _id?:string; 
      isVerified?:boolean;
      isAcceptingMessages?:boolean;
      username?:string 
  } 
  }
