import { z } from "zod";

export const UsernameValidation = z
        .string({ required_error: "username required must" })
        .min(3, "Username must be at least 2 characters")
        .max(20, "Username must be no more than 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/,'Username must not contain special characters')
