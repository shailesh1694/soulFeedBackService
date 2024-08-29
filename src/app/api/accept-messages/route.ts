import { auth } from "@/auth";
import dbConnet from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnet();
    const session = await auth();

    try {
        const { acceptMessage } = await request.json()
        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, message: "you are not authorized!" },
                { status: 400 }
            )
        }
        const findOne = await UserModel.findByIdAndUpdate(session.user._id, { $set: { isAceptingMessage: acceptMessage } }, { new: true })
        return Response.json(
            {
                success: true,
                message: "accept message update successfull",
                isAceptingMessage: findOne?.isAceptingMessage
            },
            { status: 200 }
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Internal server error "
            },
            { status: 500 }
        )
    }
}