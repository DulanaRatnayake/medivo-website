import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when using the Medivo website.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="September 2026">
      <p>
        By using the Medivo website, you agree to use it lawfully and
        responsibly.
      </p>
      <p>
        Medivo is a university product development project by Team Immersion.
        Product information, features and availability may change as
        development continues.
      </p>
      <p>
        Submitting a preorder request does not guarantee product availability,
        pricing or delivery.
      </p>
      <p>
        Medivo is designed to support medication organisation, reminders and
        adherence monitoring. It does not replace professional medical advice,
        diagnosis or treatment.
      </p>
      <p>
        All Medivo content, branding and product materials may not be
        reproduced or commercially used without permission.
      </p>
    </LegalPage>
  );
}
