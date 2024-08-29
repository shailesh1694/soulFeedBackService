import { auth } from "@/auth";
import dbConnet from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import {MessageModel} from "@/model/message.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    await dbConnet();
    const session = await auth();

    try {
        const searchParams = request.nextUrl.searchParams

        const page = Number(searchParams.get('page')) || 1
        const pageSize = Number(searchParams.get('pageSize')) || 4

        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, message: "you are not authorized!" },
                { status: 400 }
            )
        }
        const findOne = await UserModel.findById(session.user._id)

        if (!findOne) {
            return NextResponse.json(
                { success: false, message: "User not found!" },
                { status: 404 }
            )
        }
        const message = await MessageModel.aggregate([
            {
                $match: {
                    username: findOne.username,
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $facet: {
                    totalCount: [
                        { $count: "count" }
                    ],
                    feedback: [
                        { $skip: (page - 1) * pageSize },
                        { $limit: pageSize },
                        {
                            $project: {
                                content: 1,
                                createdAt: 1
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
                    feedback: 1
                }
            }
        ])

        // console.log(message?.[0]?.totalCount,"totalCount")
        // console.log(message?.[0]?.data,"data")
        return Response.json(
            {
                success: true,
                message: "accept message update successfull",
                data: message[0]
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