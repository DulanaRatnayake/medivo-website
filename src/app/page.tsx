import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import productImage from "@/assets/product.png";
import backgroundImage from "@/assets/background.png";
import NavCards from "@/components/NavCards";
import ScrollSequence from "@/components/ScrollSequence";
import { SectionHeading } from "@/components/PageSections";

export const metadata: Metadata = {
  title: "Medivo — Because Every Dose Matters",
  description:
    "Medivo is a smart medication management solution designed to help users organise their medications, receive timely reminders, confirm doses and stay connected with caregivers.",
};

export default function HomePage() {
  return (
    <div>
      {/* ── Hero (photo background) ── */}
      <section
        id="hero"
        className="hero"
      >
        <Image
          src={backgroundImage}
          alt=""
          aria-hidden
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "70% center", zIndex: 0 }}
        />
        <div aria-hidden className="story-overlay" />

        <div
          className="section-container"
          style={{ position: "relative", zIndex: 1, width: "100%" }}
        >
          <div style={{ maxWidth: 600 }}>
            <h1 className="hero__title animate-fade-in-up delay-100">
              <span className="gradient-text">MEDIVO</span>
            </h1>
            <p className="hero__tagline animate-fade-in-up delay-100">
              <span className="gradient-text">Because Every Dose Matters.</span>
            </p>

            <p className="hero__subtitle animate-fade-in-up delay-100">
              Smart Medication Management for a Simpler, Safer and More
              Connected Routine.
            </p>

            <p className="hero__text animate-fade-in-up delay-200">
              Medivo is a smart medication management solution designed to help
              users organise their medications, receive timely reminders,
              confirm doses and stay connected with caregivers.
            </p>

            <div
              className="animate-fade-in-up delay-300"
              style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
            >
              <Link href="#explore" className="btn-primary btn-gradient">
                Explore Medivo
              </Link>
              <Link
                href="/preorder"
                className="btn-outline"
                style={{ color: "#fff", borderColor: "rgba(255,255,255,0.75)" }}
              >
                Preorder Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Managing Medication + product ── */}
      <section className="section-padding" style={{ position: "relative" }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 70% at 75% 50%, rgba(2,169,231,0.12) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div className="section-container two-col" style={{ position: "relative" }}>
          <div>
            <SectionHeading
              title="Managing Medication Should Be Easier"
              align="left"
            />
            <p className="prose-text">
              Managing multiple medications every day can be challenging.
              Remembering the right medication at the right time, keeping track
              of doses and maintaining an organised routine can be difficult for
              both patients and caregivers.
            </p>
            <p className="prose-text">
              Medivo was created to make medication management simpler and more
              organised.
            </p>
            <p
              style={{
                marginTop: "2rem",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                fontWeight: 800,
                lineHeight: 1.3,
              }}
            >
              One Solution.{" "}
              <span className="gradient-text">A Smarter Medication Routine.</span>
            </p>
          </div>

          <Image
            src={productImage}
            alt="Medivo smart medication box with 21 compartments and LED indicators"
            sizes="(max-width: 768px) 100vw, 600px"
            style={{
              width: "100%",
              height: "auto",
              filter: "drop-shadow(0 30px 40px rgba(3,108,173,0.18))",
            }}
          />
        </div>
      </section>

      {/* ── Scroll-driven product animation ── */}
      <ScrollSequence
        framesPath="/videos/medivo-scroll/desktop"
        mobileFramesPath="/videos/medivo-scroll/mobile"
        frameCount={120}
        reducedMotionImage="/videos/medivo-scroll-still.jpg"
        scrollLength={180}
        mobileScrollLength={120}
        label="Medivo taken apart layer by layer: display lid, compartment cover, 21 medication compartments, LED indicators, circuit board and battery base."
      />

      {/* ── Quick Nav Cards ── */}
      <section
        id="explore"
        className="section-padding"
        style={{
          scrollMarginTop: "72px",
          background: "rgba(255,255,255,0.4)",
          borderTop: "1px solid rgba(2,169,231,0.12)",
          borderBottom: "1px solid rgba(2,169,231,0.12)",
        }}
      >
        <div className="section-container">
          <SectionHeading
            title="Explore Medivo"
            subtitle="Discover the problem, the solution and the team behind Medivo."
          />

          <NavCards />

        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="section-padding">
        <div className="section-container">
          <div
            className="glass-card"
            style={{
              padding: "4rem 3rem",
              textAlign: "center",
              background:
                "linear-gradient(135deg, rgba(2,169,231,0.1), rgba(11,206,183,0.1))",
              border: "1px solid rgba(2,169,231,0.25)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "-30%",
                right: "-10%",
                width: "400px",
                height: "400px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(2,169,231,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <h2
              className="section-title"
              style={{ marginBottom: "0.75rem" }}
            >
              Be Among the First to Experience Medivo
            </h2>
            <p
              className="section-subtitle"
              style={{ marginBottom: "2rem" }}
            >
              A smarter approach to everyday medication management. Because
              Every Dose Matters.
            </p>
            <Link href="/preorder" className="btn-primary">
              Preorder Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
