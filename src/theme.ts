export type SpringAccent = 'blossom' | 'sunshine' | 'mint' | 'sky';

export const ACCENT_HEX: Record<SpringAccent, string> = {
  blossom: '#fb7185',
  sunshine: '#fbbf24',
  mint: '#34d399',
  sky: '#38bdf8'
};

export const ACCENT_HEX_SOFT: Record<SpringAccent, string> = {
  blossom: '#fecdd3',
  sunshine: '#fde68a',
  mint: '#a7f3d0',
  sky: '#bae6fd'
};

/**
 * Ordered section flow. Each entry is the accent for that section and the
 * accent the section should blend INTO at its bottom (i.e. the next
 * section's accent). The last section blends into itself (terminal).
 */
export type SectionAccent = { accent: SpringAccent; nextAccent: SpringAccent };

export const SECTION_ACCENTS: Record<string, SectionAccent> = {
  home:          { accent: 'blossom',  nextAccent: 'sunshine' },
  achievements:  { accent: 'sunshine', nextAccent: 'mint' },
  skills:        { accent: 'mint',     nextAccent: 'sky' },
  experience:    { accent: 'sky',      nextAccent: 'blossom' },
  msc:           { accent: 'blossom',  nextAccent: 'sunshine' },
  projects:      { accent: 'sunshine', nextAccent: 'mint' },
  education:     { accent: 'mint',     nextAccent: 'sky' },
  certifications:{ accent: 'sky',      nextAccent: 'blossom' },
  contact:       { accent: 'blossom',  nextAccent: 'blossom' }
};

/** Returns the two CSS color stops for a section's bottom-blend overlay. */
export const blendStops = (key: string): { from: string; to: string } => {
  const { accent, nextAccent } = SECTION_ACCENTS[key] ?? SECTION_ACCENTS.home;
  return { from: ACCENT_HEX[accent], to: ACCENT_HEX[nextAccent] };
};
