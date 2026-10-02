import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, HighlightBand, PageNav } from "@/components/PageSections";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Set your schedule, organise your medication, get reminded, take and confirm, and stay connected.",
};

const steps = [
  {
    icon: "🗓️",
    title: "Set Your Schedule",
    text: "Add medication schedules to the system.",
  },
  {
    icon: "💊",
    title: "Organise Your Medication",
    text: "Place medications into the designated compartments.",
  },
  {
    icon: "🔔",
    title: "Get Reminded",
    text: "Medivo provides visual, sound and vibration reminders.",
  },
  {
    icon: "✅",
    title: "Take & Confirm",
    text: "Take the scheduled medication and confirm the dose.",
  },
  {
    icon: "📱",
    title: "Stay Connected",
    text: "Medication activity can be monitored through the connected platform.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How It Works"
        title={
          <>
            Five Simple <span className="gradient-text">Steps</span>
          </>
        }
      />

      <section className="section-padding" style={{ paddingTop: 0 }}>
        <ol
          className="section-container"
          style={{
            listStyle: "none",
            maxWidth: 760,
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="glass-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(0.9rem, 3vw, 1.25rem)",
                padding: "clamp(1.1rem, 4vw, 1.5rem) clamp(1.1rem, 4vw, 1.75rem)",
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #02A9E7, #0BCEB7)",
                  color: "#fff",
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "1.3rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </span>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: "1.2rem", marginBottom: "0.25rem" }}>
                  {step.title}
                </h2>
                <p style={{ opacity: 0.75 }}>{step.text}</p>
              </div>
              <span aria-hidden className="step-emoji" style={{ fontSize: "1.6rem" }}>
                {step.icon}
              </span>
            </li>
          ))}
        </ol>

        {/* Link to the full instructions */}
        <div className="section-container" style={{ maxWidth: 760 }}>
          <div className="glass-card manual-link">
            <span className="icon-badge" style={{ margin: 0, flexShrink: 0 }} aria-hidden>
              📘
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: "1.2rem", marginBottom: "0.25rem" }}>
                Need the full instructions?
              </h2>
              <p style={{ opacity: 0.75 }}>
                The user manual explains how to set up, use, maintain and
                safely store your Medivo.
              </p>
            </div>
            <Link href="/user-manual" className="btn-primary btn-gradient">
              View User Manual
            </Link>
          </div>
        </div>
      </section>

      <HighlightBand
        title="Stay Connected Beyond the Device"
        action={{ label: "Explore the Connected Platform", href: "/platform" }}
      />

      <PageNav
        prev={{ label: "Product & Features", href: "/product" }}
        next={{ label: "Connected Platform", href: "/platform" }}
      />
    </>
  );
}
