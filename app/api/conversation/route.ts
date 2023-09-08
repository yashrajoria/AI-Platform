import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { increaseAPILimit, checkAPILimit } from "@/lib/api-limit";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    console.log({ userId });
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkAPILimit();
    if (!freeTrial) {
      return new NextResponse("Free Trial has expired", { status: 403 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    await increaseAPILimit();

    // Check if 'choices' is an array with at least one choice
    if (Array.isArray(response.choices) && response.choices.length > 0) {
      // Access the message from the first choice
      const message = response.choices[0].message;
      return NextResponse.json(message);
    } else {
      // Handle the case where no choices are available
      return new NextResponse("No response message available", { status: 404 });
    }
  } catch (error) {
    console.log("[Conversation_error]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
