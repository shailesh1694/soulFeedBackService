import nodemailer from "nodemailer";

export const sendEmail = async (email: string, otp: string, username: string, callback: (error: any) => void) => {

    try {
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOption = {
            from: "soulfeedbackservice@noreplay.info",
            to: `${email}`,
            subject: `Verify code`,
            html: `<p> Your verify code is ${otp} ! Click<a href=${process.env.APP_DOMAIN}/verify/${username}>Here</a><p/> to verify Yourself !`,
        }
        const sendInfo = await transport.sendMail(mailOption);
        return sendInfo
    } catch (error: any) {
        console.log(error,"Erro in mails")
        throw new Error(error.message);
    }


}




