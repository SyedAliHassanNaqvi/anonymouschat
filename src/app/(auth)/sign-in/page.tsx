'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import {useEffect, useState } from "react"
import {useDebounceValue} from "usehooks-ts"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signUpSchema } from "@/Schemas/signUpSchema"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
// we will have to check after every split of time that if the username is uniquely avalable or not. This technique is called debouncing technique. We'll use usehook ts library for debouncing 
//   const [debouncedValue, setValue] = useDebounceValue(defaultValue, 500) jo bhi value doge wo immediately set ni hoga. Jo bhi time deingy uss time k baad set hoga like here we gave 500 milliseconds

const page = () => {
  const [username , setUsername] = useState('')
  const [usernameMessage,setUsernameMessage] =useState('')
  const [isCheckingUsername , setIsCheckingUsername] = useState(false)
  const [isSubmitting,setIsSubmitting]= useState(false)
  const debouncedUsername = useDebounceValue(username,300)
  // now we get the debouncedUsername now we'll fire the request in the backend from this variable which is the debounced way.

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
  useEffect(()=>{
    const checkUsernameUnique = async () => {

      if(debouncedUsername){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
          console.log(response)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError= error as AxiosError<ApiResponse>
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking Username"
          )
        } finally {
          setIsCheckingUsername(false)
        }

      }
      
      checkUsernameUnique()
    
    }

  },[debouncedUsername])
//z.infer is a Zod utility that extracts a TypeScript type from a Zod schema, automatically generating a type that reflects the schema's structure and data.


// in onsubmit we'll be passing data. Now what is data? data is the fields coming from form which are username ,email ,password
  const onSubmit = async (data:z.infer<typeof signUpSchema>) =>{
      setIsSubmitting(true)
      try {
        const response = await axios.post <ApiResponse> ('/api/sign-up',data) // data is username,email and password
        toast(response.data.message)
        router.replace(`/verify/${username}`)
        setIsSubmitting(false) // can also do it in finally block
      } catch (error) {
        
      }
  }

  return (
    <div>page</div>
  )
}

export default page