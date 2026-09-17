import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export type BusinessProfile = {
  userId: string;
  businessName: string;
  businessType: string;
  customBusinessType: string;
  description: string;
  targetAudience: string;
  location: string;
  phone: string;
  website: string;
  instagram: string;
  brandVoice: string;
  primaryColor: string;
  secondaryColor: string;
  preferredCta: string;
  logoUrl: string;
  brandImages: string[];
};

type BusinessProfileRow = {
  user_id: string;
  business_name: string | null;
  business_type: string | null;
  custom_business_type: string | null;
  description: string | null;
  target_audience: string | null;
  location: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  brand_voice: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  preferred_cta: string | null;
  logo_url: string | null;
  brand_images: unknown;
};

export function mapBusinessProfile(
  row: BusinessProfileRow
): BusinessProfile {
  return {
    userId: row.user_id,
    businessName: row.business_name ?? "",
    businessType: row.business_type ?? "Local Service Business",
    customBusinessType: row.custom_business_type ?? "",
    description: row.description ?? "",
    targetAudience: row.target_audience ?? "",
    location: row.location ?? "",
    phone: row.phone ?? "",
    website: row.website ?? "",
    instagram: row.instagram ?? "",
    brandVoice: row.brand_voice ?? "Friendly",
    primaryColor: row.primary_color ?? "#4f46e5",
    secondaryColor: row.secondary_color ?? "#0f172a",
    preferredCta: row.preferred_cta ?? "",
    logoUrl: row.logo_url ?? "",
    brandImages: Array.isArray(row.brand_images)
      ? row.brand_images.filter((value): value is string => typeof value === "string")
      : [],
  };
}

export async function getBusinessProfile(userId: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("business_profiles")
    .select(
      "user_id, business_name, business_type, custom_business_type, description, target_audience, location, phone, website, instagram, brand_voice, primary_color, secondary_color, preferred_cta, logo_url, brand_images"
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch business profile: ${error.message}`);
  }

  return data ? mapBusinessProfile(data as BusinessProfileRow) : null;
}
