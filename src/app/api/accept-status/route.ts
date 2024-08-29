import { auth } from "@/auth";
import dbConnet from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnet()
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, message: "you are not authorized!" },
                { status: 400 }
            )
        }
        const findUser = await UserModel.findOne({ _id: session.user._id, isVerified: true })
        if (!findUser) {
            return NextResponse.json(
                { success: false, message: "user not found" },
                { status: 400 }
            )
        }

        return NextResponse.json({ success: true, message: "get details", isAceptingMessage: findUser.isAceptingMessage }, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Error in accept-message details" },
            { status: 400 }
        )
    }

}