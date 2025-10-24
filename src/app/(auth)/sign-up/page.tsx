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
// we will have to check after every split of time that if the username is uniquely avalable or not. This technique is called debouncing technique. We'll use usehook ts library for debouncing 
//   const [debouncedValue, setValue] = useDebounceValue(defaultValue, 500) jo bhi value doge wo immediately set ni hoga. Jo bhi time deingy uss time k baad set hoga like here we gave 500 milliseconds

const page = () => {
  const [username , setUsername] = useState('')
  const [usernameMessage,setUsernameMessage] =useState('')
  const [isCheckingUsername , setIsCheckingUsername] = useState(false)
  const [isSubmitting,setIsSubmitting]= useState(false)
  const debounced = useDebounceCallback(setUsername,300)
  // now we get the debounced Username now we'll fire the request in the backend from this variable which is the debounced way.

  const router = useRouter();

  //zod implementation
  //z.infer is a Zod utility that extracts a TypeScript type from a Zod schema, automatically generating a type that reflects the schema's structure and data.
  const form = useForm<z.infer<typeof signUpSchema>>({
      resolver:zodResolver(signUpSchema),
      defaultValues:{
        username:'',
        email:'',
        password:''
      }
  })
// we'll  use useEffect here because we want that whenever debouncedUsername is change we have to check if it is available or not. UseEffect runs whenver the elements in element array changes like we put debouncedUsername in that array of useEffect at line 62
 useEffect(() => {
  const checkUsernameUnique = async () => {
    if (username) {
      setIsCheckingUsername(true)
      setUsernameMessage('')
      try {
        const response = await axios.get(`/api/check-username-unique?username=${username}`)
        console.log(response)
        setUsernameMessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        setUsernameMessage(
          axiosError.response?.data.message ?? "Error checking Username"
        )
      } finally {
        setIsCheckingUsername(false)
      }
    }
  }
  
  checkUsernameUnique() // ✅ Now it's called correctly
  
}, [username])
//z.infer is a Zod utility that extracts a TypeScript type from a Zod schema, automatically generating a type that reflects the schema's structure and data.


// in onsubmit we'll be passing data. Now what is data? data is the fields coming from form which are username ,email ,password
  const onSubmit = async (data:z.infer<typeof signUpSchema>) =>{
      setIsSubmitting(true)
      try {
        const response = await axios.post <ApiResponse> ('/api/sign-up',data) // data is username,email and password
        toast(response.data.message)
        router.replace(`/verify/${username}`) // can also use redirect instead of replace
        setIsSubmitting(false) // can also do it in finally block
      } catch (error) {
        console.error ('Error in signup of user',error)
        const axiosError= error as AxiosError<ApiResponse>
          let errorMessage = axiosError.response?.data.message
          toast(`signup failed ${errorMessage}`)
          setIsSubmitting(false)
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
            Sign-up to start your anonymous adventure

          </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                   <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username  " {...field} onChange={
                  (e)=>{
                    field.onChange(e) // updates React Hook Form’s internal state
                  debounced(e.target.value)// updates your local `username` for debounce checking
                   }} />
                   
              </FormControl>
              {isCheckingUsername && <Loader2 className="animate-spin"/>}
              <p className={`text-sm ${usernameMessage=== "Username is available" ? 'text-green-500':'text-red-500'}`}>
                {usernameMessage}
              </p>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email  " {...field}  />
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
          {
            isSubmitting ? (
              <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
               
              </>
            ) : ('Sign-Up')
          }
        </Button>
        
                </form>
            </Form>
            <div className="text-center mt-4">
              <p>
                Already a member ? {' '}
              </p>
                <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                Sign In
                </Link>

            </div>

      </div>
    </div>
  )
}

export default page