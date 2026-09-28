/**
 * Medivo Brand Color Palette
 * Edit all brand colors here — used across the entire site.
 */
export const colors = {
  /** Page background */
  background: "#E6F6FD",

  /** Primary text */
  text: "#011F44",

  /** Brand primary — vivid sky blue */
  primary: "#02A9E7",

  /** Brand secondary — teal green */
  secondary: "#0BCEB7",

  /** Brand accent — cyan */
  accent: "#04A9BC",

  /** Brand deep — ocean blue */
  deep: "#036CAD",
} as const;

export type ColorKey = keyof typeof colors;
