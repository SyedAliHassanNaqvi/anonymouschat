'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import {useState } from "react"
import {useDebounceValue} from "usehooks-ts"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signUpSchema } from "@/Schemas/signUpSchema"
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
  const form = useForm<z.infer<typeof signUpSchema>>({
      resolver:zodResolver(signUpSchema),
      defaultValues:{
        username:'',
        email:'',
        password:''
      }
  })

  return (
    <div>page</div>
  )
}

export default page