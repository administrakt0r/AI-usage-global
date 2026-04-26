import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import { loadBlogPosts, rootDir } from "./load-blog-data.mjs";

const publicDir = path.join(rootDir, "public");
const outputDir = path.join(publicDir, "images", "posts");
const sharedOgPath = path.join(publicDir, "images", "og-image.png");
const logoPath = path.join(publicDir, "aug-logo.svg");

const presets = [
  {
    backgroundStart: "#f0fdf4",
    backgroundMid: "#dcfce7",
    backgroundEnd: "#86efac",
    heroPanel: "rgba(7, 22, 16, 0.92)",
    heroPanelStroke: "rgba(134, 239, 172, 0.18)",
    accent: "#16a34a",
    accentSoft: "#4ade80",
    accentTwo: "#14532d",
    ink: "#f7fee7",
    glowOne: "rgba(34, 197, 94, 0.22)",
    glowTwo: "rgba(74, 222, 128, 0.20)",
    chip: "rgba(22, 163, 74, 0.14)",
    chipText: "#166534",
  },
  {
    backgroundStart: "#ecfdf5",
    backgroundMid: "#d1fae5",
    backgroundEnd: "#6ee7b7",
    heroPanel: "rgba(7, 24, 19, 0.93)",
    heroPanelStroke: "rgba(110, 231, 183, 0.18)",
    accent: "#059669",
    accentSoft: "#34d399",
    accentTwo: "#064e3b",
    ink: "#f0fdf4",
    glowOne: "rgba(16, 185, 129, 0.20)",
    glowTwo: "rgba(52, 211, 153, 0.22)",
    chip: "rgba(5, 150, 105, 0.14)",
    chipText: "#065f46",
  },
  {
    backgroundStart: "#f7fee7",
    backgroundMid: "#dcfce7",
    backgroundEnd: "#4ade80",
    heroPanel: "rgba(10, 24, 14, 0.93)",
    heroPanelStroke: "rgba(187, 247, 208, 0.18)",
    accent: "#15803d",
    accentSoft: "#86efac",
    accentTwo: "#14532d",
    ink: "#f7fee7",
    glowOne: "rgba(21, 128, 61, 0.22)",
    glowTwo: "rgba(134, 239, 172, 0.20)",
    chip: "rgba(21, 128, 61, 0.14)",
    chipText: "#166534",
  },
];

const sitePreset = presets[0];
const TITLE_Y_OFFSET = 10;
const MAX_TITLE_LINES = 4;
const TITLE_CANDIDATES = [30, 28, 26, 24, 22, 20, 18];
const TOPIC_LABELS = ["WATER", "POWER", "COSTS", "IMPACT"];

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

const normalizeTitle = (value) => {
  const title = String(value ?? "")
    .replaceAll(/\s+/gu, " ")
    .trim();

  return title || "AI Usage Global";
};

const splitLongToken = (token, maxChars) => {
  if (token.length <= maxChars) {
    return [token];
  }

  const chunks = [];
  let start = 0;

  while (start < token.length) {
    const end = Math.min(start + Math.max(maxChars - 1, 4), token.length);
    const chunk = token.slice(start, end);

    chunks.push(end < token.length ? `${chunk}-` : chunk);
    start = end;
  }

  return chunks;
};

const tokenizeTitle = (title, maxChars) =>
  normalizeTitle(title)
    .split(/\s+/u)
    .flatMap((token) => splitLongToken(token, maxChars));

const appendEllipsis = (line, maxChars) => {
  if (line.length <= maxChars) {
    return line;
  }

  return `${line.slice(0, Math.max(maxChars - 1, 1)).trimEnd()}…`;
};

const wrapTitle = (title, maxChars, maxLines = MAX_TITLE_LINES) => {
  const words = tokenizeTitle(title, maxChars);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length <= maxChars || currentLine.length === 0) {
      currentLine = nextLine;
      continue;
    }

    lines.push(currentLine);

    if (lines.length === maxLines) {
      return [...lines.slice(0, maxLines - 1), appendEllipsis(lines[maxLines - 1], maxChars)];
    }

    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  if (lines.length <= maxLines) {
    return lines;
  }

  const visible = lines.slice(0, maxLines - 1);
  const remainder = lines.slice(maxLines - 1).join(" ");

  visible.push(appendEllipsis(remainder, maxChars));

  return visible;
};

const getTitleLayout = (title) => {
  for (const maxChars of TITLE_CANDIDATES) {
    const lines = wrapTitle(title, maxChars);

    if (lines.length <= MAX_TITLE_LINES) {
      const longestLine = Math.max(...lines.map((line) => line.length));
      let fontSize = 68;

      if (lines.length >= 4 || longestLine > 28) {
        fontSize = 48;
      } else if (lines.length === 3 || longestLine > 24) {
        fontSize = 56;
      } else if (longestLine > 20) {
        fontSize = 62;
      }

      return { lines, fontSize };
    }
  }

  return {
    lines: wrapTitle(title, 18),
    fontSize: 48,
  };
};

const getTitleTextSvg = ({
  lines,
  fontSize,
  x,
  firstLineY,
  fill,
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
    letter-spacing="-1.15"
    filter="${shadowFilter}"
  >${escapeXml(line)}</text>`,
    )
    .join("");
};

const getTopicPillsSvg = (preset) =>
  TOPIC_LABELS.map(
    (label, index) => `
  <rect x="1008" y="${250 + index * 58}" width="126" height="40" rx="20" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.10)" />
  <text x="1071" y="${276 + index * 58}" text-anchor="middle" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="16" font-weight="800" fill="${preset.ink}" letter-spacing="1.4">${label}</text>`,
  ).join("");

const getPostSvg = ({ title, logoDataUri, preset, subtitle }) => {
  const safeTitle = normalizeTitle(title);
  const { lines, fontSize } = getTitleLayout(safeTitle);
  const lineHeight = Math.round(fontSize * 1.18);
  const firstLineY = 336 - ((lines.length - 1) * lineHeight) / 2 + TITLE_Y_OFFSET;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-gradient" x1="60" y1="38" x2="1140" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${preset.backgroundStart}" />
      <stop offset="52%" stop-color="${preset.backgroundMid}" />
      <stop offset="100%" stop-color="${preset.backgroundEnd}" />
    </linearGradient>
    <linearGradient id="rail-gradient" x1="1030" y1="236" x2="1030" y2="522" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${preset.accent}" />
      <stop offset="100%" stop-color="${preset.accentTwo}" />
    </linearGradient>
    <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
      <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(20, 83, 45, 0.08)" stroke-width="1" />
    </pattern>
    <filter id="blur-72" x="-35%" y="-35%" width="170%" height="170%">
      <feGaussianBlur stdDeviation="72" />
    </filter>
    <filter id="title-shadow" x="-10%" y="-10%" width="130%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="rgba(6, 13, 10, 0.35)" />
    </filter>
  </defs>
  <rect width="1200" height="630" rx="36" fill="url(#bg-gradient)" />
  <rect width="1200" height="630" rx="36" fill="url(#grid)" opacity="0.42" />
  <circle cx="1040" cy="98" r="190" fill="${preset.glowOne}" filter="url(#blur-72)" />
  <circle cx="1090" cy="548" r="232" fill="${preset.glowTwo}" filter="url(#blur-72)" />
  <circle cx="184" cy="548" r="206" fill="${preset.glowOne}" filter="url(#blur-72)" />
  <rect x="68" y="58" width="486" height="86" rx="28" fill="rgba(255,255,255,0.76)" stroke="rgba(255,255,255,0.36)" />
  <rect x="90" y="78" width="48" height="48" rx="14" fill="${preset.chip}" />
  <image href="${logoDataUri}" x="101" y="89" width="26" height="26" />
  <text x="157" y="102" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="24" font-weight="800" fill="${preset.accentTwo}">AI Usage Global</text>
  <text x="157" y="126" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="16" font-weight="600" fill="rgba(20, 40, 28, 0.78)">${escapeXml(subtitle)}</text>
  <rect x="68" y="176" width="232" height="40" rx="20" fill="${preset.chip}" />
  <text x="93" y="202" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="16" font-weight="800" fill="${preset.chipText}" letter-spacing="1.6">AI INFRASTRUCTURE</text>
  <rect x="68" y="232" width="1064" height="292" rx="36" fill="${preset.heroPanel}" stroke="${preset.heroPanelStroke}" />
  <rect x="1000" y="232" width="132" height="292" rx="32" fill="url(#rail-gradient)" opacity="0.95" />
  <circle cx="1024" cy="92" r="8" fill="${preset.accentSoft}" />
  <circle cx="1048" cy="92" r="8" fill="rgba(255,255,255,0.52)" />
  <circle cx="1072" cy="92" r="8" fill="${preset.accent}" />
  ${getTitleTextSvg({ lines, fontSize, x: 108, firstLineY, fill: preset.ink })}
  <text x="108" y="474" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="19" font-weight="600" fill="rgba(240, 253, 244, 0.82)">Daily reporting on AI water, power, cost, and ecological impact</text>
  ${getTopicPillsSvg(preset)}
  <line x1="68" y1="554" x2="1132" y2="554" stroke="rgba(20, 60, 36, 0.14)" />
  <text x="68" y="590" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="18" font-weight="700" fill="rgba(20, 60, 36, 0.75)">aiusageglobal.pages.dev</text>
  <text x="1132" y="590" text-anchor="end" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="20" font-weight="800" fill="${preset.accentTwo}">Tracking the real cost of AI</text>
</svg>`;
};

const ensureOutputDirectory = async () => {
  await fs.mkdir(outputDir, { recursive: true });
};

const removeStaleImages = async (validSlugs) => {
  const currentFiles = await fs.readdir(outputDir);
  const validFiles = new Set(validSlugs.flatMap((slug) => [`${slug}.png`, `${slug}.webp`]));

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
    await renderer.webp({ quality: 84, effort: 6 }).toFile(outputPath);

    return;
  }

  await renderer.png({ compressionLevel: 9, effort: 8, palette: true }).toFile(outputPath);
};

const generatePostImages = async () => {
  const blogPosts = await loadBlogPosts();

  await ensureOutputDirectory();

  const logoSvg = await fs.readFile(logoPath, "utf8");
  const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;

  await Promise.all(
    blogPosts.map(async (post) => {
      const preset = presets[hashString(post.slug) % presets.length];

      const svg = getPostSvg({
        title: post.title,
        logoDataUri,
        preset,
        subtitle: "Water, power, money, and ecological impact",
      });

      await Promise.all([
        renderImage(svg, path.join(outputDir, `${post.slug}.png`), "png"),
        renderImage(svg, path.join(outputDir, `${post.slug}.webp`), "webp"),
      ]);
    }),
  );

  const siteSvg = getPostSvg({
    title: "AI water, power, costs, and impact reported daily",
    logoDataUri,
    preset: sitePreset,
    subtitle: "Static AI reporting focused on infrastructure and ecology",
  });

  await renderImage(siteSvg, sharedOgPath, "png");
  await removeStaleImages(blogPosts.map((post) => post.slug));

  console.log(`Generated ${blogPosts.length} post image sets and shared social preview.`);
};

await generatePostImages();
