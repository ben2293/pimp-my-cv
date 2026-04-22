export type ContactInfo = {
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
};

export type Experience = {
  company: string;
  role: string;
  start: string;
  end: string;
  location?: string;
  bullets: string[];
};

export type Education = {
  institution: string;
  degree: string;
  field?: string;
  year: string;
  gpa?: string;
};

export type Project = {
  name: string;
  description: string;
  tech?: string[];
  url?: string;
};

export type Certification = {
  name: string;
  issuer: string;
  year?: string;
};

export type CVScore = {
  content: number;      // 0–25: specificity, depth of experience
  structure: number;    // 0–25: logical flow, right sections
  impact: number;       // 0–25: metrics, action verbs, achievements
  presentation: number; // 0–25: no fluff, no personal junk, concise
  total: number;        // sum of above
};

export type CVData = {
  name: string;
  title?: string;
  contact: ContactInfo;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: Record<string, string[]>;
  projects?: Project[];
  certifications?: Certification[];
  achievements?: string[];
};
