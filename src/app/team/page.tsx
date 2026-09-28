import type { Metadata } from "next";
import { PageHero, HighlightBand, PageNav } from "@/components/PageSections";

export const metadata: Metadata = {
  title: "Team Immersion",
  description:
    "A team of Business Economics undergraduates working together to transform a real world problem into a practical and user focused solution.",
};

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Business Economics | University Product Development Project"
        title={
          <>
            Team <span className="gradient-text">Immersion</span>
          </>
        }
        intro="A team of Business Economics undergraduates working together to transform a real world problem into a practical and user focused solution."
      />

      <HighlightBand
        title="Our Vision & Mission"
        action={{ label: "Read More", href: "/vision" }}
      >
        A future where medication management is simpler, safer and connected.
      </HighlightBand>

      <PageNav
        prev={{ label: "Connected Platform", href: "/platform" }}
        next={{ label: "Vision & Mission", href: "/vision" }}
      />
    </>
  );
}
