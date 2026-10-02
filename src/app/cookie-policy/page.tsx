import type { Metadata } from "next";
import LegalPage, { EmailLink } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How the Medivo website uses cookies and similar technologies, and how to manage them.",
};

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie Policy" lastUpdated="September 2026">
      <p>
        The Medivo website may use cookies and similar technologies to improve
        website functionality, remember preferences and understand how visitors
        use our website.
      </p>
      <p>Some third party services used on the website may also use cookies.</p>
      <p>
        You can manage or disable cookies through your browser settings.
        Disabling certain cookies may affect website functionality.
      </p>
      <p>
        We may update this Cookie Policy when our website or services change.
      </p>
      <p>
        For questions, contact us at <EmailLink />
      </p>
    </LegalPage>
  );
}
