import fs from 'fs';
import path from 'path';

const domain = 'https://thepinkrealty.com';
const distPath = path.resolve('./dist');

async function generate() {
  let propertySlugs = [];
  const useMock = process.env.VITE_USE_MOCK === 'true';

  if (!useMock) {
    try {
      const res = await fetch('http://localhost:5000/api/properties?limit=1000');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          propertySlugs = data.data.properties.map(p => `/property/${p.slug}`);
        }
      } else {
        console.warn('API returned non-ok status for sitemap generation');
      }
    } catch (e) {
      console.warn('Could not fetch real properties for sitemap. Generating without properties.');
    }
  }

  const routes = [
    '',
    '/about-us',
    '/services',
    '/property-list',
    '/contact-us',
    ...propertySlugs
  ];

  if (process.env.SITE_ENV === 'staging' || process.env.VITE_SITE_ENV === 'staging') {
    const stagingRobots = `User-agent: *\nDisallow: /`;
    if (fs.existsSync(distPath)) {
      fs.writeFileSync(path.join(distPath, 'robots.txt'), stagingRobots);
      console.log('Staging mode: wrote blocking robots.txt and omitted sitemap.');
    }
    return;
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${domain}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`).join('\n')}
</urlset>`;

  const robotsTxt = `User-agent: *
Disallow: /admin
Allow: /

Sitemap: ${domain}/sitemap.xml`;

  if (fs.existsSync(distPath)) {
    fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemap);
    fs.writeFileSync(path.join(distPath, 'robots.txt'), robotsTxt);
    console.log('Sitemap and robots.txt generated successfully.');
  } else {
    console.error('dist directory not found.');
  }
}

generate();
