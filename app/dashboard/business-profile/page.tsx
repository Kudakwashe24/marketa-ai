"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  BUSINESS_TYPES,
  OTHER_BUSINESS_TYPE,
} from "@/lib/businessTypes";

type BusinessProfileForm = {
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

const EMPTY_PROFILE: BusinessProfileForm = {
  businessName: "",
  businessType: "Local Service Business",
  customBusinessType: "",
  description: "",
  targetAudience: "",
  location: "",
  phone: "",
  website: "",
  instagram: "",
  brandVoice: "Friendly",
  primaryColor: "#4f46e5",
  secondaryColor: "#0f172a",
  preferredCta: "",
  logoUrl: "",
  brandImages: [],
};

const BRAND_VOICES = [
  "Friendly",
  "Professional",
  "Bold",
  "Luxury",
  "Playful",
  "Warm",
  "Direct",
];

export default function BusinessProfilePage() {
  const [profile, setProfile] = useState<BusinessProfileForm>(EMPTY_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingAsset, setUploadingAsset] = useState<"logo" | "photo" | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/business-profile");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load business profile.");
        }

        if (data.profile) {
          setProfile({ ...EMPTY_PROFILE, ...data.profile });
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load profile."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const updateField = (
    field: keyof BusinessProfileForm,
    value: string | string[]
  ) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setMessage("");
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/business-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save business profile.");
      }

      setProfile({ ...EMPTY_PROFILE, ...data.profile });
      setMessage("Business profile and brand kit saved.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    assetType: "logo" | "photo"
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadingAsset(assetType);
    setMessage("");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("assetType", assetType);

      const res = await fetch("/api/business-profile/assets", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setProfile({ ...EMPTY_PROFILE, ...data.profile });
      setMessage(assetType === "logo" ? "Logo uploaded." : "Brand photo added.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to upload image."
      );
    } finally {
      setUploadingAsset(null);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <p className="mx-auto max-w-5xl text-slate-600">
          Loading your business profile...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600">Brand Kit</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Your Business Profile
            </h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Marketa uses this information to keep every campaign personal,
              accurate, and consistent with your brand.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="w-fit rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to Dashboard
          </Link>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Business details
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Business name">
                <input
                  required
                  value={profile.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                  placeholder="Example: Kuda's Premium Car Wash"
                  maxLength={120}
                  className="input"
                />
              </Field>

              <Field label="Business type">
                <select
                  value={profile.businessType}
                  onChange={(e) => updateField("businessType", e.target.value)}
                  className="input"
                >
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </Field>

              {profile.businessType === OTHER_BUSINESS_TYPE && (
                <Field label="Describe your type of business">
                  <input
                    required
                    value={profile.customBusinessType}
                    onChange={(e) =>
                      updateField("customBusinessType", e.target.value)
                    }
                    placeholder="Example: Mobile dog grooming"
                    maxLength={100}
                    className="input"
                  />
                </Field>
              )}

              <Field label="Location">
                <input
                  value={profile.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="Example: Brooklyn, Cape Town"
                  maxLength={160}
                  className="input"
                />
              </Field>

              <Field label="Phone / WhatsApp">
                <input
                  value={profile.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="Example: +27 71 234 5678"
                  maxLength={60}
                  className="input"
                />
              </Field>

              <Field label="Website">
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => updateField("website", e.target.value)}
                  placeholder="https://yourbusiness.co.za"
                  maxLength={240}
                  className="input"
                />
              </Field>

              <Field label="Instagram">
                <input
                  value={profile.instagram}
                  onChange={(e) => updateField("instagram", e.target.value)}
                  placeholder="@yourbusiness"
                  maxLength={120}
                  className="input"
                />
              </Field>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Field label="What does your business offer?">
                <textarea
                  value={profile.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Tell Marketa about your main products or services."
                  maxLength={600}
                  rows={5}
                  className="input resize-y"
                />
              </Field>

              <Field label="Who are your ideal customers?">
                <textarea
                  value={profile.targetAudience}
                  onChange={(e) =>
                    updateField("targetAudience", e.target.value)
                  }
                  placeholder="Example: Busy professionals living near Cape Town CBD."
                  maxLength={300}
                  rows={5}
                  className="input resize-y"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Brand personality
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              These choices guide Marketa's writing style and future posters.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Brand voice">
                <select
                  value={profile.brandVoice}
                  onChange={(e) => updateField("brandVoice", e.target.value)}
                  className="input"
                >
                  {BRAND_VOICES.map((voice) => (
                    <option key={voice}>{voice}</option>
                  ))}
                </select>
              </Field>

              <Field label="Preferred call to action">
                <input
                  value={profile.preferredCta}
                  onChange={(e) => updateField("preferredCta", e.target.value)}
                  placeholder="Example: WhatsApp us to book"
                  maxLength={160}
                  className="input"
                />
              </Field>

              <ColorField
                label="Primary colour"
                value={profile.primaryColor}
                onChange={(value) => updateField("primaryColor", value)}
              />
              <ColorField
                label="Secondary colour"
                value={profile.secondaryColor}
                onChange={(value) => updateField("secondaryColor", value)}
              />
            </div>

            <div
              className="mt-6 rounded-2xl p-6 text-white"
              style={{
                background: `linear-gradient(135deg, ${profile.primaryColor}, ${profile.secondaryColor})`,
              }}
            >
              <p className="text-sm font-medium text-white/80">Brand preview</p>
              <h3 className="mt-2 text-2xl font-bold">
                {profile.businessName || "Your business name"}
              </h3>
              <p className="mt-2 text-sm text-white/90">
                {profile.preferredCta || "Your preferred call to action"}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Logo and business photos
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Upload PNG, JPG, or WebP images smaller than 5 MB. These are saved
              once and can be reused in future posters.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-dashed border-slate-300 p-5">
                <p className="text-sm font-medium text-slate-800">
                  Business logo
                </p>

                {profile.logoUrl ? (
                  <Image
                    src={profile.logoUrl}
                    alt="Business logo"
                    width={240}
                    height={160}
                    unoptimized
                    className="mt-4 h-32 w-full rounded-xl bg-slate-50 object-contain p-4"
                  />
                ) : (
                  <div className="mt-4 flex h-32 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">
                    No logo yet — your business name will become your wordmark.
                  </div>
                )}

                <label className="mt-4 inline-block cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
                  {uploadingAsset === "logo" ? "Uploading..." : "Upload Logo"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    disabled={uploadingAsset !== null}
                    onChange={(e) => handleUpload(e, "logo")}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="rounded-2xl border border-dashed border-slate-300 p-5">
                <p className="text-sm font-medium text-slate-800">
                  Brand and product photos
                </p>

                {profile.brandImages.length > 0 ? (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {profile.brandImages.map((url) => (
                      <Image
                        key={url}
                        src={url}
                        alt="Brand asset"
                        width={180}
                        height={180}
                        unoptimized
                        className="aspect-square w-full rounded-xl object-cover"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 flex h-32 items-center justify-center rounded-xl bg-slate-100 px-4 text-center text-sm text-slate-500">
                    Upload products, services, premises, food, vehicles, or team
                    photos.
                  </div>
                )}

                <label className="mt-4 inline-block cursor-pointer rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  {uploadingAsset === "photo" ? "Uploading..." : "Add Photo"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    disabled={uploadingAsset !== null}
                    onChange={(e) => handleUpload(e, "photo")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={isSaving || uploadingAsset !== null}
              className="rounded-xl bg-slate-900 px-6 py-3 font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Business Profile"}
            </button>
            <p className="text-sm text-slate-500">
              Your saved details will automatically guide future campaigns.
            </p>
          </div>
        </form>
      </div>

      <style jsx>{`
        .input {
          margin-top: 0.5rem;
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(203 213 225);
          padding: 0.75rem 1rem;
          color: rgb(15 23 42);
          outline: none;
        }

        .input:focus {
          border-color: rgb(15 23 42);
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {children}
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-300 px-3 py-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer border-0 bg-transparent"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={20}
          className="w-full border-0 text-slate-900 outline-none"
        />
      </div>
    </Field>
  );
}
