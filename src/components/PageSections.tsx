import Link from "next/link";

/* ── Page hero ───────────────────────────────────────────── */

interface PageHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHero({ eyebrow, title, intro, children }: PageHeroProps) {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding:
          "clamp(1.5rem, 3.5vw, 2.25rem) 1.5rem clamp(2rem, 4vw, 3rem)",
        textAlign: "center",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(2,169,231,0.14) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}
      >
        <div className="eyebrow animate-fade-in-up">{eyebrow}</div>
        <h1
          className="animate-fade-in-up delay-100"
          style={{
            fontSize: "clamp(2.1rem, 5vw, 3.25rem)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            marginBottom: "1.25rem",
          }}
        >
          {title}
        </h1>
        {intro && (
          <p
            className="prose-text animate-fade-in-up delay-200"
            style={{ fontSize: "1.15rem" }}
          >
            {intro}
          </p>
        )}
        {children && (
          <div className="animate-fade-in-up delay-300">{children}</div>
        )}
      </div>
    </section>
  );
}

/* ── Section heading ─────────────────────────────────────── */

interface SectionHeadingProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      style={{
        textAlign: align,
        marginBottom: "2.75rem",
      }}
    >
      <div
        className="divider"
        style={{ margin: centered ? "0 auto 1rem" : "0 0 1rem" }}
      />
      <h2 className="section-title">{title}</h2>
      {subtitle && (
        <p
          className="section-subtitle"
          style={{ marginInline: centered ? "auto" : 0 }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ── Feature card ────────────────────────────────────────── */

interface FeatureCardProps {
  icon: string;
  title: string;
  children: React.ReactNode;
}

export function FeatureCard({ icon, title, children }: FeatureCardProps) {
  return (
    <div className="glass-card feature-card">
      <div className="icon-badge" aria-hidden>
        {icon}
      </div>
      <h3 style={{ fontSize: "1.15rem", marginBottom: "0.6rem" }}>{title}</h3>
      <div
        style={{
          fontSize: "0.95rem",
          lineHeight: 1.75,
          color: "var(--color-text)",
          opacity: 0.75,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ── Pill list ───────────────────────────────────────────── */

export function PillList({ items }: { items: string[] }) {
  return (
    <ul className="pill-list" style={{ marginTop: "1rem" }}>
      {items.map((item) => (
        <li key={item} className="pill">
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ── Highlight / CTA band ────────────────────────────────── */

interface HighlightBandProps {
  title: React.ReactNode;
  children?: React.ReactNode;
  action?: { label: string; href: string };
}

export function HighlightBand({ title, children, action }: HighlightBandProps) {
  return (
    <section className="section-padding">
      <div className="section-container">
        <div
          className="glass-card"
          style={{
            padding: "clamp(2.5rem, 6vw, 4rem) clamp(1.5rem, 5vw, 3rem)",
            textAlign: "center",
            background:
              "linear-gradient(135deg, rgba(2,169,231,0.1), rgba(11,206,183,0.12))",
            border: "1px solid rgba(2,169,231,0.25)",
          }}
        >
          <h2
            className="section-title"
            style={{ marginBottom: children ? "0.75rem" : "1.75rem" }}
          >
            {title}
          </h2>
          {children && (
            <div
              className="section-subtitle"
              style={{ marginBottom: action ? "2rem" : 0 }}
            >
              {children}
            </div>
          )}
          {action && (
            <Link href={action.href} className="btn-primary">
              {action.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Prev / next page navigation ─────────────────────────── */

interface PageNavProps {
  prev?: { label: string; href: string };
  next?: { label: string; href: string };
}

export function PageNav({ prev, next }: PageNavProps) {
  return (
    <nav
      aria-label="Page navigation"
      className="section-container"
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
        paddingBottom: "4rem",
      }}
    >
      {prev ? (
        <Link href={prev.href} className="btn-outline" style={{ fontSize: "0.85rem" }}>
          ← {prev.label}
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          href={next.href}
          className="btn-primary"
          style={{ fontSize: "0.85rem", marginLeft: "auto" }}
        >
          {next.label} →
        </Link>
      )}
    </nav>
  );
}
