import { GoogleGenAI } from "@google/genai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const businessType = body.businessType || "Local Service Business";
    const prompt = body.prompt || "";
    const socialCaption = body.socialCaption || "";
    const whatsappPromo = body.whatsappPromo || "";
    const adCopy = body.adCopy || "";

    if (!prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required to generate a poster." },
        { status: 400 }
      );
    }

    const posterPrompt = `
Create a clean, modern, professional square social media marketing poster for a small business.

Business type:
${businessType}

Promotion:
${prompt}

Reference campaign content:
Social caption: ${socialCaption}
WhatsApp promo: ${whatsappPromo}
Ad copy: ${adCopy}

Poster requirements:
- 1:1 square social media poster
- modern and eye-catching design
- professional business marketing style
- bold headline
- short supporting text
- clean layout with strong visual hierarchy
- suitable for Instagram or Facebook post
- no logo
- no watermark added by design instructions
- use visually appealing colors
- make it look like a ready-to-post promotional graphic
- keep text minimal and readable
- include a call to action

Return an image.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: posterPrompt,
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];

    const imagePart = parts.find((part) => part.inlineData);

    if (!imagePart?.inlineData?.data || !imagePart.inlineData.mimeType) {
      return NextResponse.json(
        { error: "No image was generated." },
        { status: 500 }
      );
    }

    const imageBase64 = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType;
    const imageUrl = `data:${mimeType};base64,${imageBase64}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Poster generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate poster." },
      { status: 500 }
    );
  }
}