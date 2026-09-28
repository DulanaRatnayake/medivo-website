"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";


const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "The Problem", href: "/problem" },
  { label: "Our Solution", href: "/solution" },
  { label: "Product", href: "/product" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Platform", href: "/platform" },
  { label: "Team", href: "/team" },
  { label: "Vision", href: "/vision" },
  { label: "Preorder", href: "/preorder" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: scrolled
          ? "rgba(230, 246, 253, 0.95)"
          : "rgba(230, 246, 253, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled
          ? "1px solid rgba(2, 169, 231, 0.2)"
          : "1px solid transparent",
        transition: "all 0.3s ease",
        boxShadow: scrolled ? "0 2px 20px rgba(3, 108, 173, 0.1)" : "none",
      }}
    >
      <div
        className="section-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <Image
            src="/logo.png"
            alt="Medivo"
            width={130}
            height={48}
            priority
            style={{
              height: 42,
              width: "auto",
              objectFit: "contain",
            }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.15rem",
          }}
          className="desktop-nav"
        >
          {navLinks.slice(0, 8).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "0.4rem 0.7rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.82rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#02A9E7" : "#011F44",
                  background: isActive
                    ? "rgba(2, 169, 231, 0.1)"
                    : "transparent",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.target as HTMLElement).style.background =
                      "rgba(2, 169, 231, 0.08)";
                    (e.target as HTMLElement).style.color = "#02A9E7";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.target as HTMLElement).style.background = "transparent";
                    (e.target as HTMLElement).style.color = "#011F44";
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/preorder" className="btn-primary" style={{ fontSize: "0.85rem", padding: "0.6rem 1.4rem" }}>
            Preorder Now
          </Link>

          {/* Hamburger */}
          <button
            id="mobile-menu-toggle"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              display: "none",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.4rem",
              color: "#011F44",
            }}
            className="hamburger-btn"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            background: "rgba(230, 246, 253, 0.98)",
            backdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(2, 169, 231, 0.15)",
            padding: "1rem 1.5rem 1.5rem",
            maxHeight: "calc(100dvh - 72px)",
            overflowY: "auto",
          }}
          className="mobile-menu"
        >
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "0.625rem",
                    fontSize: "0.95rem",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#02A9E7" : "#011F44",
                    background: isActive
                      ? "rgba(2, 169, 231, 0.1)"
                      : "transparent",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      <style>{`
        @media (max-width: 1100px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        @media (min-width: 1101px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </header>
  );
}
