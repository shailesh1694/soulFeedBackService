import mongoose, { Schema, Document } from "mongoose"
interface MessagesTypes extends Document {
    content: string;
    createdAt: Date;
}

const messageSchmea: Schema<MessagesTypes> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})


interface UserType extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAceptingMessage: boolean;
    messages: MessagesTypes[]
}

const userSchema: Schema<UserType> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "verifyCode is required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "verifyCodeExpiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAceptingMessage: {
        type: Boolean,
        default: true
    },
})

export default (mongoose?.models?.User as mongoose.Model<UserType>) || mongoose.model<UserType>("User", userSchema);