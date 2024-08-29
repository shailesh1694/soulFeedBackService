import { z } from "zod"
import { UsernameValidation } from "./user"



export const SignUpSchema = z.object({
    username: UsernameValidation,
    email: z.string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email({ message: "provide valid email" }),
    password: z.string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(5, "Password must be more than 5 characters")
        .max(32, "Password must be less than 32 characters"),
})


export const LoginSchema = z.object({
    identifier: z.string({ required_error: "This is required" }).min(2, "Email or Username is required"),
    password: z.string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(5, "Password must be more than 5 characters")
        .max(32, "Password must be less than 32 characters"),
})