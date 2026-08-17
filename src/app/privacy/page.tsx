import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How easymail collects, uses, protects, and retains personal and email-delivery data.",
};

const sections: LegalSection[] = [
  {
    title: "1. Information we collect",
    paragraphs: [
      "We collect information you provide when creating or managing an account, including your name, Gmail address, workspace details, and security preferences.",
    ],
    items: [
      "Account, authentication, and consent records.",
      "Encrypted SMTP configuration details and sender metadata.",
      "Email request metadata, delivery status, API-key identifiers, audit logs, device information, and IP address.",
      "Support messages and other information you choose to provide.",
    ],
  },
  {
    title: "2. Email content and credentials",
    paragraphs: [
      "Email recipients, subject lines, bodies, attachments, CC addresses, and related request data are processed only to provide the delivery service, troubleshoot failures, protect the platform, and meet legal obligations. SMTP passwords are encrypted at rest and are not displayed after they are saved.",
    ],
  },
  {
    title: "3. How we use information",
    paragraphs: [
      "We use information to operate and secure the service, authenticate users, route email through configured senders, provide delivery records, prevent abuse, communicate security events, improve reliability, and comply with law.",
    ],
  },
  {
    title: "4. Legal bases and consent",
    paragraphs: [
      "Where applicable, processing is based on performance of our agreement, legitimate interests in operating a secure service, compliance with legal obligations, and consent. Your acceptance of this policy and the Terms is recorded with the applicable document version and time.",
    ],
  },
  {
    title: "5. Sharing and service providers",
    paragraphs: [
      "We do not sell personal information. We may share limited data with infrastructure, database, hosting, monitoring, and email providers that process it on our behalf, or when disclosure is required by law, necessary to protect rights and safety, or part of a business transaction.",
    ],
  },
  {
    title: "6. Retention",
    paragraphs: [
      "We retain account and operational data only as long as needed to provide the service, maintain security and audit records, resolve disputes, and satisfy legal requirements. Backup copies may remain for a limited period after deletion.",
    ],
  },
  {
    title: "7. Security",
    paragraphs: [
      "We use access controls, encryption, rotating API keys, audit logs, rate limits, and authentication safeguards. No system is completely secure; you are responsible for protecting account credentials, Gmail app passwords, and API keys.",
    ],
  },
  {
    title: "8. Your choices and rights",
    paragraphs: [
      "Subject to applicable law, you may request access, correction, export, restriction, objection, or deletion of personal information. You may also close your account. Some records may be retained where legally required or necessary for security.",
    ],
  },
  {
    title: "9. International processing and children",
    paragraphs: [
      "Service providers may process data in countries other than yours, subject to appropriate safeguards. The service is not directed to children under 18, and we do not knowingly collect their personal information.",
    ],
  },
  {
    title: "10. Changes and contact",
    paragraphs: [
      "We may update this policy and will identify the effective date. Material changes may require renewed acceptance. Questions or privacy requests can be sent to privacy@almareem.com.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      summary="This policy explains how easymail handles information when you use its reusable SMTP and email-delivery platform."
      sections={sections}
    />
  );
}
