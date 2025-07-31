/* ------------------------------------------------------------
 * Central Strapi helper
 * Works in the browser *and* during Next.js builds
 * ---------------------------------------------------------- */

const API_ROOT =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:1337'
    : undefined);

if (!API_ROOT) throw new Error('Missing NEXT_PUBLIC_STRAPI_API_URL');

const BASE_URL     = API_ROOT.replace(/\/$/, '');
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '';

export const HOMEPAGE_SLUG         = (process.env.STRAPI_HOMEPAGE_SLUG          || 'homepage'          ).trim();
export const ABOUTPAGE_SLUG        = (process.env.STRAPI_ABOUTPAGE_SLUG         || 'aboutpage'         ).trim();
export const NAVIGATION_SLUG       = (process.env.STRAPI_NAVIGATION_SLUG        || 'navigation'        ).trim();
export const TEAM_MEMBERS_SLUG     = (process.env.STRAPI_TEAM_MEMBERS_SLUG      || 'team-members'      ).trim();
export const GALLERY_SLUG          = (process.env.STRAPI_GALLERY_SLUG           || 'gallery'           ).trim();
export const GALLERY_CATEGORY_SLUG = (process.env.STRAPI_GALLERY_CATEGORY_SLUG  || 'gallery-categories').trim();

/* ------------------------------------------------------------
 * Low-level fetch helper (ISR = 60 s everywhere)
 * ---------------------------------------------------------- */
async function fetchFromStrapi(path, opts = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const headers = {
    ...opts.headers,
    ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
  };

  const res = await fetch(url, { ...opts, headers, next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Strapi ${res.status} on ${url}`);
  return res.json();
}

/* ------------------------------------------------------------
 * Utilities
 * ---------------------------------------------------------- */

/** Recursively remove the `.attributes` wrapper (v4) while leaving v5 untouched. */
function deepUnwrap(node) {
  if (Array.isArray(node)) return node.map(deepUnwrap);
  if (node && typeof node === 'object') {
    const base = node.attributes ? { id: node.id, ...node.attributes } : { ...node };
    for (const k of Object.keys(base)) base[k] = deepUnwrap(base[k]);
    return base;
  }
  return node;
}

/** Make media URLs absolute. */
const absUrl = (url) =>
  url ? (url.startsWith('/') ? `${BASE_URL}${url}` : url) : null;

/** First non-null match for the given keys. */
const pick = (obj, ...keys) =>
  keys.reduce((v, k) => (v !== undefined && v !== null ? v : obj?.[k]), undefined);

/* ------------------------------------------------------------
 * Generic single-type helper
 * ---------------------------------------------------------- */
async function getSingleType(apiId, populate = '*') {
  const q    = populate ? `?populate=${encodeURIComponent(populate)}` : '';
  const json = await fetchFromStrapi(`/api/${apiId}${q}`);
  return json?.data ? deepUnwrap(json.data) : null;
}

/* ------------------------------------------------------------
 * Public content helpers
 * ---------------------------------------------------------- */
export const getHomePage = async () => {
  try { return await getSingleType(HOMEPAGE_SLUG, '*'); }
  catch (e) { console.error('getHomePage →', e); return null; }
};

export const getAboutPage = async () => {
  try { return await getSingleType(ABOUTPAGE_SLUG, 'principles'); }
  catch (e) { console.error('getAboutPage →', e); return null; }
};

export const getGalleryContent = async () => {
  try { return await getSingleType(GALLERY_SLUG, '*'); }
  catch (e) { console.error('getGalleryContent →', e); return null; }
};

export const getNavigationLogo = async () => {
  try {
    const json  = await fetchFromStrapi(`/api/${NAVIGATION_SLUG}?populate=logo`);
    const nav   = json?.data ? deepUnwrap(json.data) : null;
    const logo  = nav?.logo;
    if (!logo?.url) return null;
    return { url: absUrl(logo.url), alt: logo.alternativeText || logo.name || '' };
  } catch (e) {
    console.error('getNavigationLogo →', e);
    return null;
  }
};

/* ---------- Team members (collection) ---------- */
export const getTeamMembers = async () => {
  try {
    const json   = await fetchFromStrapi(`/api/${TEAM_MEMBERS_SLUG}?populate=*`);
    const items  = json?.data ? deepUnwrap(json.data) : [];

    const toMedia = (val) => {
      const m = Array.isArray(val) ? val[0] : val;
      return m && typeof m === 'object'
        ? { url: absUrl(m.url), alt: m.alternativeText || m.name || '' }
        : { url: null,          alt: '' };
    };

    return items
      .map((m) => {
        const { url, alt } = toMedia(pick(m, 'photo', 'Photo', 'image', 'Image', 'headshot', 'Headshot'));
        return {
          id:   m.id,
          name: pick(m, 'name', 'Name')              ?? '—',
          role: pick(m, 'title', 'Title', 'role')    ?? '',
          bio:  pick(m, 'bio',  'Bio')               ?? '',
          sort: pick(m, 'sortOrder', 'SortOrder')    ?? 0,
          img:  url,
          alt,
        };
      })
      .sort((a, b) => a.sort - b.sort);
  } catch (e) {
    console.error('getTeamMembers →', e);
    return [];
  }
};

/* ---------- Gallery categories + their images ---------- */
export const getGalleryCategories = async () => {
  try {
    const json = await fetchFromStrapi(
      `/api/${GALLERY_CATEGORY_SLUG}?sort=sortOrder&populate[gallery_images][populate]=image&populate[gallery_images][sort]=sortOrder`
    );
    const cats = json?.data ? deepUnwrap(json.data) : [];

    return cats
      .map((c) => ({
        id:        c.id,
        title:     c.title || '—',
        slug:      c.slug  || '',
        sortOrder: typeof c.sortOrder === 'number' ? c.sortOrder : 0,
        images:    (c.gallery_images || [])
          .map((gi) => ({
            id:        gi.id,
            src:       absUrl(gi.image?.url),
            alt:       gi.image?.alternativeText || gi.caption || '',
            caption:   gi.caption || '',
            sortOrder: typeof gi.sortOrder === 'number' ? gi.sortOrder : 0,
          }))
          .sort((a, b) => a.sortOrder - b.sortOrder),
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (e) {
    console.error('getGalleryCategories →', e);
    return [];
  }
};

/* ---------- Static site-wide nav ---------- */
export const getMenuItems = async () => [
  { label: 'Home',    href: '/'        },
  { label: 'About',   href: '/about'   },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Team',    href: '/team'    },
  { label: 'Contact', href: '/contact' },
  { label: 'Enrol',   href: '/enrol'   },
];
