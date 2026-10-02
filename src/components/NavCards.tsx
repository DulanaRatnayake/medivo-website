"use client";

import Link from "next/link";

const cards = [
  { label: "About Medivo", href: "/about", icon: "🏢", color: "#02A9E7" },
  { label: "The Problem", href: "/problem", icon: "🔍", color: "#036CAD" },
  { label: "Our Solution", href: "/solution", icon: "💡", color: "#0BCEB7" },
  { label: "Product & Features", href: "/product", icon: "⚙️", color: "#04A9BC" },
  { label: "How It Works", href: "/how-it-works", icon: "🔄", color: "#02A9E7" },
  { label: "Connected Platform", href: "/platform", icon: "🌐", color: "#036CAD" },
  { label: "Team Immersion", href: "/team", icon: "👥", color: "#0BCEB7" },
  { label: "Vision & Mission", href: "/vision", icon: "🎯", color: "#04A9BC" },
  { label: "Preorder", href: "/preorder", icon: "🛒", color: "#02A9E7" },
  { label: "FAQ", href: "/faq", icon: "❓", color: "#036CAD" },
  { label: "User Manual", href: "/user-manual", icon: "📘", color: "#04A9BC" },
  { label: "Contact Us", href: "/contact", icon: "📬", color: "#0BCEB7" },
];

export default function NavCards() {
  return (
    <div className="nav-cards">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="nav-card"
          style={{
            borderRadius: "1rem",
            background: "rgba(255,255,255,0.6)",
            border: `1px solid ${card.color}22`,
            textDecoration: "none",
            color: "var(--color-text)",
            fontWeight: 600,
            fontSize: "0.9rem",
            transition: "all 0.2s ease",
            backdropFilter: "blur(8px)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = "translateY(-3px)";
            el.style.boxShadow = `0 8px 24px ${card.color}22`;
            el.style.borderColor = `${card.color}55`;
            el.style.background = "rgba(255,255,255,0.85)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = "translateY(0)";
            el.style.boxShadow = "none";
            el.style.borderColor = `${card.color}22`;
            el.style.background = "rgba(255,255,255,0.6)";
          }}
        >
          <span
            className="nav-card__icon"
            style={{ background: `${card.color}18` }}
          >
            {card.icon}
          </span>
          {card.label}
        </Link>
      ))}
    </div>
  );
}
