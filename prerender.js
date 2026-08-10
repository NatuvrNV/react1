require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: ['@babel/plugin-transform-modules-commonjs'],
  ignore: [/node_modules/],
});

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');

// ─────────────────────────────────────────────────────────────
// Load source modules defensively so a bad export name fails
// with a clear message instead of "Cannot read properties of undefined"
// ─────────────────────────────────────────────────────────────
const blogConstants = require('./src/pages/Blog/BlogConstants');
const mainConstants = require('./src/utils/constants');

console.log('\n🔍 Debug — keys found in ./src/pages/Blog/BlogConstants:');
console.log('  ', Object.keys(blogConstants));
console.log('🔍 Debug — keys found in ./src/utils/constants:');
console.log('  ', Object.keys(mainConstants));
console.log('');

// Try the expected export name first, then common alternate casings,
// then fall back to the default export if the file uses `export default`.
function resolveExport(moduleObj, moduleLabel, ...possibleNames) {
  for (const name of possibleNames) {
    if (Array.isArray(moduleObj[name])) {
      console.log(`✅ ${moduleLabel}: using export "${name}" (${moduleObj[name].length} items)`);
      return moduleObj[name];
    }
  }
  if (Array.isArray(moduleObj.default)) {
    console.log(`✅ ${moduleLabel}: using "default" export (${moduleObj.default.length} items)`);
    return moduleObj.default;
  }
  console.error(
    `❌ ${moduleLabel}: none of these exports were found as arrays: [${possibleNames.join(', ')}, default]`
  );
  console.error(`   Available keys were: [${Object.keys(moduleObj).join(', ')}]`);
  console.error(`   Fix: open the source file and confirm the exact export name, then update this script.`);
  return [];
}

const SingleBlogDetail = resolveExport(
  blogConstants,
  'BlogConstants.js',
  'SingleBlogDetail',
  'SingleBlogDetails',
  'BlogDetail'
);

const SingleprojectDetail = resolveExport(
  mainConstants,
  'constants.js (projects)',
  'SingleprojectDetail',
  'SingleProjectDetail',
  'SingleProjectDetails'
);

const SingleProductDetail = resolveExport(
  mainConstants,
  'constants.js (products)',
  'SingleProductDetail',
  'SingleProductDetails',
  'SingleproductDetail'
);

// Hard stop if everything is empty — no point launching Puppeteer
if (
  SingleBlogDetail.length === 0 &&
  SingleprojectDetail.length === 0 &&
  SingleProductDetail.length === 0
) {
  console.error('\n🛑 All three data sources resolved empty. Fix the export names above before continuing.\n');
  process.exit(1);
}

const getUrlFriendlyString = (str) =>
  str
    .toLowerCase()
    .replace(/[:'&,?''\u2018\u2019]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

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

// ✅ Projects — item.url directly use karo
const projectPages = SingleprojectDetail.map((project) => {
  const slug = project.url
    ? getUrlFriendlyString(project.url)
    : getUrlFriendlyString(project.name);
  return `/all-projects/${slug}`;
});

// ✅ Products — item.name.toLowerCase() use karo (SingleProduct.js: item.name.toLowerCase() === productName)
const productPages = SingleProductDetail.map((product) => {
  const slug = product.name.toLowerCase();
  return `/all-products/${slug}`;
});

const allPages = [...staticPages, ...blogPages, ...projectPages, ...productPages];

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
    executablePath: '/usr/bin/chromium-browser',
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