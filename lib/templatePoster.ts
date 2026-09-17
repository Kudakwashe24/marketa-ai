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

function normalizeHex(value: string, fallback: string) {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
}

function getContrastColor(hex: string) {
  const normalized = normalizeHex(hex, "#0f172a").slice(1);
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;
  return luminance > 155 ? "#0f172a" : "#ffffff";
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

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
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
  const visibleLines = lines.slice(0, maxLines);

  if (lines.length > maxLines) {
    let finalLine = visibleLines[maxLines - 1];
    while (ctx.measureText(`${finalLine}…`).width > maxWidth && finalLine) {
      finalLine = finalLine.slice(0, -1).trimEnd();
    }
    visibleLines[maxLines - 1] = `${finalLine}…`;
  }

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
    roundedRect(ctx, 68, 62, 330, 120, 24);
    ctx.fill();
    drawImageContain(ctx, logo, 92, 78, 282, 88);
  } else {
    ctx.fillStyle = foreground;
    ctx.font = "700 32px Arial, sans-serif";
    ctx.fillText(data.businessName, 72, 125);
  }

  ctx.textAlign = "right";
  ctx.fillStyle = foreground;
  ctx.globalAlpha = 0.82;
  ctx.font = "600 24px Arial, sans-serif";
  ctx.fillText(data.businessType.toUpperCase(), 1008, 122);
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
  ctx.font = "600 24px Arial, sans-serif";
  ctx.fillText(contact || data.location || data.businessName, 72, 1000);

  if (data.watermark) {
    ctx.textAlign = "right";
    ctx.globalAlpha = 0.65;
    ctx.font = "500 19px Arial, sans-serif";
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
  const visibleText = text.slice(0, 38);
  ctx.font = "700 27px Arial, sans-serif";
  const width = Math.min(ctx.measureText(visibleText).width + 62, 560);
  ctx.fillStyle = background;
  roundedRect(ctx, x, y, width, 70, 35);
  ctx.fill();
  ctx.fillStyle = foreground;
  ctx.fillText(visibleText, x + 31, y + 45);
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
  ctx.font = "800 84px Arial, sans-serif";
  const nextY = drawWrappedText(ctx, data.headline, 72, 350, 900, 94, 3);
  ctx.globalAlpha = 0.9;
  ctx.font = "400 31px Arial, sans-serif";
  const supportY = drawWrappedText(
    ctx,
    data.supportingText,
    76,
    nextY + 34,
    820,
    43,
    3
  );
  ctx.globalAlpha = 1;
  drawCta(ctx, data.cta, 72, Math.min(supportY + 36, 855), "#ffffff", secondary);
  drawFooter(ctx, data, "#ffffff");
}

function drawCleanTemplate(
  ctx: CanvasRenderingContext2D,
  data: TemplatePosterData,
  logo: HTMLImageElement | null
) {
  const primary = normalizeHex(data.primaryColor, "#4f46e5");
  const secondary = normalizeHex(data.secondaryColor, "#0f172a");
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = primary;
  ctx.fillRect(0, 0, 30, SIZE);
  ctx.fillStyle = hexToRgba(primary, 0.1);
  ctx.beginPath();
  ctx.arc(980, 105, 260, 0, Math.PI * 2);
  ctx.fill();

  drawBrandHeader(ctx, data, logo, secondary, "#ffffff");
  ctx.fillStyle = primary;
  roundedRect(ctx, 72, 242, 150, 12, 6);
  ctx.fill();

  ctx.fillStyle = secondary;
  ctx.font = "800 82px Arial, sans-serif";
  const nextY = drawWrappedText(ctx, data.headline, 72, 355, 900, 92, 3);
  ctx.fillStyle = "#475569";
  ctx.font = "400 31px Arial, sans-serif";
  const supportY = drawWrappedText(
    ctx,
    data.supportingText,
    76,
    nextY + 32,
    820,
    43,
    3
  );
  drawCta(
    ctx,
    data.cta,
    72,
    Math.min(supportY + 38, 855),
    primary,
    getContrastColor(primary)
  );
  drawFooter(ctx, data, secondary);
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
  ctx.font = "800 82px Arial, sans-serif";
  const nextY = drawWrappedText(ctx, data.headline, 72, 430, 900, 92, 3);
  ctx.globalAlpha = 0.92;
  ctx.font = "400 30px Arial, sans-serif";
  const supportY = drawWrappedText(
    ctx,
    data.supportingText,
    76,
    nextY + 28,
    820,
    42,
    3
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
