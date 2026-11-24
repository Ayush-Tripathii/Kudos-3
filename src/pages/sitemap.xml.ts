import type { APIRoute } from 'astro';
import { SITE_URL } from '../config';

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <image:image><image:loc>${SITE_URL}/img/kudos-terrace-palace-table-4x5-1600.jpg</image:loc></image:image>
    <image:image><image:loc>${SITE_URL}/img/og-kudos-1200x630.jpg</image:loc></image:image>
  </url>
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
