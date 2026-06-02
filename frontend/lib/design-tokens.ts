export const designTokens = {
  spacing: {
    sectionY: "clamp(4rem, 8vw, 8rem)",
    contentX: "clamp(1rem, 4vw, 3rem)",
    stackSm: "0.75rem",
    stackMd: "1.25rem",
    stackLg: "2rem"
  },
  typography: {
    displayXl: "clamp(2.5rem, 5vw, 4.5rem)",
    displayLg: "clamp(2rem, 4vw, 3.5rem)",
    headingMd: "clamp(1.5rem, 2vw, 2rem)",
    bodyLg: "1.125rem",
    bodyMd: "1rem",
    bodySm: "0.925rem"
  },
  radii: {
    card: "1.25rem",
    button: "0.9rem"
  }
} as const;
