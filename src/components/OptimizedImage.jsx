/**
 * OptimizedImage.jsx
 * -------------------
 * Fixes 2 Core Web Vitals issues at once:
 *   1) LCP (Largest Contentful Paint) - via priority loading + fetchpriority + preload hint
 *   2) CLS (Cumulative Layout Shift)  - via required width/height so the browser reserves
 *      space before the image downloads (no more content "jumping")
 *
 * USE THIS FOR EVERY <img> ON THE SITE. Replace plain <img> tags with <OptimizedImage />.
 *
 * --------------------------------------------------------------------------
 * HOW TO USE
 * --------------------------------------------------------------------------
 *
 * 1) Hero / banner images (the FIRST big image visible on a page - homepage
 *    hero, blog post banner, first product image) -> pass `priority`:
 *
 *      <OptimizedImage
 *        src="/assets/Blogs/Copper-Facade-Cladding/banner.jpg"
 *        alt="Copper facade cladding on a modern building"
 *        width={1600}
 *        height={900}
 *        priority
 *      />
 *
 *    `priority` does 3 things automatically:
 *      - loading="eager" (loads immediately, doesn't wait)
 *      - fetchpriority="high" (tells the browser "this is the important one")
 *      - injects a <link rel="preload"> tag in <head> so the browser starts
 *        downloading it before it even finishes parsing the HTML
 *
 * 2) Every OTHER image on the page (below the fold - product grids, project
 *    galleries, related posts, footer logos) -> do NOT pass `priority`.
 *    It will automatically lazy-load:
 *
 *      <OptimizedImage
 *        src="/assets/Products/metacoin-thumb.jpg"
 *        alt="MetaCoin facade panel"
 *        width={400}
 *        height={300}
 *      />
 *
 * 3) width & height (or aspectRatio) are REQUIRED - this is what fixes CLS.
 *    If you don't know the exact pixel size, use aspectRatio instead:
 *
 *      <OptimizedImage src="..." alt="..." aspectRatio="4/3" />
 *
 * --------------------------------------------------------------------------
 * WHERE TO APPLY THIS FIRST (highest impact, per the CWV report)
 * --------------------------------------------------------------------------
 *   - Homepage hero image/banner              -> priority
 *   - Blog post template banner image          -> priority  (fixes 72 blog URLs at once)
 *   - /all-products/ grid: first 4-6 images     -> priority, rest -> lazy (default)
 *   - /all-projects/[slug] gallery/carousel images -> default (lazy), first hero photo -> priority
 * --------------------------------------------------------------------------
 */

import { useEffect } from "react";
// NOTE: no external dependencies needed - this component is plug-and-play.
// (If your project already uses prop-types, feel free to add PropTypes
// validation back in; it's intentionally left out here so this file works
// immediately without an extra `npm install`.)

function preloadImage(src, srcSet, sizes) {
  if (typeof document === "undefined") return;
  const existing = document.head.querySelector(`link[data-preload-src="${src}"]`);
  if (existing) return;
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = src;
  if (srcSet) link.setAttribute("imagesrcset", srcSet);
  if (sizes) link.setAttribute("imagesizes", sizes);
  link.setAttribute("data-preload-src", src);
  document.head.appendChild(link);
}

export default function OptimizedImage({
  src,
  srcSet,
  sizes,
  alt,
  width,
  height,
  aspectRatio,
  priority = false,
  className = "",
  style = {},
  ...rest
}) {
  useEffect(() => {
    if (priority) {
      preloadImage(src, srcSet, sizes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, priority]);

  const dimensionStyle = aspectRatio
    ? { aspectRatio, width: "100%", height: "auto" }
    : {};

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchpriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      className={className}
      style={{ ...dimensionStyle, ...style }}
      {...rest}
    />
  );
}


