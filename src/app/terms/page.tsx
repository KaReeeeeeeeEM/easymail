import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "The terms governing access to and use of the easymail email-delivery platform.",
};

const sections: LegalSection[] = [
  {
    title: "1. Agreement",
    paragraphs: [
      "These Terms govern your access to easymail. By creating an account, accepting an invitation, or using the service, you agree to these Terms and acknowledge the Privacy Policy. If you act for an organization, you confirm that you can bind it.",
    ],
  },
  {
    title: "2. Eligibility and accounts",
    paragraphs: [
      "You must be at least 18 and provide accurate information. Accounts currently require a valid Gmail address. You are responsible for account activity, credentials, API keys, configured senders, and promptly reporting unauthorized use.",
    ],
  },
  {
    title: "3. The service",
    paragraphs: [
      "easymail lets authorized users connect SMTP senders and submit email through an HTTPS API. Delivery depends on third-party SMTP providers and recipient systems; acceptance by an SMTP server does not guarantee inbox placement.",
    ],
  },
  {
    title: "4. Your responsibilities",
    paragraphs: [
      "You must have authority to use every sender, recipient address, attachment, and item of content submitted through the service.",
    ],
    items: [
      "Comply with privacy, marketing, anti-spam, export, and communications laws.",
      "Obtain required consent and provide legally required unsubscribe mechanisms.",
      "Keep credentials and keys confidential and rotate compromised secrets promptly.",
      "Maintain accurate sender identity and avoid deceptive routing or headers.",
    ],
  },
  {
    title: "5. Prohibited use",
    paragraphs: [
      "You may not use the service for unsolicited bulk email, phishing, malware, fraud, impersonation, harassment, unlawful content, credential collection, security testing without permission, interference with the service, or circumvention of usage and rate limits.",
    ],
  },
  {
    title: "6. Content and licenses",
    paragraphs: [
      "You retain ownership of content you submit. You grant us a limited license to process that content solely to operate, secure, support, and improve the service and satisfy legal obligations. You represent that your content and use do not violate third-party rights.",
    ],
  },
  {
    title: "7. Availability and changes",
    paragraphs: [
      "We may change, suspend, or discontinue features and may apply reasonable limits to protect security and reliability. We do not promise uninterrupted or error-free availability. Beta or preview features may change without notice.",
    ],
  },
  {
    title: "8. Suspension and termination",
    paragraphs: [
      "We may restrict or terminate access for violations, security risk, unlawful activity, non-payment where applicable, or material harm to the service or others. You may stop using the service at any time. Terms that by nature should survive will remain effective.",
    ],
  },
  {
    title: "9. Disclaimers and liability",
    paragraphs: [
      "The service is provided on an “as is” and “as available” basis to the extent permitted by law. We disclaim implied warranties and are not liable for indirect, incidental, special, consequential, or punitive damages, lost profits, lost data, provider decisions, or email deliverability. Any aggregate liability is limited to amounts paid for the service during the preceding twelve months, unless law requires otherwise.",
    ],
  },
  {
    title: "10. Indemnity",
    paragraphs: [
      "To the extent permitted by law, you will defend and indemnify easymail and its operators from claims arising from your content, recipients, sender configurations, violation of these Terms, or infringement of another party’s rights.",
    ],
  },
  {
    title: "11. Governing terms and contact",
    paragraphs: [
      "If any provision is unenforceable, the remaining provisions continue. Failure to enforce a provision is not a waiver. We may update these Terms and identify a new effective date; material changes may require renewed acceptance. Questions can be sent to legal@almareem.com.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      summary="These Terms define the rules and responsibilities that apply when you create an account, accept an invitation, or send email through easymail."
      sections={sections}
    />
  );
}
