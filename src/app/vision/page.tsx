import type { Metadata } from "next";
import {
  PageHero,
  SectionHeading,
  FeatureCard,
  HighlightBand,
  PageNav,
} from "@/components/PageSections";

export const metadata: Metadata = {
  title: "Vision & Mission",
  description:
    "Our vision: a future where medication management is simpler, safer and connected. Our mission: to make medication management smarter, simpler and more accessible through technology.",
};

const values = [
  {
    icon: "❤️",
    title: "Care",
    text: "We put patients and the people who care for them at the centre of what we do.",
  },
  {
    icon: "✨",
    title: "Simplicity",
    text: "We believe technology should make everyday medication management easier, not more complicated.",
  },
  {
    icon: "🛡️",
    title: "Safety",
    text: "We focus on helping users manage their medication routines in a more organised and controlled way.",
  },
  {
    icon: "💡",
    title: "Innovation",
    text: "We continuously explore new approaches to improve medication management.",
  },
  {
    icon: "🌍",
    title: "Accessibility",
    text: "We aim to develop practical solutions that can be useful for a wide range of users.",
  },
  {
    icon: "🤝",
    title: "Trust",
    text: "We aim to build reliable products and meaningful relationships with the people who use and support our solutions.",
  },
];

export default function VisionPage() {
  return (
    <>
      <PageHero
        eyebrow="Vision, Mission & Values"
        title={
          <>
            Simpler, Safer and <span className="gradient-text">Connected</span>
          </>
        }
      />

      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="section-container two-col" style={{ alignItems: "stretch" }}>
          <div className="glass-card" style={{ padding: "2.25rem" }}>
            <div className="eyebrow">Our Vision</div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              A future where medication management is simpler, safer and
              connected.
            </h2>
            <p className="prose-text">
              We envision a future where patients can manage their medication
              routines with greater confidence and independence, while
              caregivers can stay connected and informed when support is
              needed.
            </p>
          </div>
          <div className="glass-card" style={{ padding: "2.25rem" }}>
            <div className="eyebrow">Our Mission</div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              To make medication management smarter, simpler and more
              accessible through technology.
            </h2>
            <p className="prose-text">
              We aim to develop practical and user focused solutions that help
              people organise their medications, remember scheduled doses and
              maintain better visibility of their medication routines.
            </p>
            <p className="prose-text">
              Through continuous product development and innovation, we strive
              to create a more organised and supportive medication management
              experience.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="section-container">
          <SectionHeading title="Our Values" />
          <div className="card-grid">
            {values.map((v) => (
              <FeatureCard key={v.title} icon={v.icon} title={v.title}>
                {v.text}
              </FeatureCard>
            ))}
          </div>
        </div>
      </section>

      <HighlightBand
        title="Be among the first to experience Medivo."
        action={{ label: "Preorder Now", href: "/preorder" }}
      />

      <PageNav
        prev={{ label: "Team Immersion", href: "/team" }}
        next={{ label: "Preorder", href: "/preorder" }}
      />
    </>
  );
}
