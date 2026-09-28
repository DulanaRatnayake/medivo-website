import type { Metadata } from "next";
import { PageHero, PageNav } from "@/components/PageSections";
import PreorderForm from "@/components/PreorderForm";

export const metadata: Metadata = {
  title: "Preorder Medivo",
  description:
    "Be among the first to experience Medivo, a smarter approach to everyday medication management. Register your interest today.",
};

export default function PreorderPage() {
  return (
    <>
      <PageHero
        eyebrow="Because Every Dose Matters."
        title={
          <>
            Preorder <span className="gradient-text">Medivo</span>
          </>
        }
        intro="Be among the first to experience Medivo, a smarter approach to everyday medication management."
      />

      <section className="section-padding" style={{ paddingTop: 0 }}>
        <div className="section-container" style={{ maxWidth: 860 }}>
          <p
            className="prose-text"
            style={{ textAlign: "center", marginBottom: "2rem" }}
          >
            Complete the form below to register your interest in Medivo.
          </p>
          <PreorderForm />
        </div>
      </section>

      <PageNav
        prev={{ label: "Vision & Mission", href: "/vision" }}
        next={{ label: "FAQ", href: "/faq" }}
      />
    </>
  );
}
