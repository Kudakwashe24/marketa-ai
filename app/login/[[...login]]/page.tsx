import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import AuthFrame from "@/components/AuthFrame";
import { normalizePlanKey } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Marketa AI marketing workspace.",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ plan?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { plan: requestedPlan } = await searchParams;
  const plan = normalizePlanKey(requestedPlan);
  const planQuery = `?plan=${plan}`;
  const destination =
    plan === "free" ? "/dashboard" : `/dashboard/billing${planQuery}`;

  return (
    <AuthFrame
      eyebrow="Welcome back"
      title="Return to your marketing workspace"
      description="Continue your campaigns, brand kit, history, and poster creation."
    >
      <SignIn
        path="/login"
        routing="path"
        signUpUrl={`/signup${planQuery}`}
        fallbackRedirectUrl={destination}
        appearance={{
          variables: {
            colorBackground: "#10121a",
            colorText: "#f8fafc",
            colorTextSecondary: "#94a3b8",
            colorPrimary: "#0891b2",
            colorInputBackground: "#0b0d13",
            colorInputText: "#f8fafc",
          },
          elements: {
            rootBox: "mx-auto w-full",
            cardBox: "mx-auto w-full",
            card: "border border-white/10 shadow-2xl shadow-black/40",
          },
        }}
      />
    </AuthFrame>
  );
}
