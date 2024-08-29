import { sendEmail } from "@/helper/sendEmail";
import dbConnet from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcryptjs from "bcryptjs";

export async function POST(request: Request) {
    await dbConnet();

    try {
        const { email, password, username } = await request.json();
        const findUsername = await UserModel.findOne({ username, isVerified: true })

        if (findUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                },
                { status: 400 }
            )
        }
        
        const findExistingByemail = await UserModel.findOne({ email })

        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if (findExistingByemail) {
            if (findExistingByemail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User is already verified !"
                    },
                    { status: 400 }
                )
            } else {
                const hashPassword = await bcryptjs.hash(password, 10)
                findExistingByemail.password = hashPassword;
                findExistingByemail.verifyCode = verifyCode;
                findExistingByemail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await findExistingByemail.save()
            }
        } else {
            const hashPass = await bcryptjs.hash(password, 10)
            const expiry = new Date()
            expiry.setHours(expiry.getHours() + 1)
            const createUser = new UserModel({
                username,
                email,
                password: hashPass,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiry,
                isVerified: false,
                isAceptingMessage: true,
                messages: []
            })
            await createUser.save();
        }

        // send verification Mail 
        const mailsendErro = (error: any) => {
            return Response.json(
                {
                    success: false,
                    message: "Internal server error "
                },
                { status: 500 }
            )
        }
        const sendMail = await sendEmail(email, verifyCode, username, mailsendErro)

        console.log(sendMail, 'mail')
        return Response.json(
            {
                success: true,
                message: 'User registered successfully. Please verify your account.',
            },
            { status: 201 }
        );

        return Response.json(
            {
                success: true,
                message: "user register !"
            },
            { status: 201 }
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