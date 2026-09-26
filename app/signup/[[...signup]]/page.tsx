import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import AuthFrame from "@/components/AuthFrame";
import {
  normalizePlanKey,
  PLAN_CONFIGS,
  PLAN_MONTHLY_PRICES,
} from "@/lib/plans";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Create your Marketa AI marketing workspace.",
  robots: { index: false, follow: false },
};

type SignupPageProps = {
  searchParams: Promise<{ plan?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { plan: requestedPlan } = await searchParams;
  const plan = normalizePlanKey(requestedPlan);
  const planQuery = `?plan=${plan}`;
  const destination =
    plan === "free" ? "/dashboard" : `/dashboard/billing${planQuery}`;
  const selectedPlan = PLAN_CONFIGS[plan];
  const selectedPrice = PLAN_MONTHLY_PRICES[plan];

  return (
    <AuthFrame
      eyebrow={`${selectedPlan.name} selected`}
      title={
        plan === "free"
          ? "Build your first campaign free"
          : `Create your account for $${selectedPrice}/month`
      }
      description={
        plan === "free"
          ? "No card required. Add your business once, then create brand-aware marketing content."
          : "Your plan choice will follow you into the workspace. Paid checkout is not active during founder beta, so you will not be charged yet."
      }
    >
      <SignUp
        path="/signup"
        routing="path"
        signInUrl={`/login${planQuery}`}
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
