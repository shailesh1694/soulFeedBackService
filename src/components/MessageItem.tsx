"use client"
import React from 'react'
import dayjs from "dayjs"
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { AlertDialogFooter, AlertDialogHeader, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { ApiMessage, ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { useToast } from './ui/use-toast'

const itemItem = ({ item, onDeleteMsg }: { item: ApiMessage, onDeleteMsg: (messageId: string) => void }) => {
    const { toast } = useToast()

    const handleDeleteConfirm = async () => {

        try {
            const result = await axios.get<ApiResponse>("/api/delete-message/" + item._id)
            toast({ title: result.data.message })
            onDeleteMsg(item._id)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({ title: "Error in Delete Message !", description: axiosError.response?.data.message, variant: "destructive" })
        }

    }


    return (
        <Card className="card-bordered">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{item.content}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant='destructive'>
                                <X className="w-5 h-5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete
                                    this item.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className="text-sm">
                    {dayjs(new Date()).format('MMM D, YYYY h:mm A')}
                </div>
            </CardHeader>
            <CardContent></CardContent>
        </Card>
    )
}

export default itemItem