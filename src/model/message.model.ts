import mongoose, { Schema, Document } from "mongoose"
export interface MessagesTypes extends Document {
    content: string;
    createdAt: Date;
    username: string
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
    },
    username: {
        type: String,
        required: true
    }
})

export const MessageModel = (mongoose.models.Messages as mongoose.Model<MessagesTypes>) || mongoose.model<MessagesTypes>("Messages", messageSchmea);