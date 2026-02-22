'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import {useEffect, useState } from "react"
import {Loader2} from "lucide-react"
import {useDebounceValue,useDebounceCallback} from "usehooks-ts"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signUpSchema } from "@/Schemas/signUpSchema"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { text } from "stream/consumers"
import { signInSchema } from "@/Schemas/signInSchema"
import { signIn } from "next-auth/react"
// we will have to check after every split of time that if the username is uniquely avalable or not. This technique is called debouncing technique. We'll use usehook ts library for debouncing 
//   const [debouncedValue, setValue] = useDebounceValue(defaultValue, 500) jo bhi value doge wo immediately set ni hoga. Jo bhi time deingy uss time k baad set hoga like here we gave 500 milliseconds

const page = () => {
  
  const [isSubmitting,setIsSubmitting]= useState(false)
  


  const router = useRouter();

  //zod implementation
  //z.infer is a Zod utility that extracts a TypeScript type from a Zod schema, automatically generating a type that reflects the schema's structure and data.
  const form = useForm<z.infer<typeof signInSchema>>({
      resolver:zodResolver(signInSchema),
      defaultValues:{
        identifier:'',
        password:''
      }
  })


//z.infer is a Zod utility that extracts a TypeScript type from a Zod schema, automatically generating a type that reflects the schema's structure and data.


// in onsubmit we'll be passing data. Now what is data? data is the fields coming from form which are email ,password
  const onSubmit = async (data:z.infer<typeof signInSchema>) =>{
      setIsSubmitting(true)
      // using signIn by next-auth
      const result = await signIn('credentials',{
        redirect:false,
        identifier:data.identifier,
        password: data.password

      }) 
      if(result?.error){
        toast("login failed Incorrect username or password")
      }
      if(result?.url){
        router.replace("./dashboard")
      }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-10">
      <div className="w-full ma-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Anonymous Chat 

          </h1>
          <p className="mb-4 ">
            Sign-In to start your anonymous adventure

          </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                   
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email / Username </FormLabel>
              <FormControl>
                <Input placeholder="email or username  " {...field}  />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password  " {...field}  />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          Sign In 
        </Button>
        
                </form>
            </Form>
            <div className="text-center mt-4">
              <p>
                Not a member ? {' '}
              </p>
                <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                Sign Up
                </Link>

            </div>

      </div>
    </div>
  )
}

export default page