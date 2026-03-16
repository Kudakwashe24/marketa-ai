import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";

    let query = supabaseAdmin
      .from("campaign_history")
      .select(
        "id, prompt, social_caption, whatsapp_promo, ad_copy, marketing_tip, created_at"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (search) {
      query = query.ilike("prompt", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("History fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch campaign history." },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("History route error:", error);

    return NextResponse.json(
      { error: "Failed to fetch campaign history." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Campaign id is required." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("campaign_history")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("History delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete campaign history item." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("History delete route error:", error);

    return NextResponse.json(
      { error: "Failed to delete campaign history item." },
      { status: 500 }
    );
  }
}