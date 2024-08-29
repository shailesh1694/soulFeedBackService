import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
export const runtime = 'edge';

export async function POST(req: Request) {

    try {
        const prompt = "Create a list of three positive feedback questions formatted as a single string. Each question should be separated by '|'.These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.ensure that question was a positive welcoming"
        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            max_tokens: 2000,
            stream: true,
            prompt:prompt,
        });

        const stream = OpenAIStream(response);

        return new StreamingTextResponse(stream);
    } catch (error) {

        if (error instanceof OpenAI.APIError) {
            return NextResponse.json({ status:false,message:error.message }, { status: 429 });
        } else {
            return NextResponse.json({ status: false, messgae: "UnExpencted Erro " }, { status: 400 });
        }
    }

}