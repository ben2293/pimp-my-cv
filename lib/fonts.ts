export type FontPairing = {
  id: string;
  name: string;
  tagline: string;
  headingVar: string;
  bodyVar: string;
};

export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: "swiss",
    name: "Swiss",
    tagline: "Sharp & modern",
    headingVar: "var(--font-fraunces)",
    bodyVar: "var(--font-inter-tight)",
  },
  {
    id: "editorial",
    name: "Editorial",
    tagline: "Bold & journalistic",
    headingVar: "var(--font-playfair)",
    bodyVar: "var(--font-inter-tight)",
  },
  {
    id: "clean",
    name: "Clean",
    tagline: "Minimal & geometric",
    headingVar: "var(--font-dm-serif)",
    bodyVar: "var(--font-dm-sans)",
  },
  {
    id: "elegant",
    name: "Elegant",
    tagline: "Refined & classic",
    headingVar: "var(--font-cormorant)",
    bodyVar: "var(--font-jost)",
  },
];
