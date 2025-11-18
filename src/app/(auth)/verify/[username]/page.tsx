'use client'
//[username] means we're getting dynamic data 

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifySchema } from '@/Schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams,useRouter } from 'next/navigation'


import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
//Use import * as z from 'zod' for zod, because it does not have a default export.import z from 'zod' will cause an error unless zod adds a default export.

const VerifyPage = () => {
  const router  = useRouter()
  const params = useParams<{username: string}>()
   //zod implementation
    //z.infer is a Zod utility that extracts a TypeScript type from a Zod schema, automatically generating a type that reflects the schema's structure and data.
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver:zodResolver(verifySchema),
        
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) =>{
      try {
        const response = await axios.post('/api/verify-code',
          {username:params.username,
            code:data.code
        })
        toast(`Success ${response.data.message}`)
        router.replace('/sign-in')
      } catch (error) {
        console.error ('Error in verification of user',error)
                const axiosError= error as AxiosError<ApiResponse>
                  let errorMessage = axiosError.response?.data.message
                  toast(`signup failed ${errorMessage}`)
                
      }
    }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full ma-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'> 
        <div className="text-center">
          <div>
            <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb:6'>
              Verify Your Account
            </h1>
            <p className='mb-4'>
              Enter the verification code sent to your email
              
            </p>
          </div>
          <div>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter verification code" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
          </div>

        </div>

      </div>
    </div>
  )
}

export default VerifyPage