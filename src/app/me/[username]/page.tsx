"use client"

import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCompletion } from 'ai/react';
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { messageSchema } from "@/schemas/sendMessageschema"
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { json } from 'stream/consumers';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';

const SendMessages = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { username } = useParams<{ username: string }>()

    const initialMessage =
        "What's your Like most ?|Do you have any pets?|What's your dream?";

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: ""
        }
    });
    const { complete, completion, input, handleInputChange, error, isLoading: isSuggestLoading } =
        useCompletion({
            api: "/api/suggest-message",
            initialCompletion: initialMessage
        });

    const { toast } = useToast()


    const messageContent = form.watch("content")



    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true)

        try {
            const result = await axios.post("/api/send-messages", { username: username, content: data.content })
            form.setValue("content", "")
            toast({title:"Send FeedBack",description:result.data.message})
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({ title: "Erro in Send FeedBack !", variant: "destructive", description: axiosError.response?.data.message })
        } finally {
            setIsLoading(false)
        }
    }

    const fetchSuggestedMessages = async () => {
        try {
            complete('');
        } catch (error) {
            toast({ title: "Error in Fetching Messages", description: "Please try after some times" })
            console.error('Error fetching messages:', error);
        }
    }

    const perseSuggestMessage = (message: string): string[] => {
        return message.split("|")
    }


    const handleMessageClick = (message: string) => {
        form.setValue("content", message)
    }

    return (
        <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-center">
                Soul Feedback service
            </h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us a little bit about yourself"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center">
                        {isLoading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isLoading || !messageContent}>
                                Send It
                            </Button>
                        )}
                    </div>
                </form>
            </Form>

            <div className="space-y-4 my-8">
                <div className="space-y-2">
                    <Button
                        onClick={fetchSuggestedMessages}
                        className="my-4"
                        disabled={isSuggestLoading}
                    >
                        Suggest Messages
                    </Button>
                    <p>Click on any message below to select it.</p>
                </div>
                <Card>
                    <CardHeader>
                        <h3 className="text-xl font-semibold">Messages</h3>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4">
                        {error ? (
                            <p className="text-red-500">{JSON.parse(error?.message!)?.message}</p>
                        ) : (
                            perseSuggestMessage(completion).map((message, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="mb-2"
                                    onClick={() => handleMessageClick(message)}
                                >
                                    {message}
                                </Button>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
            <Separator className="my-6" />
            <div className="text-center">
                <div className="mb-4">Get Your Message Board</div>
                <Link href={'/sign-up'}>
                    <Button>Create Your Account</Button>
                </Link>
            </div>
        </div>
    )
}

export default SendMessages