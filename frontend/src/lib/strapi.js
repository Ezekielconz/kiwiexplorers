/* ------------------------------------------------------------
 * Central Strapi helper
 * Works in the browser *and* during Next.js builds
 * ---------------------------------------------------------- */

const API_ROOT =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:1337' : undefined);

if (!API_ROOT) {
  throw new Error('Missing NEXT_PUBLIC_STRAPI_API_URL in your environment');
}

const BASE_URL     = API_ROOT.replace(/\/$/, '');
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '';

export const HOMEPAGE_SLUG   = process.env.STRAPI_HOMEPAGE_SLUG   || 'homepage';
export const ABOUTPAGE_SLUG  = process.env.STRAPI_ABOUTPAGE_SLUG  || 'aboutpage';
export const NAVIGATION_SLUG = process.env.STRAPI_NAVIGATION_SLUG || 'navigation';

/* ------------------------------------------------------------
 * Low-level fetch helper
 * ---------------------------------------------------------- */
async function fetchFromStrapi(path, opts = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const headers = {
    ...opts.headers,
    ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
  };

  const res = await fetch(url, { ...opts, headers });

  if (!res.ok) {
    throw new Error(`Strapi ${res.status} on ${url}`);
  }
  return res.json();
}

/* ------------------------------------------------------------
 * Utilities
 * ---------------------------------------------------------- */
function unwrap(json) {
  // v5 single-type → json.data.<field>
  // v4 collection  → json.data[i].attributes.<field>
  if (!json?.data) return null;

  // single-type (object) vs collection (array)
  if (Array.isArray(json.data)) {
    return json.data.map((item) => item.attributes ?? item);
  }
  return json.data.attributes ?? json.data;
}

/* Single-type helper */
async function getSingleType(apiId, populate = '*') {
  const query = populate ? `?populate=${populate}` : '';
  const json  = await fetchFromStrapi(`/api/${apiId}${query}`);
  return unwrap(json);
}

/* Collection helper (filter by slug) — not used right now but handy */
async function getCollection(apiId, slug, populate = '*') {
  const query =
    `?filters[slug][$eq]=${slug}` + (populate ? `&populate=${populate}` : '');
  const json  = await fetchFromStrapi(`/api/${apiId}${query}`);
  const items = unwrap(json);
  return Array.isArray(items) ? items[0] ?? null : items;
}

/* ------------------------------------------------------------
 * Public content helpers
 * ---------------------------------------------------------- */
export async function getHomePage() {
  try {
    return await getSingleType(HOMEPAGE_SLUG, '*');
  } catch (err) {
    console.error('getHomePage →', err.message);
    return null;
  }
}

export async function getAboutPage() {
  try {
    return await getSingleType(ABOUTPAGE_SLUG, 'principles');
  } catch (err) {
    console.error('getAboutPage →', err.message);
    return null;
  }
}

export async function getMenuItems() {
  return [
    { label: 'Home',    href: '/'        },
    { label: 'About',   href: '/about'   },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Team',    href: '/team'    },
    { label: 'Contact', href: '/contact' },
    { label: 'Enrol',   href: '/enrol'   },
  ];
}

export async function getNavigationLogo() {
  try {
    const json = await fetchFromStrapi(
      `/api/${NAVIGATION_SLUG}?populate=logo`
    );
    const raw  = json?.data?.attributes?.logo?.data?.attributes;
    if (!raw?.url) return null;

    // Resolve relative URLs the same way Next.js does elsewhere
    const url = raw.url.startsWith('/') ? `${BASE_URL}${raw.url}` : raw.url;

    return {
      url,
      alt: raw.alternativeText || raw.name || '',
    };
  } catch (err) {
    console.error('getNavigationLogo →', err.message);
    return null;
  }
}
