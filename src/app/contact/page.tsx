import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, PageNav } from "@/components/PageSections";
import { socialLinks, SocialIcon, externalProps } from "@/components/SocialIcons";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Have a question about Medivo, our product development project or preorders? Get in touch with Team Immersion.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title={
          <>
            We&apos;d Love to Hear{" "}
            <span className="gradient-text">From You</span>
          </>
        }
        intro="Have a question about Medivo, our product development project or preorders? Get in touch with Team Immersion."
      />

      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="section-container two-col" style={{ alignItems: "stretch" }}>
          <div
            className="glass-card"
            style={{
              padding: "2.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              background:
                "linear-gradient(135deg, rgba(2,169,231,0.1), rgba(11,206,183,0.12))",
            }}
          >
            <Image
              src="/logo.png"
              alt="Medivo"
              width={200}
              height={74}
              style={{ height: 64, width: "auto", objectFit: "contain" }}
            />
            <p
              style={{
                marginTop: "1rem",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.2rem",
              }}
            >
              Because Every Dose Matters.
            </p>
          </div>

          <div className="glass-card" style={{ padding: "clamp(1.25rem, 5vw, 2rem)" }}>
            <h2 style={{ fontSize: "1.4rem", marginBottom: "1.25rem" }}>
              Contact
            </h2>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {socialLinks.map((c) => (
                <li
                  key={c.key}
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <span
                    className="icon-badge"
                    style={{ margin: 0, color: "var(--color-deep)" }}
                  >
                    <SocialIcon name={c.key} size={22} />
                  </span>
                  <div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, opacity: 0.55 }}>
                      {c.label}
                    </div>
                    <a
                      href={c.href}
                      style={{
                        fontWeight: 600,
                        fontSize: "clamp(0.9rem, 3.8vw, 1rem)",
                        overflowWrap: "anywhere",
                      }}
                      {...externalProps(c.href)}
                    >
                      {c.handle}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <PageNav prev={{ label: "User Manual", href: "/user-manual" }} />
    </>
  );
}
