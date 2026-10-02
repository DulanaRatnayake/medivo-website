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
  title: "Product & Features",
  description:
    "21 medication compartments, smart reminders, LED indicators, a master locking mechanism, dose confirmation and more.",
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const times = ["Morning", "Afternoon", "Night"];

const features = [
  {
    icon: "🔔",
    title: "Smart Reminder System",
    text: "Medivo provides multiple reminder methods to help users recognise scheduled medication times.",
    pills: ["Sound", "Vibration", "LED Light"],
  },
  {
    icon: "💡",
    title: "LED Medication Indicators",
    text: "LED indicators help guide the user towards the relevant medication compartment when a scheduled dose is due.",
  },
  {
    icon: "🔒",
    title: "Master Locking Mechanism",
    text: "The main medication compartment system includes a master locking mechanism designed to provide controlled access.",
  },
  {
    icon: "✅",
    title: "Dose Confirmation",
    text: "Users can confirm that they have taken their scheduled medication, allowing the event to be recorded within the system.",
  },
  {
    icon: "📈",
    title: "Medication Adherence Tracking",
    text: "Medication events can be recorded to help users maintain visibility of their medication routines and support caregiver monitoring.",
  },
  {
    icon: "🌡️",
    title: "Temperature and Humidity Monitoring",
    text: "Medivo monitors temperature and humidity within the device environment, allowing users to keep track of storage conditions.",
  },
  {
    icon: "🖥️",
    title: "Display Interface",
    text: "A display interface provides information and supports interaction with the medication management system.",
  },
  {
    icon: "🎒",
    title: "Portable Design",
    text: "Medivo is designed as a portable medication management solution that can be used as part of a user's everyday routine.",
  },
];

export default function ProductPage() {
  return (
    <>
      <PageHero
        eyebrow="Product & Features"
        title={
          <>
            <span className="gradient-text">21</span> Medication Compartments
          </>
        }
        intro="Medivo is designed with 21 medication compartments."
      />

      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="section-container two-col">
          <div
            className="glass-card"
            style={{ padding: "clamp(1rem, 4vw, 1.5rem)" }}
            aria-label="7 days by 3 medication times"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto repeat(7, 1fr)",
                gap: "clamp(0.2rem, 1vw, 0.4rem)",
                fontSize: "clamp(0.62rem, 2.2vw, 0.75rem)",
                fontWeight: 700,
              }}
            >
              <span />
              {days.map((d) => (
                <span key={d} style={{ textAlign: "center", opacity: 0.6 }}>
                  {d}
                </span>
              ))}
              {times.map((t, row) => (
                <div key={t} style={{ display: "contents" }}>
                  <span
                    style={{
                      alignSelf: "center",
                      paddingRight: "0.35rem",
                      opacity: 0.6,
                    }}
                  >
                    {t}
                  </span>
                  {days.map((d) => (
                    <span
                      key={d}
                      style={{
                        aspectRatio: "1",
                        borderRadius: "0.6rem",
                        background: [
                          "rgba(2,169,231,0.18)",
                          "rgba(11,206,183,0.2)",
                          "rgba(3,108,173,0.2)",
                        ][row],
                        border: "1px solid rgba(2,169,231,0.3)",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.3rem, 3vw, 1.75rem)",
                fontWeight: 800,
                marginBottom: "1rem",
              }}
            >
              7 Days × 3 Medication Times ={" "}
              <br />
              <span className="gradient-text">21 Compartments</span>
            </p>
            <p className="prose-text">Each day is organised into:</p>
            <PillList items={times} />
            <p className="prose-text" style={{ marginTop: "1.25rem" }}>
              Small separators can also be used to further divide compartments
              when required.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="section-container">
          <SectionHeading title="Features" />
          <div className="card-grid">
            {features.map((f) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title}>
                {f.text}
                {f.pills && <PillList items={f.pills} />}
              </FeatureCard>
            ))}
          </div>
        </div>
      </section>

      <HighlightBand
        title="See Medivo in Action"
        action={{ label: "How It Works", href: "/how-it-works" }}
      />

      <PageNav
        prev={{ label: "Our Solution", href: "/solution" }}
        next={{ label: "How It Works", href: "/how-it-works" }}
      />
    </>
  );
}
