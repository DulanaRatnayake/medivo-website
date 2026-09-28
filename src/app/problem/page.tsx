import type { Metadata } from "next";
import {
  PageHero,
  FeatureCard,
  HighlightBand,
  PageNav,
} from "@/components/PageSections";

export const metadata: Metadata = {
  title: "The Problem",
  description:
    "Managing medication every day can become difficult, especially for people taking multiple medications or following regular medication schedules.",
};

const challenges = [
  {
    icon: "⏰",
    title: "Forgetting Scheduled Medication",
    text: "Busy routines and daily responsibilities can make it easy to forget when medication needs to be taken.",
  },
  {
    icon: "💊",
    title: "Managing Multiple Medications",
    text: "Different medications may have different schedules, making daily medication organisation more complicated.",
  },
  {
    icon: "📋",
    title: "Maintaining Medication Routines",
    text: "Without a clear system, users may find it difficult to keep track of which doses have been taken and which doses are still pending.",
  },
  {
    icon: "👪",
    title: "Limited Caregiver Visibility",
    text: "Family members and caregivers may not always know whether a scheduled medication has been taken, particularly when they are not physically present.",
  },
  {
    icon: "📁",
    title: "Managing Important Medical Information",
    text: "Prescriptions, reports and other medical documents can be difficult to keep organised and easily accessible.",
  },
];

export default function ProblemPage() {
  return (
    <>
      <PageHero
        eyebrow="The Problem"
        title={
          <>
            Medication Management Can Be{" "}
            <span className="gradient-text">Challenging</span>
          </>
        }
        intro="Managing medication every day can become difficult, especially for people taking multiple medications or following regular medication schedules."
      />

      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="section-container card-grid">
          {challenges.map((c) => (
            <FeatureCard key={c.title} icon={c.icon} title={c.title}>
              {c.text}
            </FeatureCard>
          ))}
        </div>
      </section>

      <HighlightBand
        title="We Asked One Simple Question"
        action={{ label: "Meet Medivo", href: "/solution" }}
      >
        <p style={{ fontStyle: "italic" }}>
          What if medication management could be more organised, connected and
          easier to manage?
        </p>
        <p style={{ marginTop: "1rem", fontWeight: 700, opacity: 1 }}>
          That question led to Medivo.
        </p>
      </HighlightBand>

      <PageNav
        prev={{ label: "About Medivo", href: "/about" }}
        next={{ label: "Our Solution", href: "/solution" }}
      />
    </>
  );
}
