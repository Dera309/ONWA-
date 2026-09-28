export interface ArtworkDossierInput {
  title: string;
  subtitle?: string | null;
  description?: string | null;
  story: string;
  curatorNote?: string | null;
  historicalContext?: string | null;
  spiritualMeaning?: string | null;
  heroImageAlt?: string | null;
  creativeProcess?: string | null;
  artistNotes?: string | null;
  region?: string | null;
  country?: string | null;
  ethnicGroup?: string | null;
  era?: string | null;
  medium?: string | null;
  style?: string | null;
  slug?: string;
  collection?: {
    name?: string | null;
    slug?: string | null;
    curatorNote?: string | null;
  } | null;
  moonCycle?: {
    name?: string | null;
    phase?: string | null;
    theme?: string | null;
  } | null;
  license?: {
    licenseKey?: string;
    type?: string;
    resolution?: any;
    acquiredAt?: string | Date;
    collectorName?: string | null;
  } | null;
}

/**
 * Generates a comprehensive, beautifully formatted Markdown document
 * containing the artwork's Story, Curator Note, Historical Context,
 * Spiritual Meaning, Image Alt Text, and Archival Metadata.
 */
export function generateArtworkDossierMarkdown(data: ArtworkDossierInput): string {
  const originParts = [data.ethnicGroup, data.country, data.region].filter(Boolean);
  const originStr = originParts.length > 0 ? originParts.join(", ") : "African Heritage";

  let md = `# ${data.title}\n`;
  if (data.subtitle) {
    md += `*${data.subtitle}*\n\n`;
  } else {
    md += `\n`;
  }

  md += `**ONWA African Digital Museum Archive & Cultural Dossier**\n`;
  md += `*Origin:* ${originStr}${data.era ? ` · *Era:* ${data.era}` : ""}\n\n`;
  md += `---\n\n`;

  // Story
  md += `## 📖 Story\n\n`;
  md += `${data.story?.trim() || "No story cataloged for this artwork."}\n\n`;
  md += `---\n\n`;

  // Curator Note
  md += `## 🏛️ Curator's Note\n\n`;
  md += `${data.curatorNote?.trim() || "No curator's note provided."}\n\n`;
  md += `---\n\n`;

  // Historical Context
  md += `## 📜 Historical Context\n\n`;
  md += `${data.historicalContext?.trim() || "No historical context provided."}\n\n`;
  md += `---\n\n`;

  // Spiritual Meaning
  md += `## 🕊️ Spiritual Meaning\n\n`;
  md += `${data.spiritualMeaning?.trim() || "No spiritual meaning cataloged."}\n\n`;
  md += `---\n\n`;

  // Image Alt Text & Visual Description
  md += `## 🖼️ Image Alt Text & Visual Description\n\n`;
  md += `${data.heroImageAlt?.trim() || "No visual description / alt text provided."}\n\n`;
  md += `---\n\n`;

  // Additional Creative & Artist Notes if present
  if (data.creativeProcess || data.artistNotes) {
    md += `## 🎨 Creative Process & Artist Notes\n\n`;
    if (data.creativeProcess) {
      md += `### Creative Process\n${data.creativeProcess.trim()}\n\n`;
    }
    if (data.artistNotes) {
      md += `### Artist Notes\n${data.artistNotes.trim()}\n\n`;
    }
    md += `---\n\n`;
  }

  // Museum Archival Metadata
  md += `## 🏛️ Archival & Provenance Information\n\n`;
  md += `- **Museum Catalog Title**: ${data.title}\n`;
  if (data.collection?.name) {
    md += `- **Collection**: ${data.collection.name}\n`;
  }
  if (data.moonCycle?.name) {
    md += `- **Moon Cycle**: ${data.moonCycle.name}${data.moonCycle.theme ? ` (${data.moonCycle.theme})` : ""}\n`;
  }
  if (data.region) md += `- **Region**: ${data.region}\n`;
  if (data.country) md += `- **Country**: ${data.country}\n`;
  if (data.ethnicGroup) md += `- **Ethnic Group / Culture**: ${data.ethnicGroup}\n`;
  if (data.era) md += `- **Era**: ${data.era}\n`;
  if (data.medium) md += `- **Medium**: ${data.medium}\n`;
  if (data.style) md += `- **Style**: ${data.style}\n`;

  // License details if downloaded by an authorized collector
  if (data.license) {
    md += `\n### 🛡️ Collector Provenance & License\n\n`;
    if (data.license.licenseKey) md += `- **License Certificate Key**: \`${data.license.licenseKey}\`\n`;
    if (data.license.type) md += `- **License Type**: ${data.license.type.replace(/_/g, " ")}\n`;
    if (data.license.resolution) {
      const res = data.license.resolution;
      const resName = typeof res === "object" ? res.name || res.label || `${res.width}x${res.height}` : String(res);
      md += `- **Licensed Resolution**: ${resName}\n`;
    }
    if (data.license.collectorName) md += `- **Authorized Collector**: ${data.license.collectorName}\n`;
    if (data.license.acquiredAt) {
      const dateStr = new Date(data.license.acquiredAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      md += `- **Date of Acquisition**: ${dateStr}\n`;
    }
  }

  md += `\n---\n`;
  md += `*Preserved & Cataloged by ONWA — African Digital Museum of Art & Spirit*\n`;
  md += `*https://onwa.art*\n`;

  return md;
}

/**
 * Generates structured JSON metadata for programmatic archival use.
 */
export function generateArtworkDossierJson(data: ArtworkDossierInput): string {
  const structuredData = {
    title: data.title,
    subtitle: data.subtitle || null,
    story: data.story || "",
    curatorNote: data.curatorNote || null,
    historicalContext: data.historicalContext || null,
    spiritualMeaning: data.spiritualMeaning || null,
    imageAltText: data.heroImageAlt || null,
    creativeProcess: data.creativeProcess || null,
    artistNotes: data.artistNotes || null,
    classification: {
      region: data.region || null,
      country: data.country || null,
      ethnicGroup: data.ethnicGroup || null,
      era: data.era || null,
      medium: data.medium || null,
      style: data.style || null,
      collection: data.collection?.name || null,
      moonCycle: data.moonCycle?.name || null,
    },
    license: data.license
      ? {
          licenseKey: data.license.licenseKey,
          type: data.license.type,
          resolution: data.license.resolution,
          acquiredAt: data.license.acquiredAt,
          collectorName: data.license.collectorName,
        }
      : null,
    archive: {
      institution: "ONWA African Digital Museum",
      website: "https://onwa.art",
      exportedAt: new Date().toISOString(),
    },
  };

  return JSON.stringify(structuredData, null, 2);
}
