"use client"

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { acceptMessageSchema } from '@/schemas/acceptMessage';
import { ApiMessage, ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@radix-ui/react-separator';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import MessageItem from '@/components/MessageItem';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const Dashboard = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false)
    const [messages, setMessages] = useState<ApiMessage[]>([])
    const session = useSession()
    const { toast } = useToast()

    useEffect(() => {
        Promise.all([getacceptMessageStatus(), getAllFeedback()])
    }, [])

    const { register, watch, setValue, formState: { errors }, reset } = useForm<z.infer<typeof acceptMessageSchema>>({
        resolver: zodResolver(acceptMessageSchema),
    })
    const acceptMessage = watch("acceptMessages")


    const handleSwitchChange = async (checked: boolean) => {
        setIsSwitchLoading(true)
        try {
            const result = await axios.post<ApiResponse>("/api/accept-messages", { acceptMessage: checked })
            setValue("acceptMessages", checked)
            toast({ title: "ACCEPT MESSAGE", description: result.data.message, variant: "default" })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            setValue("acceptMessages", checked)
            toast({ title: "Error", description: axiosError.response?.data.message, variant: "destructive" })
        } finally {
            setIsSwitchLoading(false)
        }
    }

    const getacceptMessageStatus = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const result = await axios.post<ApiResponse>("/api/accept-messages", {})
            setValue("acceptMessages", result.data.isAceptingMessage as boolean)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({ title: "Error", description: axiosError.response?.data.message, variant: "destructive" })
        } finally {
            setIsSwitchLoading(false)
        }
    }, [])

    const getAllFeedback = useCallback(async (refresh: boolean = false) => {

        setIsLoading(true)
        setIsSwitchLoading(false)
        try {
            const result = await axios.get<ApiResponse>("/api/get-messages")

            setMessages(result.data.data?.feedback as ApiMessage[])
            if (refresh) {
                toast({ title: "Refreshed Messages", description: "Showing latest messages" })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({ title: "Error", description: axiosError.response?.data.message, variant: "destructive" })
        } finally {
            setIsSwitchLoading(false)
            setIsLoading(false)
        }
    }, [])


    const copytoClipBoard = useCallback((url: string) => {
        navigator.clipboard.writeText(url)
        toast({ title: "URL Copied!", description: "Profile URL has been copied to Clipboard!" })
    }, [])

    const onDeleteMsg = (messageId: string) => {
        getAllFeedback(true)
    }

    if (!session || !session.data?.user) return <div></div>

    const profileUrl = window && `${window?.location?.protocol}//${window?.location?.host}/me/${session.data?.user?.username}`



    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={() => copytoClipBoard(profileUrl)} >Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register("acceptMessages")}
                    checked={acceptMessage}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages:
                    {acceptMessage ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault()
                    getAllFeedback(true)
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((item, index) => (
                        <MessageItem
                            key={item._id}
                            item={item}
                            onDeleteMsg={onDeleteMsg}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    )
}

export default Dashboard