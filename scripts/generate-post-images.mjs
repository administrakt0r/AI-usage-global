import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import { loadBlogPosts, rootDir } from "./load-blog-data.mjs";

const publicDir = path.join(rootDir, "public");
const outputDir = path.join(publicDir, "images", "posts");
const sharedOgPath = path.join(publicDir, "images", "og-image.png");
const logoPath = path.join(publicDir, "aug-logo.svg");

const newsPresets = [
  {
    backgroundStart: "#f0fdf4",
    backgroundEnd: "#bbf7d0",
    accent: "#16a34a",
    accentTwo: "#0f4c81",
    panel: "rgba(255,255,255,0.8)",
    heroPanel: "rgba(16,24,40,0.92)",
    glowOne: "rgba(22, 163, 74, 0.16)",
    glowTwo: "rgba(15, 76, 129, 0.18)",
  },
  {
    backgroundStart: "#ecfdf5",
    backgroundEnd: "#86efac",
    accent: "#15803d",
    accentTwo: "#0f4c81",
    panel: "rgba(255,255,255,0.82)",
    heroPanel: "rgba(15,23,42,0.93)",
    glowOne: "rgba(21, 128, 61, 0.15)",
    glowTwo: "rgba(15, 76, 129, 0.18)",
  },
  {
    backgroundStart: "#f0fdf4",
    backgroundEnd: "#6ee7b7",
    accent: "#059669",
    accentTwo: "#1e40af",
    panel: "rgba(255,255,255,0.84)",
    heroPanel: "rgba(17,24,39,0.93)",
    glowOne: "rgba(5, 150, 105, 0.15)",
    glowTwo: "rgba(30, 64, 175, 0.17)",
  },
];

const analysisPresets = [
  {
    backgroundStart: "#fff7ed",
    backgroundEnd: "#fbbf24",
    accent: "#0f2442",
    accentTwo: "#16a34a",
    panel: "rgba(255,248,220,0.76)",
    heroPanel: "rgba(11,22,41,0.95)",
    glowOne: "rgba(251, 191, 36, 0.24)",
    glowTwo: "rgba(22, 163, 74, 0.16)",
  },
  {
    backgroundStart: "#fef3c7",
    backgroundEnd: "#f59e0b",
    accent: "#102a4a",
    accentTwo: "#16a34a",
    panel: "rgba(254,249,221,0.78)",
    heroPanel: "rgba(15,23,42,0.95)",
    glowOne: "rgba(245, 158, 11, 0.24)",
    glowTwo: "rgba(22, 163, 74, 0.16)",
  },
];

const sitePreset = newsPresets[0];
const NEWS_TITLE_Y_OFFSET = 18;

const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const hashString = (value) => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = value.charCodeAt(index) + ((hash << 5) - hash);
  }

  return Math.abs(hash);
};

const wrapText = (text, maxCharsPerLine) => {
  const words = text.split(/\s+/u);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length <= maxCharsPerLine || currentLine.length === 0) {
      currentLine = nextLine;
      continue;
    }

    lines.push(currentLine);
    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

const getTitleLines = (title) => {
  const initialMaxChars = title.length > 96 ? 20 : title.length > 72 ? 24 : 28;
  const lines = wrapText(title, initialMaxChars);

  if (lines.length <= 4) {
    return lines;
  }

  return [...lines.slice(0, 3), lines.slice(3).join(" ")];
};

const getTitleFontSize = (lines, variant = "default") => {
  const longestLine = Math.max(...lines.map((line) => line.length));

  if (variant === "news") {
    if (lines.length >= 4 || longestLine > 30) return 44;
    if (lines.length === 3 || longestLine > 24) return 52;

    return 60;
  }

  if (lines.length >= 4 || longestLine > 30) return 48;
  if (lines.length === 3 || longestLine > 24) return 56;

  return 66;
};

const getTitleTextSvg = ({
  title,
  lines = getTitleLines(title),
  fontSize = getTitleFontSize(lines),
  x,
  firstLineY,
  fill = "#ffffff",
  fontFamily = "'Arial', 'Helvetica Neue', sans-serif",
  shadowFilter = "url(#title-shadow)",
}) => {
  const lineHeight = Math.round(fontSize * 1.18);

  return lines
    .map(
      (line, index) => `
  <text
    x="${x}"
    y="${firstLineY + index * lineHeight}"
    font-family="${fontFamily}"
    font-size="${fontSize}"
    font-weight="800"
    fill="${fill}"
    letter-spacing="-1.2"
    filter="${shadowFilter}"
  >${escapeXml(line)}</text>`,
    )
    .join("");
};

const getNewsPostSvg = ({ title, logoDataUri, preset, subtitle }) => {
  const lines = getTitleLines(title);
  const fontSize = getTitleFontSize(lines, "news");
  const lineHeight = Math.round(fontSize * 1.18);

  const firstLineY =
    332 - ((lines.length - 1) * lineHeight) / 2 + NEWS_TITLE_Y_OFFSET;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-gradient" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${preset.backgroundStart}" />
      <stop offset="100%" stop-color="${preset.backgroundEnd}" />
    </linearGradient>
    <filter id="blur-64" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="64" />
    </filter>
    <filter id="title-shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="14" stdDeviation="22" flood-color="rgba(7, 15, 29, 0.22)" />
    </filter>
  </defs>
  <rect width="1200" height="630" rx="36" fill="url(#bg-gradient)" />
  <circle cx="1015" cy="100" r="190" fill="${preset.glowOne}" filter="url(#blur-64)" />
  <circle cx="1030" cy="560" r="240" fill="${preset.glowTwo}" filter="url(#blur-64)" />
  <circle cx="155" cy="520" r="200" fill="${preset.glowOne}" filter="url(#blur-64)" />
  <rect x="72" y="62" width="474" height="78" rx="39" fill="${preset.panel}" stroke="rgba(255,255,255,0.32)" />
  <rect x="94" y="79" width="44" height="44" rx="14" fill="rgba(255,255,255,0.34)" />
  <image href="${logoDataUri}" x="103" y="84" width="26" height="26" />
  <text x="160" y="104" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="24" font-weight="800" fill="${preset.accent}">
    AI Usage Global
  </text>
  <text x="160" y="126" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="16" font-weight="600" fill="rgba(16,24,40,0.72)">
    ${escapeXml(subtitle)}
  </text>
  <rect x="72" y="176" width="188" height="42" rx="21" fill="${preset.accent}" />
  <text x="104" y="203" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="18" font-weight="800" fill="#ffffff" letter-spacing="1.8">USAGE NEWS</text>
  <rect x="72" y="236" width="962" height="286" rx="38" fill="${preset.heroPanel}" />
  <rect x="1030" y="236" width="98" height="286" rx="28" fill="${preset.accentTwo}" opacity="0.92" />
  ${getTitleTextSvg({ title, lines, fontSize, x: 110, firstLineY })}
  <line x1="72" y1="552" x2="1128" y2="552" stroke="rgba(20,20,20,0.12)" />
  <text x="72" y="589" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="18" font-weight="600" fill="rgba(20,20,20,0.72)">
aiusageglobal.pages.dev
  </text>
  <text x="1128" y="589" text-anchor="end" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="22" font-weight="700" fill="${preset.accentTwo}">
    Tracking AI resource costs
  </text>
</svg>`;
};

const getAnalysisPostSvg = ({ title, logoDataUri, preset, subtitle }) => {
  const lines = getTitleLines(title);
  const fontSize = getTitleFontSize(lines);
  const lineHeight = Math.round(fontSize * 1.18);
  const firstLineY = 326 - ((lines.length - 1) * lineHeight) / 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-gradient" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${preset.backgroundStart}" />
      <stop offset="100%" stop-color="${preset.backgroundEnd}" />
    </linearGradient>
    <filter id="blur-72" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="72" />
    </filter>
    <filter id="analysis-shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="26" flood-color="rgba(8, 17, 31, 0.24)" />
    </filter>
  </defs>
  <rect width="1200" height="630" rx="36" fill="url(#bg-gradient)" />
  <circle cx="1025" cy="120" r="180" fill="${preset.glowOne}" filter="url(#blur-72)" />
  <circle cx="930" cy="548" r="220" fill="${preset.glowTwo}" filter="url(#blur-72)" />
  <rect x="74" y="64" width="456" height="76" rx="38" fill="${preset.panel}" stroke="rgba(8,17,31,0.08)" />
  <rect x="96" y="80" width="44" height="44" rx="14" fill="rgba(255,255,255,0.32)" />
  <image href="${logoDataUri}" x="105" y="89" width="26" height="26" />
  <text x="158" y="104" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="24" font-weight="800" fill="${preset.accent}">
    AI Usage Global
  </text>
  <text x="158" y="126" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="16" font-weight="700" fill="rgba(15,36,66,0.72)">
    ${escapeXml(subtitle)}
  </text>
  <path d="M76 188H1124L1054 522H76V188Z" fill="${preset.heroPanel}" />
  <path d="M902 188H1124L1054 522H832L902 188Z" fill="${preset.accentTwo}" opacity="0.96" />
  ${getTitleTextSvg({
    title,
    lines,
    fontSize,
    x: 110,
    firstLineY,
    fill: "#fef3c7",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    shadowFilter: "url(#analysis-shadow)",
  })}
  <line x1="76" y1="552" x2="1128" y2="552" stroke="rgba(8,17,31,0.14)" />
  <text x="76" y="589" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="18" font-weight="700" fill="rgba(8,17,31,0.68)">
    https://aiusageglobal.pages.dev
  </text>
  <text x="1128" y="589" text-anchor="end" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="22" font-weight="800" fill="${preset.accent}">
    Tracking the real cost of AI
  </text>
</svg>`;
};

const ensureOutputDirectory = async () => {
  await fs.mkdir(outputDir, { recursive: true });
};

const removeStaleImages = async (validSlugs) => {
  const currentFiles = await fs.readdir(outputDir);

  const validFiles = new Set(
    validSlugs.flatMap((slug) => [`${slug}.png`, `${slug}.webp`]),
  );

  await Promise.all(
    currentFiles
      .filter(
        (fileName) =>
          (fileName.endsWith(".png") || fileName.endsWith(".webp")) &&
          !validFiles.has(fileName),
      )
      .map((fileName) => fs.unlink(path.join(outputDir, fileName))),
  );
};

const renderImage = async (svg, outputPath, format) => {
  const renderer = sharp(Buffer.from(svg));

  if (format === "webp") {
    await renderer.webp({ quality: 82, effort: 6 }).toFile(outputPath);

    return;
  }

  await renderer
    .png({ compressionLevel: 9, effort: 8, palette: true })
    .toFile(outputPath);
};

const generatePostImages = async () => {
  const blogPosts = await loadBlogPosts();

  await ensureOutputDirectory();

  const logoSvg = await fs.readFile(logoPath, "utf8");
  const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;

  await Promise.all(
    blogPosts.map(async (post) => {
      const collection =
        post.category === "Analysis" ? analysisPresets : newsPresets;

      const preset = collection[hashString(post.slug) % collection.length];

      const subtitle =
        post.category === "Analysis"
          ? "Usage costs, context, and consequence"
          : "Water, power, money, and impact";

      const svg =
        post.category === "Analysis"
          ? getAnalysisPostSvg({
              title: post.title,
              logoDataUri,
              preset,
              subtitle,
            })
          : getNewsPostSvg({
              title: post.title,
              logoDataUri,
              preset,
              subtitle,
            });

      await Promise.all([
        renderImage(svg, path.join(outputDir, `${post.slug}.png`), "png"),
        renderImage(svg, path.join(outputDir, `${post.slug}.webp`), "webp"),
      ]);
    }),
  );

  const siteSvg = getNewsPostSvg({
    title: "AI water, power, costs, and impact reported daily",
    logoDataUri,
    preset: sitePreset,
    subtitle: "Tracking AI resource usage",
  });

  await renderImage(siteSvg, sharedOgPath, "png");
  await removeStaleImages(blogPosts.map((post) => post.slug));
};

await generatePostImages();
