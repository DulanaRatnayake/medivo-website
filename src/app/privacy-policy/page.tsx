import type { Metadata } from "next";
import LegalPage, { EmailLink } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Medivo collects, uses and protects the information you provide through the Medivo website.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="September 2026">
      <p>
        We respect your privacy and are committed to protecting the information
        you provide through the Medivo website.
      </p>
      <p>
        We may collect information such as your name, email, phone number,
        address and preorder details to process requests, respond to enquiries
        and improve our services.
      </p>
      <p>
        We do not sell your personal information. Your information may be
        shared with trusted service providers when necessary to operate our
        website and services.
      </p>
      <p>
        We take reasonable measures to protect your information, but no online
        system can be guaranteed to be completely secure.
      </p>
      <p>
        For privacy related questions, contact us at <EmailLink />
      </p>
    </LegalPage>
  );
}
