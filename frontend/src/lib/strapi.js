/* ------------------------------------------------------------
 * Central Strapi helper
 * Works in the browser *and* during Next.js builds
 * ---------------------------------------------------------- */

const API_ROOT =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:1337' : undefined);

if (!API_ROOT) throw new Error('Missing NEXT_PUBLIC_STRAPI_API_URL');

const BASE_URL     = API_ROOT.replace(/\/$/, '');
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '';

export const HOMEPAGE_SLUG   = process.env.STRAPI_HOMEPAGE_SLUG   || 'homepage';
export const ABOUTPAGE_SLUG  = process.env.STRAPI_ABOUTPAGE_SLUG  || 'aboutpage';
export const NAVIGATION_SLUG = process.env.STRAPI_NAVIGATION_SLUG || 'navigation';

/* ------------------------------------------------------------
 * Low-level fetch helper (ISR = 60 s everywhere)
 * ---------------------------------------------------------- */
async function fetchFromStrapi(path, opts = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const headers = {
    ...opts.headers,
    ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
  };

  const res = await fetch(url, {
    ...opts,
    headers,
    next: { revalidate: 60 },   // ← single source of truth
  });

  if (!res.ok) throw new Error(`Strapi ${res.status} on ${url}`);
  return res.json();
}

/* ------------------------------------------------------------
 * Utilities
 * ---------------------------------------------------------- */
function unwrap(json) {
  if (!json?.data) return null;
  if (Array.isArray(json.data)) {
    return json.data.map((item) => item.attributes ?? item);
  }
  return json.data.attributes ?? json.data;
}

/* ------------------------------------------------------------
 * Generic helpers
 * ---------------------------------------------------------- */
async function getSingleType(apiId, populate = '*') {
  const query = populate ? `?populate=${populate}` : '';
  const json  = await fetchFromStrapi(`/api/${apiId}${query}`);
  return unwrap(json);
}

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
export const getHomePage  = () => getSingleType(HOMEPAGE_SLUG, '*');
export const getAboutPage = () => getSingleType(ABOUTPAGE_SLUG, 'principles');

export const getNavigationLogo = async () => {
  try {
    const json = await fetchFromStrapi(
      `/api/${NAVIGATION_SLUG}?populate=logo`
    );
    const raw = json?.data?.attributes?.logo?.data?.attributes;
    if (!raw?.url) return null;

    const url = raw.url.startsWith('/') ? `${BASE_URL}${raw.url}` : raw.url;
    return { url, alt: raw.alternativeText || raw.name || '' };
  } catch (err) {
    // 404, network error, or any other failure → log and fall back to null
    console.error('getNavigationLogo →', err.message);
    return null;
  }
};

export const getMenuItems = async () => [
  { label: 'Home',    href: '/'        },
  { label: 'About',   href: '/about'   },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Team',    href: '/team'    },
  { label: 'Contact', href: '/contact' },
  { label: 'Enrol',   href: '/enrol'   },
];
