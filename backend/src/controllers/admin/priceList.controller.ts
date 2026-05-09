import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { findAllMenuWithCategories } from '../../repositories/menu.repository';

const LOGO_PATH = path.join(__dirname, '../../assets/logo.png');

let logoBase64: string | null = null;
try {
  const logoBuffer = fs.readFileSync(LOGO_PATH);
  logoBase64 = logoBuffer.toString('base64');
} catch {
  console.warn('[priceList] Logo not found at', LOGO_PATH, '— generating without logo');
}

const LINE_HEIGHT = 28;
const CATEGORY_HEIGHT = 44;
const HEADER_HEIGHT = 120;
const PADDING = 40;
const WIDTH = 800;
const LOGO_SIZE = 60;

function buildSvg(
  categories: Array<{ name: string; items: Array<{ name: string; price: number; available: boolean }> }>
): string {
  const visibleCategories = categories.map((c) => ({
    ...c,
    items: c.items.filter((i) => i.available && i.price > 0),
  })).filter((c) => c.items.length > 0);

  let contentHeight = HEADER_HEIGHT + PADDING;
  for (const cat of visibleCategories) {
    contentHeight += CATEGORY_HEIGHT + cat.items.length * LINE_HEIGHT + 16;
  }
  contentHeight += PADDING;

  const height = Math.max(contentHeight, 400);

  let rows = '';
  let y = HEADER_HEIGHT + PADDING;

  for (const cat of visibleCategories) {
    rows += `
      <rect x="${PADDING}" y="${y}" width="${WIDTH - PADDING * 2}" height="${CATEGORY_HEIGHT - 4}" rx="6" fill="#f5f0e8"/>
      <text x="${PADDING + 16}" y="${y + 28}" font-family="sans-serif" font-size="18" font-weight="bold" fill="#5c3a1e">${escapeXml(cat.name)}</text>
    `;
    y += CATEGORY_HEIGHT;

    for (const item of cat.items) {
      const priceStr = `$${item.price.toLocaleString('es-AR')}`;
      rows += `
        <text x="${PADDING + 16}" y="${y + 18}" font-family="sans-serif" font-size="15" fill="#333">${escapeXml(item.name)}</text>
        <text x="${WIDTH - PADDING - 8}" y="${y + 18}" font-family="sans-serif" font-size="15" font-weight="bold" fill="#5c3a1e" text-anchor="end">${priceStr}</text>
        <line x1="${PADDING + 8}" y1="${y + 24}" x2="${WIDTH - PADDING - 8}" y2="${y + 24}" stroke="#e0d8cc" stroke-width="1"/>
      `;
      y += LINE_HEIGHT;
    }
    y += 16;
  }

  const logoImg = logoBase64
    ? `<image href="data:image/png;base64,${logoBase64}" x="${PADDING}" y="20" width="${LOGO_SIZE}" height="${LOGO_SIZE}"/>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${height}">
    <rect width="${WIDTH}" height="${height}" fill="#fffdf8"/>
    ${logoImg}
    <text x="${WIDTH / 2}" y="52" font-family="sans-serif" font-size="28" font-weight="bold" fill="#5c3a1e" text-anchor="middle">La Olla</text>
    <text x="${WIDTH / 2}" y="80" font-family="sans-serif" font-size="16" fill="#888" text-anchor="middle">Lista de Precios</text>
    <line x1="${PADDING}" y1="${HEADER_HEIGHT - 10}" x2="${WIDTH - PADDING}" y2="${HEADER_HEIGHT - 10}" stroke="#d4c5a9" stroke-width="2"/>
    ${rows}
  </svg>`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function generatePriceListImage(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await findAllMenuWithCategories();
    const svg = buildSvg(categories);
    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="price-list.png"');
    res.send(pngBuffer);
  } catch (err) {
    next(err);
  }
}
