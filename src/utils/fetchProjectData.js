// Fetch helpers for project data.
// SingleprojectDetail used to be a static import from constants.js (added ~213 KB
// to every page's JS bundle). It's now split into per-project JSON files under
// /public/data/projects/, fetched only when needed.

// Lightweight list for listing/grid pages — name, url, thumbnail, meta only.
// Use this instead of importing SingleprojectDetail for the projects listing page.
export async function fetchProjectsIndex() {
  const res = await fetch('/data/projects-index.json');
  if (!res.ok) throw new Error('Failed to load projects index');
  return res.json();
}

// Full detail for a single project page — fetched by slug (the old `url` field).
export async function fetchProjectBySlug(slug) {
  const res = await fetch(`/data/projects/${slug}.json`);
  if (!res.ok) throw new Error(`Project not found: ${slug}`);
  return res.json();
}
