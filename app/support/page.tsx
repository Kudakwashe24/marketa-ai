import type { Metadata } from "next";
import Link from "next/link";
import PublicInfoPage, { InfoSection } from "@/components/PublicInfoPage";

export const metadata: Metadata = {
  title: "Support",
  description: "Get founder-beta help with Marketa AI.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim();

  return (
    <PublicInfoPage
      eyebrow="Help"
      title="Marketa AI Support"
      description="Get help with your account, business profile, generated campaigns, posters, or a privacy request."
    >
      <InfoSection title="Founder-beta support">
        <p>
          {supportEmail ? (
            <>
              Email us at{" "}
              <a href={`mailto:${supportEmail}`}>{supportEmail}</a>. Include a
              short description of what happened and the page you were using.
            </>
          ) : (
            <>
              Message{" "}
              <a
                href="https://www.instagram.com/__marketa_ai/"
                target="_blank"
                rel="noreferrer"
              >
                @__marketa_ai on Instagram
              </a>{" "}
              for founder-beta support. Please do not send passwords, API keys,
              card details, or one-time verification codes.
            </>
          )}
        </p>
      </InfoSection>

      <InfoSection title="Before contacting us">
        <ul>
          <li>Refresh the page once and try the action again.</li>
          <li>Check that your business profile has been saved.</li>
          <li>
            Confirm that uploaded images are PNG, JPG, or WebP and smaller than
            5 MB.
          </li>
          <li>
            Never include secret keys or verification codes in a support message.
          </li>
        </ul>
      </InfoSection>

      <InfoSection title="Privacy and account requests">
        <p>
          For data access, correction, or deletion requests, identify the email
          address connected to your account without including your password. See
          our <Link href="/privacy">Privacy Policy</Link> for more information.
        </p>
      </InfoSection>
    </PublicInfoPage>
  );
}
