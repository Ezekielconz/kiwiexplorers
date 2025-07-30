/**
 * Central Strapi helper
 * Works in the browser and during Next.js builds
 * ------------------------------------------------------------
 */

const API_ROOT =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:1337' : undefined);

if (!API_ROOT) {
  throw new Error('Missing NEXT_PUBLIC_STRAPI_API_URL in your environment');
}
const BASE_URL = API_ROOT.replace(/\/$/, '');

const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '';

export const HOMEPAGE_SLUG   = process.env.STRAPI_HOMEPAGE_SLUG   || 'homepage';
export const NAVIGATION_SLUG = process.env.STRAPI_NAVIGATION_SLUG || 'navigation';

/* ------------------------------------------------------------ */
/* Low-level fetch helper                                        */
/* ------------------------------------------------------------ */
async function fetchFromStrapi(path, opts = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;

  const headers = {
    ...opts.headers,
    ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
  };

  const res = await fetch(url, { ...opts, headers });

  if (!res.ok) {
    const msg = `Failed to fetch ${url}: ${res.status}`;
    // Don’t kill the build—bubble up for graceful handling
    throw new Error(msg);
  }
  return res.json();
}

/* ------------------------------------------------------------ */
/* Content helpers                                               */
/* ------------------------------------------------------------ */
export async function getHomePage() {
  try {
    const { data } = await fetchFromStrapi(`/api/${HOMEPAGE_SLUG}?populate=*`);
    return data?.attributes ?? data;
  } catch (err) {
    console.error('getHomePage error:', err.message);
    return null;                      // let the page render a fallback
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
    const json    = await fetchFromStrapi(`/api/${NAVIGATION_SLUG}?populate=logo`);
    const logoRaw = json?.data?.attributes?.logo?.data?.attributes;
    if (!logoRaw?.url) return null;

    const url = logoRaw.url.startsWith('/')
      ? `${BASE_URL}${logoRaw.url}`
      : logoRaw.url;

    return { url, alt: logoRaw.alternativeText || logoRaw.name || '' };
  } catch (err) {
    console.error('getNavigationLogo error:', err.message);
    return null;
  }
}
