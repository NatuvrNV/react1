const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');
const glob = require('glob');

(async () => {
    const pages = glob.sync('src/pages/**/*.js'); // Adjust if needed
    const urls = pages.map((page) => {
        const route = page.replace(/^src\/pages\/|\.js$/g, '').replace(/\/index$/, '');
        return route === 'home' ? '/' : `/${route}`;
    });

    const sitemap = new SitemapStream({ hostname: 'https://metaguise.com' });
    
    urls.forEach((url) => {
        sitemap.write({ url, changefreq: 'daily', priority: url === '/' ? 1.0 : 0.8 });
    });

    sitemap.end();

    const data = await streamToPromise(sitemap);
    fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), data);
    console.log('✅ Sitemap generated!');
})();
