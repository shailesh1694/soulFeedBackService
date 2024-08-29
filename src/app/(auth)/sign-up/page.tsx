"use client"
import React, { useState } from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useDebouncedCallback } from "use-debounce"
import { Loader2 } from "lucide-react"
import { useForm } from 'react-hook-form'
import { SignUpSchema } from '@/schemas/singUpSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

const SingUp = () => {

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isCheckingusername, setIsCheckingusername] = useState<boolean>(false)
  const [usernameMessage, setUsernameMessage] = useState<string>("")

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "", email: "", password: "",
    }
  })
  const { toast } = useToast()
  const router = useRouter()
  const debounce = useDebouncedCallback(
    (values) => {
      verifyUsername(values)
    },
    1000
  )

  const verifyUsername = async (value: string) => {
    setIsCheckingusername(true)
    setUsernameMessage("")
    try {
      const result = await axios.get<ApiResponse>("/api/unique-user?username=" + value)
      setUsernameMessage(result.data.message)
    } catch (error) {
      const axiosErro = error as AxiosError<ApiResponse>
      setUsernameMessage(axiosErro?.response?.data.message ?? "Error checking username")
    } finally {
      setIsCheckingusername(false)
    }

  }
  const submitHandler = async (data: z.infer<typeof SignUpSchema>) => {
    setIsSubmitting(true)
    try {
      const result = await axios.post<ApiResponse>("/api/sign-up", data)

      toast({ title: "success", description: result.data.message })
      if (result.data.success) {
        router.push(`/verify/${data.username}`)
      }
      setIsSubmitting(false)
    } catch (error) {
      console.error('Error during sign-up:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');


      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-600">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Join Soul Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Username" {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounce(e.target.value)
                      }}
                    />
                  </FormControl>
                  <FormDescription className='text-gray-400'>
                    {isCheckingusername && <Loader2 className="animate-spin" />}
                    {!isCheckingusername && usernameMessage && (
                      <p
                        className={`text-sm ${usernameMessage === 'Username is unique'
                            ? 'text-green-500'
                            : 'text-red-500'
                          }`}
                      >
                        {usernameMessage}
                      </p>
                    )}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormDescription className='text-gray-400'>We will send you a verification code</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Password" type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                  : "Sing Up"
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SingUp