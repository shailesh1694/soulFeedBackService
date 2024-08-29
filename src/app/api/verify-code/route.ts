import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";
import { date } from "zod";

export async function POST(request: Request) {
    try {
        const { username, code } = await request.json()

        const decodeUsername = decodeURIComponent(username);
        console.log(decodeUsername, "decodedUsername")

        const findOne = await UserModel.findOne({ username: decodeUsername })
        if (!findOne) {
            return Response.json(
                {
                    success: false,
                    message: "user not found!"
                },
                { status: 404 }
            )
        }
        const isCodeValid = findOne.verifyCode === code;
        const isCodeNotExpired = new Date(findOne.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            findOne.isVerified = true;
            await findOne.save();

            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully"
                },
                { status: 200 }
            )
        } else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: true,
                    message: 'Verification code has expired. Please sign up again to get a new code.'
                },
                { status: 400 }
            )
        } else {
            return Response.json(
                {
                    success: true,
                    message: 'Incorrect verification code'
                },
                { status: 400 }
            )
        }

    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Erro in Verify Accoun !"
            },
            { status: 500 }
        )
    }

}