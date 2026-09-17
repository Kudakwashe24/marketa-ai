import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getBusinessProfile,
  mapBusinessProfile,
} from "@/lib/businessProfile";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const BUCKET = "brand-assets";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

async function ensureBucket() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data } = await supabaseAdmin.storage.getBucket(BUCKET);

  if (data) return;

  const { error } = await supabaseAdmin.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: MAX_FILE_SIZE,
    allowedMimeTypes: Array.from(ALLOWED_TYPES),
  });

  if (error && !error.message.toLowerCase().includes("already exists")) {
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const assetType = formData.get("assetType");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please choose an image." },
        { status: 400 }
      );
    }

    if (assetType !== "logo" && assetType !== "photo") {
      return NextResponse.json(
        { error: "Invalid asset type." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Use a PNG, JPG, or WebP image." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Images must be smaller than 5 MB." },
        { status: 400 }
      );
    }

    await ensureBucket();

    const extension =
      file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : "jpg";
    const objectPath = `${userId}/${assetType}-${crypto.randomUUID()}.${extension}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const supabaseAdmin = getSupabaseAdmin();

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(objectPath, bytes, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(objectPath);

    const currentProfile = await getBusinessProfile(userId);
    const existingImages = currentProfile?.brandImages ?? [];
    const update =
      assetType === "logo"
        ? { logo_url: publicUrl }
        : { brand_images: [...existingImages, publicUrl].slice(-8) };

    const { data, error } = await supabaseAdmin
      .from("business_profiles")
      .upsert(
        {
          user_id: userId,
          ...update,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select(
        "user_id, business_name, business_type, custom_business_type, description, target_audience, location, phone, website, instagram, brand_voice, primary_color, secondary_color, preferred_cta, logo_url, brand_images"
      )
      .single();

    if (error || !data) {
      throw error ?? new Error("Failed to save brand asset.");
    }

    return NextResponse.json({
      url: publicUrl,
      profile: mapBusinessProfile(data),
    });
  } catch (error) {
    console.error("Brand asset upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image." },
      { status: 500 }
    );
  }
}
