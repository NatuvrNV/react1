const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');

const { SingleBlogDetail } = require('./src/pages/Blog/BlogConstants');
const { SingleprojectDetail, SingleProductDetail } = require('./src/utils/constants');

// ── URL helpers ───────────────────────────────────────────────────────────────
const getUrlFriendlyString = (str) =>
  str
    .toLowerCase()
    .replace(/[:'&,?''\u2018\u2019]/g, '')  // remove special/Windows-invalid chars
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')                     // collapse multiple dashes
    .trim();

// ── Pages ─────────────────────────────────────────────────────────────────────
const staticPages = [
  '/',
  '/about',
  '/all-products',
  '/all-projects',
  '/blogs',
  '/contact',
  '/partner',
  '/privacy-policy',
  '/terms-conditions',
];

const blogPages = SingleBlogDetail.map((blog) => {
  const slug = blog.url
    ? getUrlFriendlyString(blog.url)
    : getUrlFriendlyString(blog.title);
  return `/blog/${slug}`;
});

const projectPages = SingleprojectDetail.map((project) => {
  const slug = project.url
    ? getUrlFriendlyString(project.url)
    : getUrlFriendlyString(project.name);
  return `/all-projects/${slug}`;
});

const productPages = SingleProductDetail.map((product) => {
  const slug = product.url
    ? getUrlFriendlyString(product.url)
    : getUrlFriendlyString(product.name);
  return `/all-products/${slug}`;
});

const allPages = [...staticPages, ...blogPages, ...projectPages, ...productPages];

// ── Pure Node.js static file server ──────────────────────────────────────────
function startServer() {
  return new Promise((resolve) => {
    const buildDir = path.join(__dirname, 'build');

    const server = http.createServer((req, res) => {
      let urlPath = decodeURIComponent(req.url.split('?')[0]);

      if (urlPath !== '/' && urlPath.endsWith('/')) {
        urlPath = urlPath.slice(0, -1);
      }

      const candidates = [
        path.join(buildDir, urlPath),
        path.join(buildDir, urlPath, 'index.html'),
        path.join(buildDir, urlPath + '.html'),
        path.join(buildDir, 'index.html'),
      ];

      const mimeTypes = {
        '.html': 'text/html',
        '.js':   'application/javascript',
        '.css':  'text/css',
        '.json': 'application/json',
        '.png':  'image/png',
        '.jpg':  'image/jpeg',
        '.webp': 'image/webp',
        '.svg':  'image/svg+xml',
        '.ico':  'image/x-icon',
        '.woff2':'font/woff2',
        '.woff': 'font/woff',
        '.ttf':  'font/ttf',
      };

      for (const filePath of candidates) {
        try {
          const stat = fs.statSync(filePath);
          if (stat.isFile()) {
            const ext = path.extname(filePath);
            const mime = mimeTypes[ext] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': mime });
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        } catch (e) {}
      }

      res.writeHead(404);
      res.end('Not found');
    });

    server.listen(45678, '127.0.0.1', () => {
      console.log('✅ Server ready on port 45678');
      resolve(server);
    });

    server.on('error', (err) => {
      console.error('❌ Server error:', err.message);
      process.exit(1);
    });
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function prerender() {
  console.log(`\n📋 Pages breakdown:`);
  console.log(`   Static  : ${staticPages.length}`);
  console.log(`   Blogs   : ${blogPages.length}`);
  console.log(`   Projects: ${projectPages.length}`);
  console.log(`   Products: ${productPages.length}`);
  console.log(`   Total   : ${allPages.length}\n`);
  console.log(`🚀 Pre-rendering ${allPages.length} pages...\n`);

  const server = await startServer();

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  let success = 0;
  let failed = 0;

  for (const page of allPages) {
    try {
      const tab = await browser.newPage();

      tab.on('console', () => {});
      tab.on('pageerror', () => {});

      await tab.goto(`http://127.0.0.1:45678${page}`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      await tab.waitForFunction(
        () => document.getElementById('root') &&
              document.getElementById('root').children.length > 0,
        { timeout: 10000 }
      );

      const html = await tab.content();

      // Sanitize path for Windows filesystem
      const safePage = page
        .replace(/[:'&,?''\u2018\u2019]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      const filePath =
        safePage === '/'
          ? path.join('build', 'index.html')
          : path.join('build', ...safePage.split('/').filter(Boolean), 'index.html');

      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, html, 'utf8');

      console.log(`✅ ${page}`);
      success++;

      await tab.close();
    } catch (err) {
      console.error(`❌ ${page} — ${err.message}`);
      failed++;
    }
  }

  await browser.close();
  server.close();

  console.log(`\n🎉 Done!  ✅ ${success} success   ❌ ${failed} failed`);
  process.exit(0);
}

prerender().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});