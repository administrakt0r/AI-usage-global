import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import { loadBlogPosts, rootDir } from "./load-blog-data.mjs";
import { TOPICS, classifyTopic, extractKeyStat } from "./post-image-topics.mjs";

const publicDir = path.join(rootDir, "public");
const outputDir = path.join(publicDir, "images", "posts");
const sharedOgPath = path.join(publicDir, "images", "og-image.png");
const logoPath = path.join(publicDir, "aug-logo.svg");

const FONT = "'DejaVu Sans', 'Liberation Sans', 'Helvetica Neue', Arial, sans-serif";
const WIDTH = 1200;
const HEIGHT = 630;
const MAX_TITLE_LINES = 4;
const TITLE_FONT_SIZES = [66, 60, 54, 48, 44, 40];

// Average bold glyph width as a fraction of font size for DejaVu/Liberation Sans.
const GLYPH_WIDTH = 0.6;

const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const normalizeTitle = (value) => {
  const title = String(value ?? "")
    .replaceAll(/\s+/gu, " ")
    .trim();

  return title || "AI Usage Global";
};

const wrapWords = (text, maxChars) => {
  const lines = [];
  let current = "";

  for (const word of normalizeTitle(text).split(" ")) {
    const next = current ? `${current} ${word}` : word;

    if (next.length <= maxChars || !current) {
      current = next;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
};

const ellipsize = (lines, maxLines, maxChars) => {
  if (lines.length <= maxLines) {
    return lines;
  }

  const kept = lines.slice(0, maxLines);
  const last = kept[maxLines - 1];

  kept[maxLines - 1] = `${last.slice(0, Math.max(maxChars - 1, 1)).trimEnd()}…`;

  return kept;
};

/** Largest font size whose wrapped title fits the available width and line count. */
export const getTitleLayout = (title, availableWidth) => {
  for (const fontSize of TITLE_FONT_SIZES) {
    const maxChars = Math.floor(availableWidth / (fontSize * GLYPH_WIDTH));
    const lines = wrapWords(title, maxChars);
    const longestWord = Math.max(...lines.map((line) => line.length));

    if (lines.length <= MAX_TITLE_LINES && longestWord <= maxChars) {
      return { lines, fontSize };
    }
  }

  const fontSize = TITLE_FONT_SIZES.at(-1);
  const maxChars = Math.floor(availableWidth / (fontSize * GLYPH_WIDTH));

  return { lines: ellipsize(wrapWords(title, maxChars), MAX_TITLE_LINES, maxChars), fontSize };
};

/** Topic glyphs drawn in a 200x200 box. */
const ICONS = {
  water: (c) =>
    `<path d="M100 18 C100 18 38 96 38 132 A62 62 0 0 0 162 132 C162 96 100 18 100 18 Z" fill="${c.accent}" opacity="0.9"/>
     <path d="M72 136 A30 30 0 0 0 100 164" stroke="${c.from}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.55"/>`,
  power: (c) =>
    `<path d="M118 14 L44 116 H94 L78 186 L156 80 H106 Z" fill="${c.accent}" stroke="${c.soft}" stroke-width="4" stroke-linejoin="round"/>`,
  nuclear: (c) =>
    `<g fill="none" stroke="${c.accent}" stroke-width="9">
       <ellipse cx="100" cy="100" rx="86" ry="32"/>
       <ellipse cx="100" cy="100" rx="86" ry="32" transform="rotate(60 100 100)"/>
       <ellipse cx="100" cy="100" rx="86" ry="32" transform="rotate(120 100 100)"/>
     </g><circle cx="100" cy="100" r="16" fill="${c.soft}"/>`,
  geothermal: (c) =>
    `<path d="M100 16 C118 58 150 70 150 118 A50 50 0 0 1 50 118 C50 92 66 78 74 60 C80 84 92 90 98 92 C92 64 96 40 100 16 Z" fill="${c.accent}"/>
     <path d="M100 104 C110 120 124 126 124 144 A24 24 0 0 1 76 144 C76 130 88 122 100 104 Z" fill="${c.soft}"/>
     <rect x="30" y="178" width="140" height="10" rx="5" fill="${c.soft}" opacity="0.6"/>`,
  emissions: (c) =>
    `<rect x="40" y="96" width="34" height="90" rx="4" fill="${c.soft}" opacity="0.75"/>
     <rect x="88" y="120" width="34" height="66" rx="4" fill="${c.soft}" opacity="0.55"/>
     <circle cx="64" cy="70" r="24" fill="${c.accent}" opacity="0.85"/>
     <circle cx="100" cy="50" r="30" fill="${c.accent}" opacity="0.7"/>
     <circle cx="144" cy="38" r="26" fill="${c.accent}" opacity="0.5"/>`,
  policy: (c) =>
    `<path d="M100 18 L178 62 H22 Z" fill="${c.accent}"/>
     <g fill="${c.soft}">
       <rect x="38" y="74" width="20" height="86" rx="3"/><rect x="74" y="74" width="20" height="86" rx="3"/>
       <rect x="106" y="74" width="20" height="86" rx="3"/><rect x="142" y="74" width="20" height="86" rx="3"/>
     </g><rect x="22" y="166" width="156" height="16" rx="4" fill="${c.accent}"/>`,
  chips: (c) =>
    `<g stroke="${c.soft}" stroke-width="8" stroke-linecap="round">
       ${[64, 88, 112, 136].map((v) => `<line x1="${v}" y1="18" x2="${v}" y2="40"/><line x1="${v}" y1="160" x2="${v}" y2="182"/><line x1="18" y1="${v}" x2="40" y2="${v}"/><line x1="160" y1="${v}" x2="182" y2="${v}"/>`).join("")}
     </g><rect x="42" y="42" width="116" height="116" rx="16" fill="${c.accent}"/>
     <rect x="70" y="70" width="60" height="60" rx="8" fill="${c.from}" opacity="0.6"/>`,
  finance: (c) =>
    `<rect x="30" y="120" width="30" height="60" rx="4" fill="${c.soft}" opacity="0.6"/>
     <rect x="74" y="92" width="30" height="88" rx="4" fill="${c.soft}" opacity="0.75"/>
     <rect x="118" y="58" width="30" height="122" rx="4" fill="${c.accent}"/>
     <path d="M26 96 L84 50 L116 70 L172 22" stroke="${c.accent}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  datacenter: (c) =>
    [0, 1, 2]
      .map(
        (row) =>
          `<rect x="30" y="${24 + row * 54}" width="140" height="44" rx="8" fill="${row === 1 ? c.accent : c.soft}" opacity="${row === 1 ? 1 : 0.7}"/>
           <circle cx="52" cy="${46 + row * 54}" r="6" fill="${c.from}"/><circle cx="72" cy="${46 + row * 54}" r="6" fill="${c.from}"/>
           <rect x="104" y="${42 + row * 54}" width="48" height="8" rx="4" fill="${c.from}" opacity="0.6"/>`,
      )
      .join(""),
};

const formatImageDate = (publishedOn) => {
  const date = new Date(`${publishedOn}T12:00:00Z`);

  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
};

export const getPostSvg = ({ title, topicId, stat, dateLabel, logoDataUri }) => {
  const topic = TOPICS[topicId] ?? TOPICS.datacenter;
  const c = topic.colors;
  const textX = 72;
  const titleWidth = 1200 - textX - 400;
  const { lines, fontSize } = getTitleLayout(title, titleWidth);
  const lineHeight = Math.round(fontSize * 1.14);
  const blockHeight = lines.length * lineHeight;
  const firstLineY = 330 - blockHeight / 2 + fontSize * 0.8;
  const icon = ICONS[topicId] ?? ICONS.datacenter;
  const chipWidth = 52 + topic.label.length * 14.5;
  const statFontSize = stat ? Math.min(76, Math.floor(240 / (stat.value.length * 0.78))) : 0;

  const statPanel = stat
    ? `<g transform="translate(828 150)">
        <rect width="300" height="330" rx="28" fill="rgba(255,255,255,0.06)" stroke="${c.accent}" stroke-opacity="0.45" stroke-width="2"/>
        <g transform="translate(110 34) scale(0.4)">${icon(c)}</g>
        <text x="150" y="${190 + Math.round(statFontSize / 4)}" text-anchor="middle" font-family="${FONT}" font-size="${statFontSize}" font-weight="800" fill="${c.soft}" letter-spacing="-2">${escapeXml(stat.value)}</text>
        <text x="150" y="252" text-anchor="middle" font-family="${FONT}" font-size="22" font-weight="600" fill="rgba(255,255,255,0.7)">${escapeXml(stat.label)}</text>
        <rect x="70" y="282" width="160" height="4" rx="2" fill="${c.accent}"/>
      </g>`
    : `<g transform="translate(858 165)">
        <circle cx="120" cy="150" r="150" fill="${c.accent}" opacity="0.08"/>
        <g transform="translate(20 50)">${icon(c)}</g>
      </g>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${c.from}"/>
      <stop offset="100%" stop-color="${c.to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="980" cy="300" r="520" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${c.accent}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${c.accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.6" fill="#ffffff" opacity="0.07"/>
    </pattern>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#dots)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  <rect x="0" y="0" width="12" height="${HEIGHT}" fill="${c.accent}"/>
  <image href="${logoDataUri}" x="${textX}" y="52" width="40" height="40"/>
  <text x="${textX + 54}" y="81" font-family="${FONT}" font-size="24" font-weight="800" fill="#ffffff">AI Usage Global</text>
  <rect x="${textX}" y="122" width="${chipWidth}" height="38" rx="19" fill="${c.accent}" fill-opacity="0.16" stroke="${c.accent}" stroke-opacity="0.6"/>
  <circle cx="${textX + 20}" cy="141" r="6" fill="${c.accent}"/>
  <text x="${textX + 34}" y="148" font-family="${FONT}" font-size="17" font-weight="800" fill="${c.soft}" letter-spacing="2">${escapeXml(topic.label)}</text>
  ${lines
    .map(
      (line, index) =>
        `<text x="${textX}" y="${Math.round(firstLineY + index * lineHeight)}" font-family="${FONT}" font-size="${fontSize}" font-weight="800" fill="#ffffff" letter-spacing="-1">${escapeXml(line)}</text>`,
    )
    .join("\n  ")}
  ${statPanel}
  <line x1="${textX}" y1="548" x2="1128" y2="548" stroke="#ffffff" stroke-opacity="0.14"/>
  <text x="${textX}" y="588" font-family="${FONT}" font-size="20" font-weight="700" fill="rgba(255,255,255,0.75)">aiusageglobal.pages.dev</text>
  <text x="1128" y="588" text-anchor="end" font-family="${FONT}" font-size="20" font-weight="600" fill="rgba(255,255,255,0.75)">${escapeXml(dateLabel || "Tracking the real cost of AI")}</text>
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
      const svg = getPostSvg({
        title: post.title,
        topicId: classifyTopic(post),
        stat: extractKeyStat(post.title),
        dateLabel: formatImageDate(post.publishedOn),
        logoDataUri,
      });

      await Promise.all([
        renderImage(svg, path.join(outputDir, `${post.slug}.png`), "png"),
        renderImage(svg, path.join(outputDir, `${post.slug}.webp`), "webp"),
      ]);
    }),
  );

  const siteSvg = getPostSvg({
    title: "Tracking the water, power and money behind AI",
    topicId: "datacenter",
    stat: null,
    dateLabel: "Updated daily",
    logoDataUri,
  });

  await renderImage(siteSvg, sharedOgPath, "png");
  await removeStaleImages(blogPosts.map((post) => post.slug));

  console.log(`Generated ${blogPosts.length} post image sets and shared social preview.`);
};

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  await generatePostImages();
}
