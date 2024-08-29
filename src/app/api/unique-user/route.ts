import { NextResponse, type NextRequest } from 'next/server'
import { z } from "zod"
import { UsernameValidation } from '@/schemas/user'
import userModel from '@/model/user.model'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const username = searchParams.get('username')
        const result = UsernameValidation.safeParse(username)
        if (!result.success) {
            return Response.json(
                {
                    success: false,
                    message: result.error?.errors[0].message
                },
                { status: 400 }
            );
        }

        const findExistinguser = await userModel.findOne({ username: result.data, isVerified: true })

        if (findExistinguser) {
            return Response.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                { status: 200 }
            );
        }
        return NextResponse.json({
            success: true,
            message: "Username is unique"
        }, { status: 200 })
    } catch (error) {
        console.error('Error checking username:', error);
        return Response.json(
            {
                success: false,
                message: 'Error checking username',
            },
            { status: 500 }
        );
    }
}