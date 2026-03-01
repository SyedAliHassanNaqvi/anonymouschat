'use client'
import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/Schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"


const page = () => {
  const [messages,setMessages] = useState<Message[]>([])
  const [isLoading,setIsLoading]= useState(false)
  const [isSwitchLoading,setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId:string) =>{
    setMessages(messages.filter((messages)=>{messages._id !== messageId}))
  }

  const {data: session} = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const {register,watch, setValue} = form

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async () =>{
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages',response.data.isAcceptingMessage!)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast(axiosError.response?.data.message|| "Failed to fetch message settings")
    }
    finally{
      setIsSwitchLoading(false)
    }
  },[setValue])
  return (
    <div>Dashboard</div>
  )
}

export default page