import type { Metadata } from "next";
import { statSync } from "node:fs";
import path from "node:path";
import {
  PageHero,
  SectionHeading,
  HighlightBand,
  PageNav,
} from "@/components/PageSections";
import { USER_MANUAL_FILENAME, USER_MANUAL_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "User Manual",
  description:
    "Download the Medivo user manual: how to set up, use, maintain and safely store your Medivo smart medication management system.",
};

// Read at build time so the size shown always matches the file in /public.
const fileSizeKb = Math.round(
  statSync(path.join(process.cwd(), "public", USER_MANUAL_URL)).size / 1024
);

const contents = [
  "About Medivo",
  "What's Included",
  "Getting Started",
  "Setting Up a Medication Schedule",
  "Loading Medication",
  "Taking Medication",
  "Additional Storage Areas",
  "Using the Digital Interface",
  "Cleaning & Maintenance",
  "Safety Instructions",
  "Troubleshooting",
  "Storage",
  "Quick Start Checklist",
  "Support & Product Information",
  "Disclaimer",
];

const quickStart = [
  "Charge / power Medivo",
  "Turn on the device",
  "Open the digital interface",
  "Enter patient and medication details",
  "Set the prescribed schedule",
  "Load each medication into the correct compartment",
  "Check the schedule and compartment contents",
  "Keep Medivo in a safe, dry location",
];

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

export default function UserManualPage() {
  return (
    <>
      <PageHero
        eyebrow="User Manual"
        title={
          <>
            Medivo <span className="gradient-text">User Manual</span>
          </>
        }
        intro="This manual explains how to set up, use, maintain, and safely store your Medivo smart medication management system. Please read this manual before using Medivo for the first time."
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "2rem",
          }}
        >
          <a
            href={USER_MANUAL_URL}
            download={USER_MANUAL_FILENAME}
            className="btn-primary btn-gradient"
          >
            <DownloadIcon />
            Download PDF
          </a>
          <a
            href={USER_MANUAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            Read Online
          </a>
        </div>
        <p style={{ marginTop: "1rem", fontSize: "0.85rem", opacity: 0.6 }}>
          PDF · {fileSizeKb} KB
        </p>
      </PageHero>

      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="section-container two-col" style={{ alignItems: "start" }}>
          <div>
            <SectionHeading title="What's Inside" align="left" />
            <ol
              className="glass-card"
              style={{
                listStyle: "none",
                padding: "clamp(1.25rem, 4vw, 1.75rem)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
                gap: "0.75rem 1.5rem",
              }}
            >
              {contents.map((item, i) => (
                <li
                  key={item}
                  style={{ display: "flex", gap: "0.75rem", alignItems: "baseline" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      color: "var(--color-primary)",
                      minWidth: "1.5rem",
                    }}
                  >
                    {i + 1}.
                  </span>
                  <span style={{ fontWeight: 500 }}>{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <SectionHeading title="Quick Start Checklist" align="left" />
            <ul
              className="glass-card"
              style={{
                listStyle: "none",
                padding: "clamp(1.25rem, 4vw, 1.75rem)",
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
              }}
            >
              {quickStart.map((item) => (
                <li
                  key={item}
                  style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
                >
                  <span
                    aria-hidden
                    style={{
                      flexShrink: 0,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #02A9E7, #0BCEB7)",
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✓
                  </span>
                  <span style={{ fontWeight: 500 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <HighlightBand
        title="Important"
        action={{ label: "Contact Us", href: "/contact" }}
      >
        Medivo can help with medication organisation and reminders, but it does
        not replace a doctor, pharmacist, caregiver, or prescribed medical
        instructions.
      </HighlightBand>

      <PageNav
        prev={{ label: "FAQ", href: "/faq" }}
        next={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}
