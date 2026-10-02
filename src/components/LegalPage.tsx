import { PageHero, PageNav } from "@/components/PageSections";
import { CONTACT_EMAIL, legalLinks } from "@/lib/site";

/** The contact email as a mailto link, for use inside policy text. */
export function EmailLink() {
  return <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;
}

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

/** Shared layout for the policy pages linked from the footer. */
export default function LegalPage({
  title,
  lastUpdated,
  children,
}: LegalPageProps) {
  const index = legalLinks.findIndex((l) => l.label === title);
  const prev = legalLinks[index - 1];
  const next = legalLinks[index + 1];

  return (
    <>
      <PageHero eyebrow="Legal" title={title} />

      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="section-container" style={{ maxWidth: 820 }}>
          <article
            className="glass-card legal-text"
            style={{ padding: "clamp(1.5rem, 5vw, 3rem)" }}
          >
            {children}
            <p className="legal-updated">Last Updated: {lastUpdated}</p>
          </article>
        </div>
      </section>

      <PageNav prev={prev} next={next} />
    </>
  );
}
