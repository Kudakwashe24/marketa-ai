import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getBusinessProfile,
  mapBusinessProfile,
} from "@/lib/businessProfile";
import { OTHER_BUSINESS_TYPE } from "@/lib/businessTypes";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await getBusinessProfile(userId);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Business profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load business profile." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const businessName = clean(body.businessName, 120);
    const businessType = clean(body.businessType, 100);
    const customBusinessType = clean(body.customBusinessType, 100);

    if (!businessName) {
      return NextResponse.json(
        { error: "Business name is required." },
        { status: 400 }
      );
    }

    if (!businessType) {
      return NextResponse.json(
        { error: "Business type is required." },
        { status: 400 }
      );
    }

    if (businessType === OTHER_BUSINESS_TYPE && !customBusinessType) {
      return NextResponse.json(
        { error: "Please tell Marketa what type of business you run." },
        { status: 400 }
      );
    }

    const { data, error } = await getSupabaseAdmin()
      .from("business_profiles")
      .upsert(
        {
          user_id: userId,
          business_name: businessName,
          business_type: businessType,
          custom_business_type:
            businessType === OTHER_BUSINESS_TYPE ? customBusinessType : "",
          description: clean(body.description, 600),
          target_audience: clean(body.targetAudience, 300),
          location: clean(body.location, 160),
          phone: clean(body.phone, 60),
          website: clean(body.website, 240),
          instagram: clean(body.instagram, 120),
          brand_voice: clean(body.brandVoice, 60) || "Friendly",
          primary_color: clean(body.primaryColor, 20) || "#4f46e5",
          secondary_color: clean(body.secondaryColor, 20) || "#0f172a",
          preferred_cta: clean(body.preferredCta, 160),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select(
        "user_id, business_name, business_type, custom_business_type, description, target_audience, location, phone, website, instagram, brand_voice, primary_color, secondary_color, preferred_cta, logo_url, brand_images"
      )
      .single();

    if (error || !data) {
      console.error("Business profile save error:", error);
      return NextResponse.json(
        { error: "Failed to save business profile." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      profile: mapBusinessProfile(data),
      message: "Business profile saved.",
    });
  } catch (error) {
    console.error("Business profile save error:", error);
    return NextResponse.json(
      { error: "Failed to save business profile." },
      { status: 500 }
    );
  }
}
