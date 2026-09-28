import type { Metadata } from "next";
import {
  PageHero,
  FeatureCard,
  PillList,
  HighlightBand,
  PageNav,
} from "@/components/PageSections";

export const metadata: Metadata = {
  title: "Connected Platform",
  description:
    "Medivo extends beyond the physical device through a connected mobile and web platform designed to support medication management.",
};

const features = [
  {
    icon: "🗓️",
    title: "Medication Scheduling",
    text: "Create and manage medication schedules in one place.",
  },
  {
    icon: "📋",
    title: "Medication Records",
    text: "Keep relevant medication information organised and accessible.",
  },
  {
    icon: "📈",
    title: "Adherence Monitoring",
    text: "View recorded medication events and maintain visibility of medication routines.",
  },
  {
    icon: "👪",
    title: "Caregiver Monitoring",
    text: "Authorised caregivers can access relevant medication information to support the user.",
  },
  {
    icon: "🔔",
    title: "Notifications",
    text: "Relevant notifications can be provided based on medication activity and system events.",
  },
  {
    icon: "📄",
    title: "Prescription Storage",
    text: "Store prescription information for easier access when needed.",
  },
  {
    icon: "🕒",
    title: "Medication History",
    text: "Maintain a record of relevant medication activity to support better organisation and visibility.",
  },
];

export default function PlatformPage() {
  return (
    <>
      <PageHero
        eyebrow="Connected Platform"
        title={
          <>
            Your Medication Information,{" "}
            <span className="gradient-text">Connected</span>
          </>
        }
        intro="Medivo extends beyond the physical device through a connected mobile and web platform designed to support medication management."
      />

      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="section-container card-grid">
          {features.map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title}>
              {f.text}
            </FeatureCard>
          ))}
          <FeatureCard icon="🗂️" title="Medical Document Storage">
            Keep important medical documents organised, including:
            <PillList
              items={[
                "ECG Reports",
                "X Ray Reports",
                "Test Reports",
                "Other Important Medical Documents",
              ]}
            />
          </FeatureCard>
        </div>
      </section>

      <HighlightBand
        title="Connected Care, When It Matters"
        action={{ label: "Meet Team Immersion", href: "/team" }}
      >
        Medivo is designed to connect users and authorised caregivers through
        relevant medication information while keeping the focus on simple and
        organised medication management.
      </HighlightBand>

      <PageNav
        prev={{ label: "How It Works", href: "/how-it-works" }}
        next={{ label: "Team Immersion", href: "/team" }}
      />
    </>
  );
}
