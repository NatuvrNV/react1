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
//
// IMPORTANT:
// port = 0 means Node automatically chooses a free port.
// This eliminates EADDRINUSE on port 45678.
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

        // Prevent path traversal
        const normalizedPath = path.normalize(urlPath);

        if (normalizedPath.includes("..")) {
          res.writeHead(400);
          res.end("Bad Request");
          return;
        }

        const candidates = [
          path.join(buildDir, urlPath),
          path.join(buildDir, urlPath, "index.html"),
          path.join(buildDir, `${urlPath}.html`),
        ];

        for (const filePath of candidates) {
          try {
            const stat = fs.statSync(filePath);

            if (stat.isFile()) {
              const ext = path.extname(filePath).toLowerCase();
              const mime =
                mimeTypes[ext] || "application/octet-stream";

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

        // IMPORTANT:
        // Only fallback to index.html for React routes.
        //
        // Since prerender only requests valid routes from allPages,
        // this fallback allows React Router to render them.
        const indexPath = path.join(buildDir, "index.html");

        if (fs.existsSync(indexPath)) {
          res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-cache",
          });

          fs.createReadStream(indexPath).pipe(res);
          return;
        }

        res.writeHead(404, {
          "Content-Type": "text/plain",
        });

        res.end("Not found");
      } catch (error) {
        console.error("Local server request error:", error);

        if (!res.headersSent) {
          res.writeHead(500);
        }

        res.end("Internal Server Error");
      }
    });

    // ========================================================
    // PORT 0 = AUTOMATIC FREE PORT
    // ========================================================

    server.listen(0, "127.0.0.1", () => {
      const address = server.address();

      if (!address || typeof address === "string") {
        reject(new Error("Could not determine local server port"));
        return;
      }

      const port = address.port;

      console.log(`✅ Local prerender server started on port ${port}`);

      resolve({
        server,
        port,
      });
    });

    server.on("error", (error) => {
      reject(error);
    });
  });
}

// ============================================================
// PRERENDER
// ============================================================

async function prerender() {
  console.log("\n📋 Pages breakdown:");
  console.log(`   Static  : ${staticPages.length}`);
  console.log(`   Blogs   : ${blogPages.length}`);
  console.log(`   Projects: ${projectPages.length}`);
  console.log(`   Products: ${productPages.length}`);
  console.log(`   Total   : ${allPages.length}\n`);

  console.log(
    `🚀 Pre-rendering ${allPages.length} pages...\n`
  );

  let localServer = null;
  let browser = null;

  let success = 0;
  let failed = 0;

  try {
    // ========================================================
    // START SERVER
    // ========================================================

    const serverInfo = await startServer();

    localServer = serverInfo.server;
    const port = serverInfo.port;

    // ========================================================
    // LAUNCH CHROMIUM
    // ========================================================

    browser = await puppeteer.launch({
      headless: "new",

      executablePath: "/usr/bin/chromium-browser",

      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-renderer-backgrounding",
      ],
    });

    // ========================================================
    // PROCESS EACH PAGE
    // ========================================================

    for (const pagePath of allPages) {
      let tab = null;

      try {
        tab = await browser.newPage();

        // ====================================================
        // BROWSER SETTINGS
        // ====================================================

        await tab.setViewport({
          width: 1440,
          height: 900,
          deviceScaleFactor: 1,
        });

        // 60 second navigation timeout
        tab.setDefaultNavigationTimeout(60000);

        // Console/page errors are intentionally ignored
        // because they should not stop the entire prerender.
        tab.on("console", () => {});
        tab.on("pageerror", () => {});

        // ====================================================
        // NAVIGATION
        //
        // IMPORTANT:
        // DO NOT use networkidle0.
        //
        // External resources such as:
        // - ImageKit
        // - YouTube
        // - Google Maps
        // - GTM
        // - Clarity
        // - Analytics
        //
        // can keep network connections open.
        // ====================================================

        await tab.goto(
          `http://127.0.0.1:${port}${pagePath}`,
          {
            waitUntil: "domcontentloaded",
            timeout: 60000,
          }
        );

        // ====================================================
        // WAIT FOR REACT ROOT
        // ====================================================

        await tab.waitForFunction(
          () => {
            const root = document.getElementById("root");

            return (
              root &&
              root.children &&
              root.children.length > 0
            );
          },
          {
            timeout: 20000,
          }
        );

        // ====================================================
        // SMALL WAIT FOR REACT / HELMET
        //
        // Gives React time to update:
        // - title
        // - meta description
        // - canonical
        // - OG tags
        // - page content
        // ====================================================

        await new Promise((resolve) =>
          setTimeout(resolve, 500)
        );

        // ====================================================
        // GET FINAL HTML
        // ====================================================

        const html = await tab.content();

        // ====================================================
        // CREATE OUTPUT PATH
        // ====================================================

        const safePage = pagePath
          .replace(/[:'&,?‘’]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");

        const filePath =
          safePage === "/"
            ? path.join(__dirname, "build", "index.html")
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

        fs.mkdirSync(path.dirname(filePath), {
          recursive: true,
        });

        // ====================================================
        // WRITE PRERENDERED HTML
        // ====================================================

        fs.writeFileSync(
          filePath,
          html,
          "utf8"
        );

        console.log(`✅ ${pagePath}`);

        success++;
      } catch (error) {
        failed++;

        console.error(
          `❌ ${pagePath} — ${error.message}`
        );
      } finally {
        // ALWAYS CLOSE TAB
        if (tab) {
          try {
            await tab.close();
          } catch {
            // Ignore close errors
          }
        }
      }
    }

    console.log("\n======================================");
    console.log("🎉 PRERENDER COMPLETE");
    console.log("======================================");
    console.log(`✅ Success : ${success}`);
    console.log(`❌ Failed  : ${failed}`);
    console.log(`📄 Total   : ${allPages.length}`);
    console.log("======================================\n");
  } catch (error) {
    console.error("\n❌ Fatal prerender error:");
    console.error(error);

    throw error;
  } finally {
    // ========================================================
    // ALWAYS CLOSE BROWSER
    // ========================================================

    if (browser) {
      try {
        await browser.close();
      } catch {
        // Ignore
      }
    }

    // ========================================================
    // ALWAYS CLOSE LOCAL SERVER
    //
    // This prevents EADDRINUSE on the next build.
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
    console.error(error);
    process.exit(1);
  });