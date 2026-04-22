export type TemplateId = "clean" | "bold" | "scarlet" | "ghost";

export type TemplateDef = {
  id: TemplateId;
  name: string;
  tagline: string;
  premium: boolean;
  lockedFonts: boolean; // if true, font picker is hidden
};

export const TEMPLATES: TemplateDef[] = [
  {
    id: "clean",
    name: "Clean",
    tagline: "Tasteful. Timeless.",
    premium: false,
    lockedFonts: false,
  },
  {
    id: "ghost",
    name: "Ghost",
    tagline: "Less is everything.",
    premium: false,
    lockedFonts: false,
  },
  {
    id: "scarlet",
    name: "Scarlet",
    tagline: "Make an entrance.",
    premium: true,
    lockedFonts: true,
  },
  {
    id: "bold",
    name: "Bold",
    tagline: "Can't be ignored.",
    premium: true,
    lockedFonts: true,
  },
];
