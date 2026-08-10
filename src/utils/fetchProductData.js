// Fetch helpers for product data.
// SingleProductDetail used to be a static import from constants.js (added ~62 KB
// to every page's JS bundle). It's now split into per-product JSON files under
// /public/data/products/, fetched only when needed.

// Lightweight list for listing/grid pages — name, thumbnail, meta only.
export async function fetchProductsIndex() {
  const res = await fetch('/data/products-index.json');
  if (!res.ok) throw new Error('Failed to load products index');
  return res.json();
}

// Full detail for a single product page — fetched by slug (the old `name` field).
export async function fetchProductBySlug(slug) {
  const res = await fetch(`/data/products/${slug}.json`);
  if (!res.ok) throw new Error(`Product not found: ${slug}`);
  return res.json();
}
