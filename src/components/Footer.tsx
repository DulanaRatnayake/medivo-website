"use client";

import Link from "next/link";
import Image from "next/image";
import { socialLinks, SocialIcon, externalProps } from "@/components/SocialIcons";
import { legalLinks } from "@/lib/site";

const footerSections = [
  {
    title: "Pages",
    links: [
      { label: "About Medivo", href: "/about" },
      { label: "The Problem", href: "/problem" },
      { label: "Our Solution", href: "/solution" },
      { label: "Product & Features", href: "/product" },
    ],
  },
  {
    title: "Learn More",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Connected Platform", href: "/platform" },
      { label: "Team Immersion", href: "/team" },
      { label: "Vision & Mission", href: "/vision" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Preorder", href: "/preorder" },
      { label: "FAQ", href: "/faq" },
      { label: "User Manual", href: "/user-manual" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: legalLinks,
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #011F44 0%, #036CAD 100%)",
        color: "#fff",
        marginTop: "auto",
      }}
    >
      {/* Top wave */}
      <div style={{ overflow: "hidden", lineHeight: 0, marginBottom: "-2px" }}>
        <svg
          viewBox="0 0 1440 60"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%", transform: "rotate(180deg)" }}
        >
          <path
            d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"
            fill="#E6F6FD"
          />
        </svg>
      </div>

      <div className="section-container" style={{ paddingBlock: "3.5rem" }}>
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            {/* Logo */}
            <div style={{ marginBottom: "1rem" }}>
              <Link href="/">
                <Image
                  src="/logo_light.png"
                  alt="Medivo"
                  width={140}
                  height={46}
                  style={{
                    height: 40,
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
              </Link>
            </div>

            <p
              style={{
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.7,
                maxWidth: "240px",
              }}
            >
              Smart medication management for a simpler, safer and more
              connected routine. Because Every Dose Matters.
            </p>

            {/* Social Links */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
              {socialLinks.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  aria-label={social.label}
                  title={social.label}
                  className="footer-social"
                  {...externalProps(social.href)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.7)",
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                  }}
                >
                  <SocialIcon name={social.key} size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#0BCEB7",
                  marginBottom: "1rem",
                }}
              >
                {section.title}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: "0.9rem",
                        color: "rgba(255,255,255,0.65)",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color = "#02A9E7")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color =
                          "rgba(255,255,255,0.65)")
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className="footer-bottom"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)" }}>
            © {new Date().getFullYear()} Medivo. All rights reserved.
          </p>
          <div
            className="footer-bottom-links"
            style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem 1.5rem" }}
          >
            {[...legalLinks, { label: "Sitemap", href: "/sitemap.xml" }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,0.45)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "#02A9E7")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color =
                    "rgba(255,255,255,0.45)")
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
