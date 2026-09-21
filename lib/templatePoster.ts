export type PosterTemplate = "bold" | "clean" | "photo";

export type TemplatePosterData = {
  template: PosterTemplate;
  businessName: string;
  businessType: string;
  headline: string;
  supportingText: string;
  cta: string;
  phone: string;
  instagram: string;
  website: string;
  location: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  brandImageUrl: string;
  watermark: boolean;
};

const SIZE = 1080;
const FONT_FAMILY = "Arial, sans-serif";

function normalizeHex(value: string, fallback: string) {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
}

function getRgb(hex: string) {
  const normalized = normalizeHex(hex, "#0f172a").slice(1);
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  return { red, green, blue };
}

function getRelativeLuminance(hex: string) {
  const { red, green, blue } = getRgb(hex);
  const channels = [red, green, blue].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function getContrastRatio(first: string, second: string) {
  const firstLuminance = getRelativeLuminance(first);
  const secondLuminance = getRelativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function getContrastColor(background: string) {
  return getContrastRatio(background, "#ffffff") >=
    getContrastRatio(background, "#0f172a")
    ? "#ffffff"
    : "#0f172a";
}

function getReadableColor(
  preferred: string,
  background: string,
  fallback = "#0f172a"
) {
  const normalizedPreferred = normalizeHex(preferred, fallback);
  return getContrastRatio(normalizedPreferred, background) >= 4.5
    ? normalizedPreferred
    : fallback;
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = normalizeHex(hex, "#4f46e5").slice(1);
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

function getWrappedLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !currentLine) {
      currentLine = candidate;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

function fitTextToWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxFontSize: number,
  minFontSize: number,
  weight: number
) {
  let fontSize = maxFontSize;
  let visibleText = text.trim();

  while (fontSize > minFontSize) {
    ctx.font = `${weight} ${fontSize}px ${FONT_FAMILY}`;
    if (ctx.measureText(visibleText).width <= maxWidth) break;
    fontSize -= 2;
  }

  ctx.font = `${weight} ${fontSize}px ${FONT_FAMILY}`;
  while (ctx.measureText(visibleText).width > maxWidth && visibleText) {
    visibleText = visibleText.slice(0, -1).trimEnd();
  }

  if (visibleText !== text.trim()) {
    while (ctx.measureText(`${visibleText}…`).width > maxWidth && visibleText) {
      visibleText = visibleText.slice(0, -1).trimEnd();
    }
    visibleText = `${visibleText}…`;
  }

  return {
    fontSize,
    text: visibleText,
    width: ctx.measureText(visibleText).width,
  };
}

function drawFittedSingleLineText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  maxFontSize: number,
  minFontSize: number,
  weight: number
) {
  const fitted = fitTextToWidth(
    ctx,
    text,
    maxWidth,
    maxFontSize,
    minFontSize,
    weight
  );
  ctx.fillText(fitted.text, x, y);
  return fitted.width;
}

function drawFittedWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  maxLines: number,
  maxFontSize: number,
  minFontSize: number,
  weight: number,
  lineHeightRatio = 1.12
) {
  let fontSize = maxFontSize;
  let lines: string[] = [];

  while (fontSize >= minFontSize) {
    ctx.font = `${weight} ${fontSize}px ${FONT_FAMILY}`;
    lines = getWrappedLines(ctx, text, maxWidth);
    if (lines.length <= maxLines || fontSize === minFontSize) break;
    fontSize = Math.max(fontSize - 2, minFontSize);
  }

  const visibleLines = lines.slice(0, maxLines);

  if (lines.length > maxLines) {
    let finalLine = visibleLines[maxLines - 1];
    while (ctx.measureText(`${finalLine}…`).width > maxWidth && finalLine) {
      finalLine = finalLine.slice(0, -1).trimEnd();
    }
    visibleLines[maxLines - 1] = `${finalLine}…`;
  }

  const lineHeight = Math.round(fontSize * lineHeightRatio);
  visibleLines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });

  return y + visibleLines.length * lineHeight;
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = url;
  });
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;
  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height
  );
}

function drawImageContain(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  ctx.drawImage(
    image,
    x + (width - drawWidth) / 2,
    y + (height - drawHeight) / 2,
    drawWidth,
    drawHeight
  );
}

function drawBrandHeader(
  ctx: CanvasRenderingContext2D,
  data: TemplatePosterData,
  logo: HTMLImageElement | null,
  foreground: string,
  badgeBackground: string
) {
  if (logo) {
    ctx.fillStyle = badgeBackground;
    roundedRect(ctx, 68, 58, 356, 128, 24);
    ctx.fill();
    drawImageContain(ctx, logo, 88, 73, 316, 98);
  } else {
    ctx.fillStyle = foreground;
    drawFittedSingleLineText(
      ctx,
      data.businessName,
      72,
      125,
      470,
      32,
      22,
      700
    );
  }

  ctx.textAlign = "right";
  ctx.fillStyle = foreground;
  ctx.globalAlpha = 0.82;
  drawFittedSingleLineText(
    ctx,
    data.businessType.toUpperCase(),
    1008,
    122,
    logo ? 520 : 420,
    24,
    18,
    600
  );
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";
}

function drawFooter(
  ctx: CanvasRenderingContext2D,
  data: TemplatePosterData,
  foreground: string
) {
  const contact = [data.phone, data.instagram, data.website]
    .filter(Boolean)
    .slice(0, 2)
    .join("  •  ");

  ctx.fillStyle = foreground;
  drawFittedSingleLineText(
    ctx,
    contact || data.location || data.businessName,
    72,
    1000,
    data.watermark ? 650 : 936,
    24,
    17,
    600
  );

  if (data.watermark) {
    ctx.textAlign = "right";
    ctx.globalAlpha = 0.65;
    ctx.font = `500 19px ${FONT_FAMILY}`;
    ctx.fillText("Made with Marketa AI", 1008, 1000);
    ctx.globalAlpha = 1;
    ctx.textAlign = "left";
  }
}

function drawCta(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  background: string,
  foreground: string
) {
  const fitted = fitTextToWidth(ctx, text, 480, 27, 20, 700);
  const width = Math.min(fitted.width + 62, 560);
  ctx.fillStyle = background;
  roundedRect(ctx, x, y, width, 70, 35);
  ctx.fill();
  ctx.fillStyle = foreground;
  ctx.font = `700 ${fitted.fontSize}px ${FONT_FAMILY}`;
  ctx.fillText(fitted.text, x + 31, y + 45);
}

function drawBoldTemplate(
  ctx: CanvasRenderingContext2D,
  data: TemplatePosterData,
  logo: HTMLImageElement | null
) {
  const primary = normalizeHex(data.primaryColor, "#4f46e5");
  const secondary = normalizeHex(data.secondaryColor, "#0f172a");
  const gradient = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  gradient.addColorStop(0, primary);
  gradient.addColorStop(1, secondary);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SIZE, SIZE);

  ctx.fillStyle = "rgba(15, 23, 42, 0.28)";
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = "rgba(255, 255, 255, 0.10)";
  ctx.beginPath();
  ctx.arc(995, 230, 245, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(80, 915, 190, 0, Math.PI * 2);
  ctx.fill();

  drawBrandHeader(ctx, data, logo, "#ffffff", "rgba(255,255,255,0.94)");

  ctx.fillStyle = "#ffffff";
  const nextY = drawFittedWrappedText(
    ctx,
    data.headline,
    72,
    350,
    900,
    3,
    84,
    58,
    800,
    1.08
  );
  ctx.globalAlpha = 0.9;
  const supportY = drawFittedWrappedText(
    ctx,
    data.supportingText,
    76,
    nextY + 34,
    820,
    3,
    31,
    25,
    400,
    1.38
  );
  ctx.globalAlpha = 1;
  drawCta(
    ctx,
    data.cta,
    72,
    Math.min(supportY + 36, 855),
    "#ffffff",
    getReadableColor(secondary, "#ffffff")
  );
  drawFooter(ctx, data, "#ffffff");
}

function drawCleanTemplate(
  ctx: CanvasRenderingContext2D,
  data: TemplatePosterData,
  logo: HTMLImageElement | null
) {
  const primary = normalizeHex(data.primaryColor, "#4f46e5");
  const secondary = normalizeHex(data.secondaryColor, "#0f172a");
  const background = "#f8fafc";
  const headlineColor = getReadableColor(secondary, background);
  const headerColor = getReadableColor(primary, background, headlineColor);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = primary;
  ctx.fillRect(0, 0, 30, SIZE);
  ctx.fillStyle = hexToRgba(primary, 0.1);
  ctx.beginPath();
  ctx.arc(980, 105, 260, 0, Math.PI * 2);
  ctx.fill();

  drawBrandHeader(ctx, data, logo, headerColor, "#ffffff");
  ctx.fillStyle = primary;
  roundedRect(ctx, 72, 242, 150, 12, 6);
  ctx.fill();

  ctx.fillStyle = headlineColor;
  const nextY = drawFittedWrappedText(
    ctx,
    data.headline,
    72,
    355,
    900,
    3,
    82,
    56,
    800,
    1.08
  );
  ctx.fillStyle = "#475569";
  const supportY = drawFittedWrappedText(
    ctx,
    data.supportingText,
    76,
    nextY + 32,
    820,
    3,
    31,
    25,
    400,
    1.38
  );
  drawCta(
    ctx,
    data.cta,
    72,
    Math.min(supportY + 38, 855),
    primary,
    getContrastColor(primary)
  );
  drawFooter(ctx, data, headlineColor);
}

function drawPhotoTemplate(
  ctx: CanvasRenderingContext2D,
  data: TemplatePosterData,
  logo: HTMLImageElement | null,
  photo: HTMLImageElement
) {
  const primary = normalizeHex(data.primaryColor, "#4f46e5");
  drawImageCover(ctx, photo, 0, 0, SIZE, SIZE);
  const overlay = ctx.createLinearGradient(0, 0, 0, SIZE);
  overlay.addColorStop(0, "rgba(15, 23, 42, 0.28)");
  overlay.addColorStop(0.45, "rgba(15, 23, 42, 0.52)");
  overlay.addColorStop(1, "rgba(15, 23, 42, 0.94)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = hexToRgba(primary, 0.65);
  ctx.fillRect(0, 0, 24, SIZE);

  drawBrandHeader(ctx, data, logo, "#ffffff", "rgba(255,255,255,0.94)");
  ctx.fillStyle = "#ffffff";
  const nextY = drawFittedWrappedText(
    ctx,
    data.headline,
    72,
    430,
    900,
    3,
    82,
    56,
    800,
    1.08
  );
  ctx.globalAlpha = 0.92;
  const supportY = drawFittedWrappedText(
    ctx,
    data.supportingText,
    76,
    nextY + 28,
    820,
    3,
    30,
    24,
    400,
    1.4
  );
  ctx.globalAlpha = 1;
  drawCta(
    ctx,
    data.cta,
    72,
    Math.min(supportY + 34, 855),
    primary,
    getContrastColor(primary)
  );
  drawFooter(ctx, data, "#ffffff");
}

export async function renderTemplatePoster(data: TemplatePosterData) {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Your browser could not create the poster.");

  const [logo, photo] = await Promise.all([
    loadImage(data.logoUrl),
    loadImage(data.brandImageUrl),
  ]);

  if (data.template === "clean") {
    drawCleanTemplate(ctx, data, logo);
  } else if (data.template === "photo" && photo) {
    drawPhotoTemplate(ctx, data, logo, photo);
  } else {
    drawBoldTemplate(ctx, data, logo);
  }

  return canvas.toDataURL("image/png", 0.96);
}
