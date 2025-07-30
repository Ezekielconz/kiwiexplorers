// src/lib/strapi.js

// 1) Single source of truth for your API root
const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:1337'
    : undefined);

if (!API_URL) {
  throw new Error('Missing NEXT_PUBLIC_STRAPI_API_URL in your environment');
}
const BASE_URL = API_URL.replace(/\/$/, '');

// Slugs from env
export const HOMEPAGE_SLUG =
  process.env.STRAPI_HOMEPAGE_SLUG || 'homepage';
export const NAVIGATION_SLUG =
  process.env.STRAPI_NAVIGATION_SLUG || 'navigation';

/**
 * Low-level fetch helper
 */
async function fetchFromStrapi(path, opts = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, opts);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch the Homepage single type
 */
export async function getHomePage() {
  const endpoint = `/api/${HOMEPAGE_SLUG}`;
  if (process.env.NODE_ENV === 'development') {
    console.log('⟳ fetching', BASE_URL + endpoint);
  }
  const { data } = await fetchFromStrapi(endpoint);
  return data.attributes ?? data;
}

/**
 * Stubbed menu for now
 */
export async function getMenuItems() {
  return [
    { label: 'Home',    href: '/'        },
    { label: 'About',   href: '/about'   },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Team',    href: '/team'    },
    { label: 'Contact', href: '/contact' },
    // “Enrol” will be styled specially in the Nav component
    { label: 'Enrol',   href: '/enrol'   },
  ];
}

/**
 * Fetch the Navigation single type to grab its logo field
 */
export async function getNavigationLogo() {
  try {
    const endpoint = `/api/${NAVIGATION_SLUG}?populate=logo`;
    if (process.env.NODE_ENV === 'development') {
      console.log('⟳ fetching', BASE_URL + endpoint);
    }
    const json = await fetchFromStrapi(endpoint);
    const raw = json.data;
    const attrs = raw.attributes ?? raw;
    const logoData = attrs.logo?.data?.attributes;
    if (!logoData || !logoData.url) {
      return null;
    }
    // build a full URL if Strapi returns a relative path
    const url = logoData.url.startsWith('/')
      ? `${BASE_URL}${logoData.url}`
      : logoData.url;
    const alt = logoData.alternativeText || logoData.name || '';
    return { url, alt };
  } catch (err) {
    console.error('getNavigationLogo error:', err);
    return null;
  }
}
