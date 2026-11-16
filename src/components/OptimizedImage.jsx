/**
 * OptimizedImage.jsx
 * Drop-in <img> replacement: lazy-loads by default, `priority` for the hero/LCP image.
 * width + height (or aspectRatio) are REQUIRED so the browser reserves space (no layout shift).
 *
 * Usage:
 *   <OptimizedImage src={img} alt="..." width={1920} height={1080} priority />   // hero
 *   <OptimizedImage src={img} alt="..." width={400} height={300} />              // lazy
 *   <OptimizedImage ... loading="eager" />                                        // override lazy
 */

import { useEffect, version as reactVersion } from "react";

// React 19 wants `fetchPriority`, React 18 wants lowercase `fetchpriority`.
// Picking by version avoids the "unknown prop" console warning on either.
const FETCH_PRIORITY_PROP =
  parseInt(reactVersion, 10) >= 19 ? "fetchPriority" : "fetchpriority";

function preloadImage(src, srcSet, sizes) {
  if (typeof document === "undefined" || !src) return;
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
  alt = "",
  width,
  height,
  aspectRatio,
  priority = false,
  className = "",
  style = {},
  ...rest
}) {
  useEffect(() => {
    if (priority) preloadImage(src, srcSet, sizes);
  }, [src, srcSet, sizes, priority]);

  const dimensionStyle = aspectRatio
    ? { aspectRatio, width: "100%", height: "auto" }
    : {};

  const fetchProps = { [FETCH_PRIORITY_PROP]: priority ? "high" : "auto" };

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...fetchProps}
      className={className}
      style={{ ...dimensionStyle, ...style }}
      {...rest}
    />
  );
}