import type { Metadata } from "next";
import {
  PageHero,
  SectionHeading,
  FeatureCard,
  PillList,
  HighlightBand,
  PageNav,
} from "@/components/PageSections";

export const metadata: Metadata = {
  title: "Our Solution",
  description:
    "Medivo brings medication organisation, reminders, dose confirmation and monitoring together in one connected system.",
};

export default function SolutionPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Solution"
        title={
          <>
            Meet <span className="gradient-text">Medivo</span>
          </>
        }
        intro="Medivo is a smart medication management solution designed to bring medication organisation, reminders, dose confirmation and monitoring together in one connected system."
      />

      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="section-container card-grid card-grid--3">
          <FeatureCard icon="🗂️" title="Medication Organisation">
            Medivo provides 21 medication compartments, organised around a 7
            day medication schedule with three medication times per day:
            <PillList items={["Morning", "Afternoon", "Night"]} />
          </FeatureCard>
          <FeatureCard icon="🔔" title="Smart Reminders">
            Medivo uses multiple reminder methods to help users recognise
            scheduled medication times.
            <PillList
              items={["Sound Alerts", "Vibration Alerts", "LED Indicators"]}
            />
          </FeatureCard>
          <FeatureCard icon="🔒" title="Controlled Access">
            A master locking mechanism provides controlled access to the
            medication compartments.
          </FeatureCard>
          <FeatureCard icon="✅" title="Dose Confirmation">
            After taking the scheduled medication, the user can confirm the
            dose. This allows the medication event to be recorded.
          </FeatureCard>
          <FeatureCard icon="📈" title="Adherence Monitoring">
            Recorded medication events can help users and authorised caregivers
            maintain visibility of medication routines.
          </FeatureCard>
          <FeatureCard icon="🤝" title="Connected Care">
            The connected platform is designed to provide authorised caregivers
            with relevant medication information, including schedules, dose
            confirmations and missed dose information.
          </FeatureCard>
        </div>
      </section>

      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="section-container" style={{ textAlign: "center" }}>
          <SectionHeading
            title="A Connected Approach to Medication Management"
            subtitle="Medivo combines:"
          />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PillList
              items={[
                "Organisation",
                "Reminders",
                "Controlled Access",
                "Dose Confirmation",
                "Adherence Monitoring",
                "Caregiver Connectivity",
              ]}
            />
          </div>
        </div>
      </section>

      <HighlightBand
        title={<span className="gradient-text">All in one solution.</span>}
        action={{ label: "Explore Product & Features", href: "/product" }}
      />

      <PageNav
        prev={{ label: "The Problem", href: "/problem" }}
        next={{ label: "Product & Features", href: "/product" }}
      />
    </>
  );
}
