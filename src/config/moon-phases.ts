export const moonPhases = [
  {
    id: "new-moon",
    name: "New Moon",
    phase: "NEW_MOON",
    description: "Beginnings, creation stories, and new narratives",
    icon: "🌑",
    color: "#0a0a0a",
  },
  {
    id: "waxing-crescent",
    name: "Waxing Crescent",
    phase: "WAXING_CRESCENT",
    description: "Growth, transformation, and emerging wisdom",
    icon: "🌒",
    color: "#1a1a1a",
  },
  {
    id: "first-quarter",
    name: "First Quarter",
    phase: "FIRST_QUARTER",
    description: "Action, decision, and movement forward",
    icon: "🌓",
    color: "#2a2a2a",
  },
  {
    id: "waxing-gibbous",
    name: "Waxing Gibbous",
    phase: "WAXING_GIBBOUS",
    description: "Refinement, perfection, and preparation",
    icon: "🌔",
    color: "#3a3a3a",
  },
  {
    id: "full-moon",
    name: "Full Moon",
    phase: "FULL_MOON",
    description: "Illumination, revelation, and complete understanding",
    icon: "🌕",
    color: "#4a4a4a",
  },
  {
    id: "waning-gibbous",
    name: "Waning Gibbous",
    phase: "WANING_GIBBOUS",
    description: "Gratitude, sharing, and distribution of wisdom",
    icon: "🌖",
    color: "#3a3a3a",
  },
  {
    id: "last-quarter",
    name: "Last Quarter",
    phase: "LAST_QUARTER",
    description: "Release, letting go, and forgiveness",
    icon: "🌗",
    color: "#2a2a2a",
  },
  {
    id: "waning-crescent",
    name: "Waning Crescent",
    phase: "WANING_CRESCENT",
    description: "Rest, surrender, and preparation for rebirth",
    icon: "🌘",
    color: "#1a1a1a",
  },
];

export function getCurrentMoonPhase(): typeof moonPhases[0] {
  // This is a simplified calculation. In production, use a proper lunar phase library
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  // Simple approximation
  const c = Math.floor(365.25 * year);
  const e = Math.floor(30.6 * month);
  const jd = c + e + day - 694039.09;
  const phase = jd / 29.53;
  const phaseIndex = Math.floor((phase - Math.floor(phase)) * 8);
  
  return moonPhases[phaseIndex];
}
