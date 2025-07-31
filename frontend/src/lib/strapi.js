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

export const HOMEPAGE_SLUG   =
  (process.env.STRAPI_HOMEPAGE_SLUG   || 'homepage').trim();
export const ABOUTPAGE_SLUG  =
  (process.env.STRAPI_ABOUTPAGE_SLUG  || 'aboutpage').trim();
export const NAVIGATION_SLUG =
  (process.env.STRAPI_NAVIGATION_SLUG || 'navigation').trim();
export const TEAM_MEMBERS_SLUG =
  (process.env.STRAPI_TEAM_MEMBERS_SLUG || 'team-members').trim();

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
    next: { revalidate: 60 },
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

/* ------------------------------------------------------------
 * Public content helpers
 * ---------------------------------------------------------- */
export const getHomePage = async () => {
  try {
    return await getSingleType(HOMEPAGE_SLUG, '*');
  } catch (err) {
    console.error('getHomePage →', err.message);
    return null;
  }
};

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
    console.error('getNavigationLogo →', err.message);
    return null;
  }
};

/* ---------- Team members (collection) ---------- */
export const getTeamMembers = async () => {
  try {
    const json = await fetchFromStrapi(
      `/api/${TEAM_MEMBERS_SLUG}?populate=photo&sort=sortOrder`
    );
    const items = json?.data || [];

    return items.map((item) => {
      const a   = item.attributes ?? {};
      const img = a.photo?.data?.attributes;

      return {
        id:   item.id,
        name: a.name,
        role: a.title,
        bio:  a.bio,
        img:  img?.url
          ? img.url.startsWith('/') ? `${BASE_URL}${img.url}` : img.url
          : null,
        alt:  img?.alternativeText || a.name || '',
      };
    });
  } catch (err) {
    console.error('getTeamMembers →', err.message);
    return [];
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
