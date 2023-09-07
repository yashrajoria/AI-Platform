import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    console.log({ userId });
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }
    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }
    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }
    try {
      const response = await openai.images.generate({
        prompt,
        n: parseInt(amount, 10),
        size: resolution,
      });
      console.log({ response });
      console.log(typeof response.data);
      console.log(response.data);

      // Access the message from the first choice
      const dataArray = Object.values(response.data);
      const message = dataArray[0];
      return new NextResponse(message, { status: 200 });
    } catch (error) {
      console.error((error as Error).stack);

      // Log the error stack trace
      console.error("[API Request Error]", error);
      return new NextResponse("Error making API request", { status: 500 });
    }
  } catch (error) {
    console.log("[Image_error]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
