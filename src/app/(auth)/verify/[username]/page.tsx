"use client"
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useParams, useRouter } from 'next/navigation'
import { codeVerifySchema } from '@/schemas/verifyCodeSchema'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios, { AxiosError } from 'axios'
import { Input } from '@/components/ui/input'
import { ApiResponse } from '@/types/ApiResponse'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

const VerifyUsername = () => {

    const { username } = useParams<{ username: string }>()
    const [isVerifying, setIsVerifying] = useState<boolean>(false)
    const { toast } = useToast()
    const router = useRouter()
    const form = useForm<z.infer<typeof codeVerifySchema>>({
        resolver: zodResolver(codeVerifySchema),
        defaultValues: {
            code: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof codeVerifySchema>) => {
        setIsVerifying(true)
        try {
            const result = await axios.post<ApiResponse>("/api/verify-code", { username, code: data.code })
            console.log(result, "result")
            toast({ title: "Success", description: result.data.message })
            if (result?.data?.success) {
                router.push("/sign-in")
            }
            setIsVerifying(false)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Verification Failed",
                description: axiosError.response?.data.message ?? "An error occurred. Please try again.",
                variant: "destructive"
            })
            setIsVerifying(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel>Verification Code</FormLabel> */}
                                    <Input placeholder='Verification Code' {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isVerifying}>

                            {
                                isVerifying
                                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                    : "Verify"
                            }
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyUsername