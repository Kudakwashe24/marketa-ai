import type { Metadata } from "next";
import Link from "next/link";
import PublicInfoPage, { InfoSection } from "@/components/PublicInfoPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when using Marketa AI.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <PublicInfoPage
      eyebrow="Legal"
      title="Terms of Service"
      description="These terms govern access to Marketa AI and the campaigns, copy, and template-based posters created through the service."
      updated="26 September 2026"
    >
      <InfoSection title="Using Marketa AI">
        <p>
          You must be at least 18 and able to enter into a binding agreement.
          You are responsible for your account, the accuracy of information you
          provide, and all activity performed through your account. Keep your
          sign-in method secure and notify us if you suspect unauthorised use.
        </p>
      </InfoSection>

      <InfoSection title="Your content and permissions">
        <p>
          You retain ownership of business information, prompts, logos, photos,
          and other material you submit. You grant Marketa AI and its service
          providers a limited permission to host, process, reproduce, and
          transform that material only as needed to operate, secure, and improve
          the service. You must have the rights and permissions required for
          everything you upload.
        </p>
      </InfoSection>

      <InfoSection title="AI output and your responsibility">
        <p>
          AI-generated content may be inaccurate, incomplete, repetitive, or
          unsuitable for your audience. You must review all claims, prices,
          names, contact details, legal requirements, and intellectual-property
          issues before publishing. Marketa AI does not provide legal,
          financial, medical, or professional advice and does not guarantee
          marketing performance or business results.
        </p>
      </InfoSection>

      <InfoSection title="Plans, limits, and payments">
        <p>
          Free and paid plans may have monthly limits described on the pricing
          page. Usage resets on the schedule shown in the product. Paid checkout
          is not active during the founder beta, so selecting a paid plan does
          not create a subscription or charge a payment method. Before billing
          begins, checkout will display the price, billing interval, renewal,
          cancellation, and refund terms that apply.
        </p>
      </InfoSection>

      <InfoSection title="Acceptable use">
        <p>
          You must comply with our{" "}
          <Link href="/acceptable-use">Acceptable Use Policy</Link>. We may
          restrict or suspend access when necessary to protect users, providers,
          or the service; investigate suspected misuse; comply with law; or
          enforce these terms.
        </p>
      </InfoSection>

      <InfoSection title="Service availability and changes">
        <p>
          Marketa AI is currently a founder-beta product. Features may change,
          experience interruptions, or be limited while we improve reliability
          and safety. We may add, modify, or remove features and plan limits, and
          we will provide reasonable notice when a change materially affects an
          active paid subscription.
        </p>
      </InfoSection>

      <InfoSection title="Disclaimer and liability">
        <p>
          To the extent permitted by law, the service is provided “as is” and
          “as available” without warranties of uninterrupted operation,
          merchantability, fitness for a particular purpose, or non-infringement.
          Marketa AI is not liable for indirect, incidental, special,
          consequential, or lost-profit damages arising from use of the service.
          Rights that cannot legally be excluded remain unaffected.
        </p>
      </InfoSection>

      <InfoSection title="Governing terms and contact">
        <p>
          These terms are governed by the laws of South Africa, without regard
          to conflict-of-law rules. If any part is unenforceable, the remaining
          terms continue to apply. Questions can be submitted through the{" "}
          <Link href="/support">support page</Link>.
        </p>
      </InfoSection>
    </PublicInfoPage>
  );
}
