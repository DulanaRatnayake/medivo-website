"use client";

import { useState } from "react";
import { CONTACT_EMAIL } from "@/lib/site";

const intendedFor = ["Patient", "Family Member", "Caregiver", "Other"];
const contactMethods = ["Email", "Phone", "WhatsApp"];

/**
 * Collects preorder interest. The site has no backend yet, so submitting
 * opens the visitor's email client with the details pre-filled and
 * addressed to the Medivo inbox.
 */
export default function PreorderForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();

    const body = [
      "YOUR DETAILS",
      `Full Name: ${get("name")}`,
      `Email Address: ${get("email")}`,
      `Phone Number: ${get("phone")}`,
      `Delivery Address: ${get("address")}`,
      `City: ${get("city")}`,
      "",
      "ORDER DETAILS",
      `Number of Units: ${get("units")}`,
      `Who is Medivo intended for?: ${get("intendedFor")}`,
      `Preferred Contact Method: ${get("contactMethod")}`,
      "",
      "Additional Message:",
      get("message") || "-",
    ].join("\n");

    const subject = `Medivo Preorder — ${get("name")}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  }

  const heading = { fontSize: "1.25rem", marginBottom: "1.25rem" };
  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
    gap: "1.1rem",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card"
      style={{
        padding: "clamp(1.5rem, 4vw, 2.5rem)",
        display: "flex",
        flexDirection: "column",
        gap: "2.25rem",
      }}
    >
      <fieldset style={{ border: "none" }}>
        <legend style={heading}>
          <h2 style={{ fontSize: "inherit" }}>Your Details</h2>
        </legend>
        <div style={grid}>
          <label className="form-field">
            Full Name
            <input name="name" required autoComplete="name" />
          </label>
          <label className="form-field">
            Email Address
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label className="form-field">
            Phone Number
            <input name="phone" type="tel" required autoComplete="tel" />
          </label>
          <label className="form-field">
            City
            <input name="city" required autoComplete="address-level2" />
          </label>
          <label className="form-field" style={{ gridColumn: "1 / -1" }}>
            Delivery Address
            <textarea
              name="address"
              rows={2}
              required
              autoComplete="street-address"
            />
          </label>
        </div>
      </fieldset>

      <fieldset style={{ border: "none" }}>
        <legend style={heading}>
          <h2 style={{ fontSize: "inherit" }}>Order Details</h2>
        </legend>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          <label className="form-field" style={{ maxWidth: 200 }}>
            Number of Units
            <input name="units" type="number" min={1} defaultValue={1} required />
          </label>

          <div className="form-field">
            Who is Medivo intended for?
            <div className="choice-group">
              {intendedFor.map((opt, i) => (
                <label key={opt}>
                  <input
                    type="radio"
                    name="intendedFor"
                    value={opt}
                    defaultChecked={i === 0}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <div className="form-field">
            Preferred Contact Method
            <div className="choice-group">
              {contactMethods.map((opt, i) => (
                <label key={opt}>
                  <input
                    type="radio"
                    name="contactMethod"
                    value={opt}
                    defaultChecked={i === 0}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <label className="form-field">
            Additional Message
            <textarea name="message" rows={4} />
          </label>
        </div>
      </fieldset>

      <div>
        <button type="submit" className="btn-primary">
          Submit Your Preorder
        </button>
        {submitted && (
          <p role="status" className="prose-text" style={{ marginTop: "1rem" }}>
            Thank you! Your email app should open with your preorder details —
            just press send. If it doesn&apos;t open, email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        )}
      </div>
    </form>
  );
}
