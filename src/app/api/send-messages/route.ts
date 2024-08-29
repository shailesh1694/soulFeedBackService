import dbConnet from "@/lib/dbConnect";
import {MessageModel} from "@/model/message.model";
import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";


export async function POST(req: Request) {

    await dbConnet();

    try {
        const { username, content } = await req.json()

        const findUser = await UserModel.findOne({ username })
        if (!findUser) {
            return NextResponse.json({ success: false, message: "user not found !" }, { status: 404 })
        }
        if (!findUser.isAceptingMessage) {
            return NextResponse.json({ success: false, message: "user not accept Feedback" }, { status: 400 })
        }
        const createMessage = await MessageModel.create({
            content, username
        })
        return NextResponse.json({ success: true, message: "FeedBack succeessfull send !" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error in message send" }, { status: 400 })
    }

}