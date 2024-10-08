import { auth } from "@/auth";
import mongoose from "mongoose";
import dbConnet from "@/lib/dbConnect";
import { MessageModel } from "@/model/message.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { messageId: string } }) {
    await dbConnet();
    const session = await auth();
    const messageId = params.messageId
    try {


        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, message: "you are not authorized!" },
                { status: 400 }
            )
        }
        const findOneand = await MessageModel.findByIdAndDelete({ _id: messageId })

        return Response.json(
            {
                success: true,
                message: "Message delete successfull",
            },
            { status: 200 }
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error in message Delete"
            },
            { status: 400 }
        )
    }
}