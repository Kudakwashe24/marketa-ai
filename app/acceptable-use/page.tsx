import type { Metadata } from "next";
import Link from "next/link";
import PublicInfoPage, { InfoSection } from "@/components/PublicInfoPage";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description: "Rules for safe and responsible use of Marketa AI.",
  alternates: { canonical: "/acceptable-use" },
};

export default function AcceptableUsePage() {
  return (
    <PublicInfoPage
      eyebrow="Trust and safety"
      title="Acceptable Use Policy"
      description="Use Marketa AI to market legitimate businesses responsibly. The following uses are not permitted."
      updated="26 September 2026"
    >
      <InfoSection title="Illegal, harmful, or deceptive activity">
        <ul>
          <li>Content that facilitates crime, fraud, scams, or evasion of law.</li>
          <li>
            Deceptive claims, fabricated testimonials, impersonation, phishing,
            spam, or misleading promotions.
          </li>
          <li>
            Harassment, hate, threats, exploitation, or content that puts a
            person or community at risk.
          </li>
        </ul>
      </InfoSection>

      <InfoSection title="Rights, privacy, and sensitive information">
        <ul>
          <li>
            Do not upload material you do not own or have permission to use.
          </li>
          <li>
            Do not submit passwords, financial account details, government
            identifiers, health records, or other highly sensitive information.
          </li>
          <li>
            Do not use personal data for unlawful surveillance, discrimination,
            or targeting.
          </li>
        </ul>
      </InfoSection>

      <InfoSection title="Platform abuse">
        <ul>
          <li>
            Do not bypass usage limits, interfere with security, probe the
            service for vulnerabilities, or automate abusive traffic.
          </li>
          <li>
            Do not distribute malware or use Marketa AI to disrupt another
            service.
          </li>
          <li>
            Do not resell account access or misrepresent AI output as verified
            professional advice.
          </li>
        </ul>
      </InfoSection>

      <InfoSection title="Enforcement and reporting">
        <p>
          We may remove content, limit generation, suspend accounts, preserve
          relevant records, or report conduct when reasonably necessary to
          protect the service, users, providers, or the public. To report misuse,
          use our <Link href="/support">support page</Link>.
        </p>
      </InfoSection>
    </PublicInfoPage>
  );
}
