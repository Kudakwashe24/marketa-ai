import type { Metadata } from "next";
import Link from "next/link";
import PublicInfoPage, { InfoSection } from "@/components/PublicInfoPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Marketa AI collects, uses, stores, and protects account and business information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PublicInfoPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="This policy explains what information Marketa AI handles when you create an account, build a brand kit, or generate marketing content."
      updated="26 September 2026"
    >
      <InfoSection title="Information we collect">
        <p>We may process the following information:</p>
        <ul>
          <li>
            account identifiers and profile information supplied through our
            authentication provider;
          </li>
          <li>
            business profile details, contact information, brand colours,
            logos, and business or product photos you choose to upload;
          </li>
          <li>
            prompts, generated campaigns, poster details, saved history, and
            feature usage;
          </li>
          <li>
            essential technical and security information needed to operate and
            protect the service.
          </li>
        </ul>
      </InfoSection>

      <InfoSection title="How we use information">
        <p>
          We use this information to authenticate your account, personalise
          campaigns to your business, generate requested content, save your
          history and brand assets, enforce plan limits, improve reliability,
          prevent abuse, and respond to support requests.
        </p>
      </InfoSection>

      <InfoSection title="AI processing and service providers">
        <p>
          Marketa uses third-party services to operate. These currently include
          Clerk for authentication, Supabase for database and file storage,
          Google Gemini for AI text generation and image understanding, and
          Vercel for application hosting. Prompts and selected business details
          or images may be sent to the AI provider when required to fulfil your
          request. Those providers process data under their own terms and
          privacy commitments.
        </p>
      </InfoSection>

      <InfoSection title="Storage, retention, and deletion">
        <p>
          We retain account data, business profiles, uploaded assets, usage
          records, and campaign history while they are needed to provide the
          service or meet legal and security requirements. You can remove brand
          assets and eligible history inside the product. For an account or
          data-deletion request, contact us through the{" "}
          <Link href="/support">support page</Link>.
        </p>
      </InfoSection>

      <InfoSection title="Security and international processing">
        <p>
          We use reasonable technical and organisational safeguards, but no
          internet service can guarantee absolute security. Our providers may
          process information in countries other than your own, subject to the
          safeguards and terms they make available.
        </p>
      </InfoSection>

      <InfoSection title="Your choices">
        <p>
          You may update your business profile, remove uploaded assets, delete
          eligible campaign history, or request access, correction, or deletion
          of personal information. Do not upload confidential information,
          special-category personal data, or material you do not have permission
          to use.
        </p>
      </InfoSection>

      <InfoSection title="Children and changes">
        <p>
          Marketa AI is intended for business users and is not directed to
          children under 18. We may update this policy as the product and legal
          requirements change. Material updates will be reflected by the date
          shown above.
        </p>
      </InfoSection>

      <InfoSection title="Contact">
        <p>
          Privacy questions and requests can be submitted through our{" "}
          <Link href="/support">support page</Link>.
        </p>
      </InfoSection>
    </PublicInfoPage>
  );
}
