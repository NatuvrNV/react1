require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: ["@babel/plugin-transform-modules-commonjs"],
  ignore: [/node_modules/],
});

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const http = require("http");

const { SingleBlogDetail } = require("./src/pages/Blog/BlogConstants");

// ============================================================
// READ PROJECT / PRODUCT INDEX FILES
// ============================================================

const projectsIndex = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "public/data/projects-index.json"),
    "utf8"
  )
);

const productsIndex = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "public/data/products-index.json"),
    "utf8"
  )
);

// ============================================================
// SLUG HELPER
// ============================================================

const getUrlFriendlyString = (str) =>
  String(str)
    .toLowerCase()
    .replace(/[:'&,?‘’]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

// ============================================================
// STATIC PAGES
// ============================================================

const staticPages = [
  "/",
  "/about",
  "/all-products",
  "/all-projects",
  "/blogs",
  "/contact",
  "/partner",
  "/privacy-policy",
  "/terms-conditions",
];

// ============================================================
// BLOG PAGES
// ============================================================

const blogPages = SingleBlogDetail.map((blog) => {
  const slug = blog.url
    ? getUrlFriendlyString(blog.url)
    : getUrlFriendlyString(blog.title);

  return `/blog/${slug}`;
});

// ============================================================
// PROJECT PAGES
// ============================================================

const projectPages = projectsIndex.map((project) => {
  const slug = project.url
    ? getUrlFriendlyString(project.url)
    : getUrlFriendlyString(project.name);

  return `/all-projects/${slug}`;
});

// ============================================================
// PRODUCT PAGES
// ============================================================

const productPages = productsIndex.map((product) => {
  const slug = String(product.name).toLowerCase();

  return `/all-products/${slug}`;
});

// ============================================================
// ALL PAGES
// ============================================================

const allPages = [
  ...staticPages,
  ...blogPages,
  ...projectPages,
  ...productPages,
];

// ============================================================
// START LOCAL SERVER
// ============================================================

function startServer() {
  return new Promise((resolve, reject) => {
    const buildDir = path.join(__dirname, "build");

    const mimeTypes = {
      ".html": "text/html; charset=utf-8",
      ".js": "application/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon",
      ".woff2": "font/woff2",
      ".woff": "font/woff",
      ".ttf": "font/ttf",
      ".avif": "image/avif",
    };

    const server = http.createServer((req, res) => {
      try {
        let urlPath = decodeURIComponent(
          (req.url || "/").split("?")[0]
        );

        if (!urlPath.startsWith("/")) {
          urlPath = `/${urlPath}`;
        }

        if (urlPath !== "/" && urlPath.endsWith("/")) {
          urlPath = urlPath.slice(0, -1);
        }

        // ----------------------------------------------------
        // Prevent path traversal
        // ----------------------------------------------------

        const normalizedPath = path.normalize(urlPath);

        if (
          normalizedPath.includes("..") ||
          normalizedPath.includes("\\")
        ) {
          res.writeHead(400);
          res.end("Bad Request");
          return;
        }

        // ----------------------------------------------------
        // Try actual files first
        // ----------------------------------------------------

        const candidates = [
          path.join(buildDir, urlPath),
          path.join(buildDir, urlPath, "index.html"),
          path.join(buildDir, `${urlPath}.html`),
        ];

        for (const filePath of candidates) {
          try {
            const stat = fs.statSync(filePath);

            if (stat.isFile()) {
              const ext = path
                .extname(filePath)
                .toLowerCase();

              const mime =
                mimeTypes[ext] ||
                "application/octet-stream";

              res.writeHead(200, {
                "Content-Type": mime,
                "Cache-Control": "no-cache",
              });

              fs.createReadStream(filePath).pipe(res);

              return;
            }
          } catch {
            // Continue searching
          }
        }

        // ----------------------------------------------------
        // React SPA fallback
        //
        // Prerender only requests valid routes from allPages.
        // ----------------------------------------------------

        const indexPath = path.join(
          buildDir,
          "index.html"
        );

        if (fs.existsSync(indexPath)) {
          res.writeHead(200, {
            "Content-Type":
              "text/html; charset=utf-8",
            "Cache-Control": "no-cache",
          });

          fs.createReadStream(indexPath).pipe(res);

          return;
        }

        // ----------------------------------------------------
        // 404
        // ----------------------------------------------------

        res.writeHead(404, {
          "Content-Type": "text/plain",
        });

        res.end("Not found");
      } catch (error) {
        console.error(
          "Local server request error:",
          error
        );

        if (!res.headersSent) {
          res.writeHead(500);
        }

        res.end("Internal Server Error");
      }
    });

    // ========================================================
    // PORT 0
    //
    // Node automatically selects a free port.
    // Prevents EADDRINUSE.
    // ========================================================

    server.listen(
      0,
      "127.0.0.1",
      () => {
        const address = server.address();

        if (
          !address ||
          typeof address === "string"
        ) {
          reject(
            new Error(
              "Could not determine local server port"
            )
          );

          return;
        }

        const port = address.port;

        console.log(
          `✅ Local prerender server started on port ${port}`
        );

        resolve({
          server,
          port,
        });
      }
    );

    server.on("error", (error) => {
      reject(error);
    });
  });
}

// ============================================================
// PRERENDER
// ============================================================

async function prerender() {
  console.log("\n======================================");
  console.log("🚀 METAGUISE PRERENDER");
  console.log("======================================\n");

  console.log("📋 Pages breakdown:");
  console.log(`   Static  : ${staticPages.length}`);
  console.log(`   Blogs   : ${blogPages.length}`);
  console.log(`   Projects: ${projectPages.length}`);
  console.log(`   Products: ${productPages.length}`);
  console.log(`   Total   : ${allPages.length}\n`);

  let localServer = null;
  let browser = null;

  let success = 0;
  let failed = 0;

  const failedPages = [];

  try {
    // ========================================================
    // START LOCAL SERVER
    // ========================================================

    const serverInfo = await startServer();

    localServer = serverInfo.server;
    const port = serverInfo.port;

    // ========================================================
    // LAUNCH CHROMIUM
    // ========================================================

    console.log("🌐 Starting Chromium...\n");

    browser = await puppeteer.launch({
      headless: true,

      executablePath:
        "/usr/bin/chromium-browser",

      timeout: 60000,

      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",

        // Important on low-memory Ubuntu servers
        "--disable-dev-shm-usage",

        // Disable GPU
        "--disable-gpu",
        "--disable-software-rasterizer",

        // Reduce background processing
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",

        // Reduce unnecessary Chromium services
        "--disable-extensions",
        "--disable-sync",
        "--disable-translate",
      ],
    });

    console.log("✅ Chromium started\n");

    // ========================================================
    // PROCESS EACH PAGE
    // ========================================================

    for (const pagePath of allPages) {
      let tab = null;

      try {
        console.log(
          `\n🔄 Rendering: ${pagePath}`
        );

        // ----------------------------------------------------
        // NEW TAB
        // ----------------------------------------------------

        tab = await browser.newPage();

        // ----------------------------------------------------
        // VIEWPORT
        // ----------------------------------------------------

        await tab.setViewport({
          width: 1440,
          height: 900,
          deviceScaleFactor: 1,
        });

        // ----------------------------------------------------
        // TIMEOUTS
        // ----------------------------------------------------

        tab.setDefaultNavigationTimeout(60000);

        tab.setDefaultTimeout(30000);

        // ----------------------------------------------------
        // ERROR LOGGING
        // ----------------------------------------------------

        tab.on("console", (message) => {
          if (message.type() === "error") {
            console.log(
              `⚠️ Console error [${pagePath}]:`,
              message.text()
            );
          }
        });

        tab.on("pageerror", (error) => {
          console.error(
            `⚠️ Page JS error [${pagePath}]:`,
            error.message
          );
        });

        tab.on("error", (error) => {
          console.error(
            `⚠️ Browser error [${pagePath}]:`,
            error.message
          );
        });

        tab.on("close", () => {
          console.log(
            `⚠️ Page closed [${pagePath}]`
          );
        });

        // ====================================================
        // BLOCK UNNECESSARY THIRD-PARTY RESOURCES
        //
        // These can keep network connections open or consume
        // large amounts of memory during prerendering.
        //
        // They are NOT blocked on your actual website.
        // ====================================================

        await tab.setRequestInterception(true);

        tab.on("request", (request) => {
          try {
            const url = request.url();

            const blockedDomains = [
              "youtube.com",
              "youtube-nocookie.com",
              "google-analytics.com",
              "googletagmanager.com",
              "clarity.ms",
              "doubleclick.net",
              "facebook.net",
              "connect.facebook.net",
              "hotjar.com",
            ];

            const shouldBlock =
              blockedDomains.some((domain) =>
                url.includes(domain)
              );

            if (shouldBlock) {
              request.abort().catch(() => {});
              return;
            }

            request.continue().catch(() => {});
          } catch {
            // Ignore interception errors
          }
        });

        // ====================================================
        // NAVIGATION
        // ====================================================

        const targetUrl =
          `http://127.0.0.1:${port}${pagePath}`;

        console.log(
          `🌐 ${targetUrl}`
        );

        await tab.goto(targetUrl, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });

        // ====================================================
        // CHECK PAGE
        // ====================================================

        if (tab.isClosed()) {
          throw new Error(
            "Puppeteer page closed after navigation"
          );
        }

        // ====================================================
        // WAIT FOR REACT
        // ====================================================

        await tab.waitForFunction(
          () => {
            const root =
              document.getElementById("root");

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

        // ====================================================
        // CHECK AGAIN
        // ====================================================

        if (tab.isClosed()) {
          throw new Error(
            "Puppeteer page closed while waiting for React"
          );
        }

        // ====================================================
        // WAIT FOR REACT-HELMET / DOM
        // ====================================================

        await new Promise((resolve) =>
          setTimeout(resolve, 700)
        );

        // ====================================================
        // FINAL CHECK
        // ====================================================

        if (tab.isClosed()) {
          throw new Error(
            "Puppeteer page closed before HTML extraction"
          );
        }

        // ====================================================
        // GET FINAL HTML
        // ====================================================

        const html = await tab.content();

        if (!html || html.length < 1000) {
          throw new Error(
            `Generated HTML is too small: ${html.length} bytes`
          );
        }

        // ====================================================
        // OUTPUT PATH
        // ====================================================

        const safePage = pagePath
          .replace(/[:'&,?‘’]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");

        const filePath =
          safePage === "/"
            ? path.join(
                __dirname,
                "build",
                "index.html"
              )
            : path.join(
                __dirname,
                "build",
                ...safePage
                  .split("/")
                  .filter(Boolean),
                "index.html"
              );

        // ====================================================
        // CREATE DIRECTORY
        // ====================================================

        fs.mkdirSync(
          path.dirname(filePath),
          {
            recursive: true,
          }
        );

        // ====================================================
        // WRITE HTML
        // ====================================================

        fs.writeFileSync(
          filePath,
          html,
          "utf8"
        );

        console.log(
          `✅ SUCCESS: ${pagePath} (${html.length} bytes)`
        );

        success++;
      } catch (error) {
        failed++;

        failedPages.push({
          page: pagePath,
          error: error.message,
        });

        console.error(
          `❌ FAILED: ${pagePath}`
        );

        console.error(
          `   ${error.message}`
        );
      } finally {
        // ====================================================
        // ALWAYS CLOSE TAB
        // ====================================================

        if (tab && !tab.isClosed()) {
          try {
            await tab.close();
          } catch {
            // Ignore close errors
          }
        }
      }
    }

    // ========================================================
    // FINAL REPORT
    // ========================================================

    console.log("\n======================================");
    console.log("🎉 PRERENDER COMPLETE");
    console.log("======================================");

    console.log(
      `✅ Success : ${success}`
    );

    console.log(
      `❌ Failed  : ${failed}`
    );

    console.log(
      `📄 Total   : ${allPages.length}`
    );

    // ========================================================
    // FAILED PAGES
    // ========================================================

    if (failedPages.length > 0) {
      console.log(
        "\n❌ FAILED PAGES:"
      );

      failedPages.forEach(
        ({ page, error }) => {
          console.log(
            `   ${page} → ${error}`
          );
        }
      );
    } else {
      console.log(
        "\n🎯 All pages prerendered successfully!"
      );
    }

    console.log(
      "\n======================================\n"
    );
  } catch (error) {
    console.error(
      "\n❌ FATAL PRERENDER ERROR:"
    );

    console.error(error);

    throw error;
  } finally {
    // ========================================================
    // CLOSE BROWSER
    // ========================================================

    if (browser) {
      try {
        await browser.close();

        console.log(
          "🛑 Chromium closed."
        );
      } catch {
        // Ignore
      }
    }

    // ========================================================
    // CLOSE LOCAL SERVER
    // ========================================================

    if (localServer) {
      await new Promise((resolve) => {
        localServer.close(() => {
          console.log(
            "🛑 Local prerender server stopped."
          );

          resolve();
        });
      });
    }
  }
}

// ============================================================
// RUN
// ============================================================

prerender()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(
      "\n❌ Prerender failed:"
    );

    console.error(error);

    process.exit(1);
  });