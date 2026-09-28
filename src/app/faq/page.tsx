import type { Metadata } from "next";
import { PageHero, HighlightBand, PageNav } from "@/components/PageSections";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description:
    "Answers to common questions about Medivo, its compartments, reminders, adherence tracking, caregiver monitoring and preorders.",
};

const faqs = [
  {
    q: "What is Medivo?",
    a: "Medivo is a smart medication management solution designed to help users organise, remember and manage their daily medications while supporting caregiver monitoring.",
  },
  {
    q: "Who is Medivo designed for?",
    a: "Medivo is designed particularly for elderly individuals, people managing multiple medications and patients who need support maintaining regular medication routines. It can also support family members and caregivers.",
  },
  {
    q: "How many medications can Medivo hold?",
    a: "Medivo has 21 compartments, organised for 7 days and 3 medication times per day: Morning, Afternoon and Night.",
  },
  {
    q: "Does Medivo automatically dispense medication?",
    a: "No. Medivo does not automatically dispense tablets. It uses reminders and LED indicators to guide the user to the required compartment, while the user manually takes the medication.",
  },
  {
    q: "How does Medivo remind users?",
    a: "Medivo uses sound alerts, vibration alerts and LED indicators to notify users when it is time to take their scheduled medication.",
  },
  {
    q: "Can Medivo track medication adherence?",
    a: "Yes. Users can confirm their doses, allowing medication events to be recorded and used to monitor adherence.",
  },
  {
    q: "Can caregivers monitor medication routines?",
    a: "Yes. The connected platform is designed to allow authorised caregivers to view relevant medication schedules, dose confirmations, missed doses, adherence information and alerts.",
  },
  {
    q: "Can I store prescriptions and medical documents?",
    a: "Yes. The connected platform is designed to support storage of prescriptions and important medical documents such as test reports, ECG reports and X ray reports.",
  },
  {
    q: "Does Medivo monitor the storage environment?",
    a: "Yes. Medivo includes temperature and humidity monitoring to help users keep track of the medication storage environment.",
  },
  {
    q: "Is Medivo a replacement for medical advice?",
    a: "No. Medivo is designed to support medication organisation, reminders and adherence monitoring. It does not replace professional medical advice, diagnosis or treatment.",
  },
  {
    q: "Can I preorder Medivo?",
    a: "Yes. You can submit your details through the Preorder section of our website, and our team will contact you with further information.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title={
          <>
            Frequently Asked <span className="gradient-text">Questions</span>
          </>
        }
      />

      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div
          className="section-container"
          style={{
            maxWidth: 820,
            display: "flex",
            flexDirection: "column",
            gap: "0.9rem",
          }}
        >
          {faqs.map((f, i) => (
            <details
              key={f.q}
              className="glass-card faq-item"
              style={{ padding: "1.25rem 1.5rem" }}
              open={i === 0}
            >
              <summary>{f.q}</summary>
              <p className="prose-text" style={{ marginTop: "0.75rem" }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <HighlightBand
        title="Still Have Questions?"
        action={{ label: "Contact Us", href: "/contact" }}
      >
        Get in touch with Team Immersion.
      </HighlightBand>

      <PageNav
        prev={{ label: "Preorder", href: "/preorder" }}
        next={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}
