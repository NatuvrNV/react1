require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: ['@babel/plugin-transform-modules-commonjs'],
  ignore: [/node_modules/],
});

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');

// --------------------------------------------------
// Data
// --------------------------------------------------

// Blogs index
const blogsIndex = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, 'public/data/blogs-index.json'),
    'utf8'
  )
);

// Projects index
const projectsIndex = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, 'public/data/projects-index.json'),
    'utf8'
  )
);

// Products index
// NOTE:
// products-index.json is an OBJECT, not an ARRAY.
// Example:
// {
//   "metacoin": {...},
//   "metasequin": {...},
//   "metapyramid": {...}
// }
const productsIndex = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, 'public/data/products-index.json'),
    'utf8'
  )
);

// --------------------------------------------------
// Validate data
// --------------------------------------------------

if (!Array.isArray(blogsIndex)) {
  throw new Error(
    'blogs-index.json must contain an array at the root.'
  );
}

if (!Array.isArray(projectsIndex)) {
  throw new Error(
    'projects-index.json must contain an array at the root.'
  );
}

if (
  !productsIndex ||
  typeof productsIndex !== 'object' ||
  Array.isArray(productsIndex)
) {
  throw new Error(
    'products-index.json must contain an object with product slugs as keys.'
  );
}

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const getUrlFriendlyString = (str = '') =>
  String(str)
    .toLowerCase()
    .replace(/[:'&,?‘’]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

// --------------------------------------------------
// Static pages
// --------------------------------------------------

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
  '/metaform',
  '/metafunction',
  '/metaparametric',
  '/metasurface',
  '/ctb',
  '/build',
];

// --------------------------------------------------
// Blog pages
// --------------------------------------------------

const blogPages = blogsIndex.map((blog) => {
  const slug = blog.url
    ? getUrlFriendlyString(blog.url)
    : getUrlFriendlyString(blog.title);

  return `/blog/${slug}`;
});

// --------------------------------------------------
// Project pages
// --------------------------------------------------

const projectPages = projectsIndex.map((project) => {
  const slug = project.url
    ? getUrlFriendlyString(project.url)
    : getUrlFriendlyString(project.name);

  return `/all-projects/${slug}`;
});

// --------------------------------------------------
// Product pages
// --------------------------------------------------

// products-index.json is an OBJECT:
//
// {
//   "metacoin": {...},
//   "metasequin": {...},
//   "metapyramid": {...}
// }
//
// Therefore Object.keys() is used instead of .map().

const productPages = Object.keys(productsIndex).map((slug) => {
  return `/all-products/${getUrlFriendlyString(slug)}`;
});

// --------------------------------------------------
// All pages
// --------------------------------------------------

const allPages = [
  ...staticPages,
  ...blogPages,
  ...projectPages,
  ...productPages,
];

// Remove duplicate URLs
const uniquePages = [...new Set(allPages)];

// --------------------------------------------------
// Local static server
// --------------------------------------------------

function startServer() {
  return new Promise((resolve, reject) => {
    const buildDir = path.join(__dirname, 'build');

    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.avif': 'image/avif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff2': 'font/woff2',
      '.woff': 'font/woff',
      '.ttf': 'font/ttf',
      '.map': 'application/json',
    };

    const server = http.createServer((req, res) => {
      try {
        let urlPath = decodeURIComponent(
          (req.url || '/').split('?')[0]
        );

        // Remove trailing slash except homepage
        if (urlPath !== '/' && urlPath.endsWith('/')) {
          urlPath = urlPath.slice(0, -1);
        }

        // Normalize path
        urlPath = path.normalize(urlPath);

        // Prevent path traversal
        if (
          urlPath.includes('..') ||
          urlPath.startsWith('../') ||
          urlPath.startsWith('..\\')
        ) {
          res.writeHead(403, {
            'Content-Type': 'text/plain; charset=utf-8',
          });

          res.end('Forbidden');
          return;
        }

        const candidates = [
          path.join(buildDir, urlPath),
          path.join(buildDir, urlPath, 'index.html'),
          path.join(buildDir, `${urlPath}.html`),
          path.join(buildDir, 'index.html'),
        ];

        for (const filePath of candidates) {
          try {
            const stat = fs.statSync(filePath);

            if (stat.isFile()) {
              const ext = path.extname(filePath).toLowerCase();

              const mime =
                mimeTypes[ext] ||
                'application/octet-stream';

              res.writeHead(200, {
                'Content-Type': mime,
                'Cache-Control': 'no-cache',
              });

              fs.createReadStream(filePath).pipe(res);

              return;
            }
          } catch (error) {
            // File doesn't exist.
            // Try next candidate.
          }
        }

        res.writeHead(404, {
          'Content-Type': 'text/plain; charset=utf-8',
        });

        res.end('Not found');
      } catch (error) {
        console.error(
          '❌ Server request error:',
          error.message
        );

        if (!res.headersSent) {
          res.writeHead(500, {
            'Content-Type': 'text/plain; charset=utf-8',
          });
        }

        res.end('Internal server error');
      }
    });

    server.on('error', (error) => {
      console.error(
        '❌ Server error:',
        error.message
      );

      reject(error);
    });

    server.listen(
      45678,
      '127.0.0.1',
      () => {
        console.log(
          '✅ Server ready on port 45678'
        );

        resolve(server);
      }
    );
  });
}

// --------------------------------------------------
// Start System Chromium
// --------------------------------------------------

async function launchBrowser() {
  console.log('\n🚀 Starting System Chromium...');

  const chromiumPaths = [
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];

  const chromiumPath = chromiumPaths.find((browserPath) =>
    fs.existsSync(browserPath)
  );

  if (!chromiumPath) {
    throw new Error(
      'System Chromium not found. Checked:\n' +
        chromiumPaths.join('\n')
    );
  }

  console.log(
    `🌐 Chromium: ${chromiumPath}`
  );

  const launchOptions = {
    headless: 'new',

    executablePath: chromiumPath,

    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer',

      '--disable-extensions',

      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',

      '--disable-features=Translate,BackForwardCache',

      '--no-first-run',
      '--no-default-browser-check',

      '--disable-crash-reporter',
      '--disable-breakpad',
      '--disable-component-update',
    ],

    timeout: 120000,
  };

  console.log(
    '🚀 Launching Chromium...'
  );

  const browser =
    await puppeteer.launch(launchOptions);

  browser.on('disconnected', () => {
    console.error(
      '⚠️ Chromium disconnected.'
    );
  });

  console.log(
    '✅ Chromium started successfully\n'
  );

  return browser;
}

// --------------------------------------------------
// Get output path
// --------------------------------------------------

function getOutputPath(page) {
  const safePage = page
    .replace(/[:'&,?‘’]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  if (safePage === '/') {
    return path.join(
      __dirname,
      'build',
      'index.html'
    );
  }

  return path.join(
    __dirname,
    'build',
    ...safePage
      .split('/')
      .filter(Boolean),
    'index.html'
  );
}

// --------------------------------------------------
// Render one page
// --------------------------------------------------

async function renderPage(browser, page) {
  let tab = null;

  try {
    tab = await browser.newPage();

    // Desktop viewport
    await tab.setViewport({
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
    });

    tab.setDefaultNavigationTimeout(
      120000
    );

    tab.setDefaultTimeout(
      30000
    );

    // Ignore normal console messages
    tab.on('console', () => {});

    // React / JavaScript errors
    tab.on(
      'pageerror',
      (error) => {
        console.log(
          `⚠️ Page JS error on ${page}: ${error.message}`
        );
      }
    );

    tab.on(
      'error',
      (error) => {
        console.log(
          `⚠️ Page error on ${page}: ${error.message}`
        );
      }
    );

    const url =
      `http://127.0.0.1:45678${page}`;

    console.log(
      `🌐 Rendering: ${page}`
    );

    // ------------------------------------------------
    // Load page
    // ------------------------------------------------

    await tab.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 120000,
    });

    // ------------------------------------------------
    // Wait for React
    // ------------------------------------------------

    await tab.waitForFunction(
      () => {
        const root =
          document.getElementById('root');

        return (
          root &&
          root.children &&
          root.children.length > 0
        );
      },
      {
        timeout: 30000,
      }
    );

    // ------------------------------------------------
    // Give React time to finish rendering
    // ------------------------------------------------

    await new Promise(
      (resolve) =>
        setTimeout(resolve, 700)
    );

    // ------------------------------------------------
    // Get HTML
    // ------------------------------------------------

    const html =
      await tab.content();

    if (
      !html ||
      html.length < 500
    ) {
      throw new Error(
        'Generated HTML is unexpectedly small'
      );
    }

    // ------------------------------------------------
    // Save HTML
    // ------------------------------------------------

    const filePath =
      getOutputPath(page);

    fs.mkdirSync(
      path.dirname(filePath),
      {
        recursive: true,
      }
    );

    fs.writeFileSync(
      filePath,
      html,
      'utf8'
    );

    return true;
  } finally {
    // ALWAYS close tab
    if (tab) {
      try {
        await tab.close();
      } catch (error) {
        // Browser may already be disconnected
      }
    }
  }
}

// --------------------------------------------------
// Main prerender
// --------------------------------------------------

async function prerender() {
  console.log(
    '\n📋 Pages breakdown:'
  );

  console.log(
    `   Static  : ${staticPages.length}`
  );

  console.log(
    `   Blogs   : ${blogPages.length}`
  );

  console.log(
    `   Projects: ${projectPages.length}`
  );

  console.log(
    `   Products: ${productPages.length}`
  );

  console.log(
    `   Total   : ${uniquePages.length}\n`
  );

  console.log(
    `🚀 Pre-rendering ${uniquePages.length} pages...\n`
  );

  let server = null;
  let browser = null;

  let success = 0;
  let failed = 0;

  const failedPages = [];

  try {
    // ------------------------------------------------
    // Start local server
    // ------------------------------------------------

    server =
      await startServer();

    // ------------------------------------------------
    // Start Chromium
    // ------------------------------------------------

    browser =
      await launchBrowser();

    // ------------------------------------------------
    // Render pages ONE BY ONE
    // ------------------------------------------------

    for (
      let i = 0;
      i < uniquePages.length;
      i++
    ) {
      const page =
        uniquePages[i];

      console.log(
        `\n[${i + 1}/${uniquePages.length}] ${page}`
      );

      let rendered = false;

      // ----------------------------------------------
      // Retry each page twice
      // ----------------------------------------------

      for (
        let attempt = 1;
        attempt <= 2;
        attempt++
      ) {
        try {
          // ------------------------------------------
          // Check browser
          // ------------------------------------------

          if (
            !browser ||
            !browser.isConnected()
          ) {
            console.log(
              '⚠️ Browser disconnected. Restarting Chromium...'
            );

            try {
              if (browser) {
                await browser.close();
              }
            } catch (error) {}

            browser =
              await launchBrowser();
          }

          // ------------------------------------------
          // Render
          // ------------------------------------------

          await renderPage(
            browser,
            page
          );

          console.log(
            `✅ ${page}`
          );

          success++;
          rendered = true;

          break;
        } catch (error) {
          console.error(
            `❌ Attempt ${attempt}/2 failed: ${page}`
          );

          console.error(
            `   ${error.message}`
          );

          // ------------------------------------------
          // Retry delay
          // ------------------------------------------

          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                1500
              )
          );

          // ------------------------------------------
          // Restart browser if disconnected
          // ------------------------------------------

          if (
            browser &&
            !browser.isConnected()
          ) {
            try {
              await browser.close();
            } catch (error) {}

            try {
              browser =
                await launchBrowser();
            } catch (error) {
              console.error(
                '❌ Could not restart Chromium:',
                error.message
              );
            }
          }
        }
      }

      // --------------------------------------------
      // Final failure
      // --------------------------------------------

      if (!rendered) {
        failed++;

        failedPages.push(
          page
        );

        console.error(
          `❌ FINAL FAILURE: ${page}`
        );
      }

      // --------------------------------------------
      // Small delay every page
      // Helps server stability
      // --------------------------------------------

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            100
          )
      );
    }
  } catch (error) {
    console.error(
      '\n❌ Fatal prerender error:'
    );

    console.error(
      error
    );
  } finally {
    // ------------------------------------------------
    // Close browser
    // ------------------------------------------------

    if (browser) {
      try {
        await browser.close();
      } catch (error) {}
    }

    // ------------------------------------------------
    // Close local server
    // ------------------------------------------------

    if (server) {
      try {
        await new Promise(
          (resolve) => {
            server.close(
              () => resolve()
            );
          }
        );
      } catch (error) {}
    }
  }

  // --------------------------------------------------
  // Final report
  // --------------------------------------------------

  console.log(
    '\n========================================'
  );

  console.log(
    '🎉 PRERENDER COMPLETE'
  );

  console.log(
    '========================================'
  );

  console.log(
    `✅ Success : ${success}`
  );

  console.log(
    `❌ Failed  : ${failed}`
  );

  console.log(
    `📄 Total   : ${uniquePages.length}`
  );

  if (
    failedPages.length > 0
  ) {
    console.log(
      '\n❌ Failed pages:'
    );

    failedPages.forEach(
      (page) => {
        console.log(
          `   - ${page}`
        );
      }
    );
  }

  console.log(
    '========================================\n'
  );

  // Don't fail npm build because
  // some individual pages failed
  process.exitCode = 0;
}

// --------------------------------------------------
// Run
// --------------------------------------------------

prerender().catch(
  (error) => {
    console.error(
      '\n❌ Fatal error:'
    );

    console.error(
      error
    );

    process.exit(1);
  }
);