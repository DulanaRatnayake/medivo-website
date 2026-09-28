import type { Metadata } from "next";
import {
  PageHero,
  PillList,
  HighlightBand,
  PageNav,
} from "@/components/PageSections";

export const metadata: Metadata = {
  title: "About Medivo",
  description:
    "Medivo is a smart medication management solution developed as a university product development project by Team Immersion.",
};

const combines = [
  "Organised Medication Storage",
  "Timely Reminders",
  "Controlled Access",
  "Dose Confirmation",
  "Adherence Monitoring",
  "Caregiver Connectivity",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Medivo"
        title={
          <>
            Making Medication Management{" "}
            <span className="gradient-text">Simpler</span>
          </>
        }
        intro="Medivo was created with a simple idea: medication management should be easier, more organised and more connected."
      />

      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="section-container two-col" style={{ alignItems: "start" }}>
          <div>
            <p className="prose-text">
              Medivo is a smart medication management solution developed as a
              university product development project by{" "}
              <strong>Team Immersion</strong>, a team of Business Economics
              undergraduates.
            </p>
            <p className="prose-text">
              Through our project, we identified the everyday challenges faced
              by people managing medications and the difficulties caregivers
              can experience when supporting them.
            </p>
            <p className="prose-text">
              Medivo is designed to support users in managing their daily
              medication routines while providing authorised caregivers with
              relevant information when support is needed.
            </p>
          </div>
          <div className="glass-card" style={{ padding: "2rem" }}>
            <p className="prose-text" style={{ opacity: 0.85 }}>
              This led us to develop Medivo, a solution that combines:
            </p>
            <PillList items={combines} />
          </div>
        </div>
      </section>

      <HighlightBand
        title="Why Medivo?"
        action={{ label: "See the Problem", href: "/problem" }}
      >
        <p>
          Medication management involves more than simply taking a tablet. It
          can involve remembering schedules, organising different medications,
          keeping track of doses and maintaining important medication
          information.
        </p>
        <p style={{ marginTop: "1rem", fontWeight: 700, opacity: 1 }}>
          Medivo brings these elements together into one connected solution.
        </p>
      </HighlightBand>

      <PageNav
        prev={{ label: "Home", href: "/" }}
        next={{ label: "The Problem", href: "/problem" }}
      />
    </>
  );
}
