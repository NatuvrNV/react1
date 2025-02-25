const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');

(async () => {
    const urls = [
        { url: '/', changefreq: 'daily', priority: 1.0 },
        { url: '/projects', changefreq: 'weekly', priority: 0.8 },
        { url: '/projects/single-project-1', changefreq: 'weekly', priority: 0.8 },
        { url: '/products', changefreq: 'weekly', priority: 0.8 },
        { url: '/contact', changefreq: 'monthly', priority: 0.7 },
        { url: '/about', changefreq: 'monthly', priority: 0.7 },
    ];

    const sitemap = new SitemapStream({ hostname: 'https://metaguise.com' });

    urls.forEach((entry) => {
        sitemap.write(entry);
    });

    sitemap.end();

    const data = await streamToPromise(sitemap);
    fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), data);
    console.log('✅ Sitemap generated correctly!');
})();
