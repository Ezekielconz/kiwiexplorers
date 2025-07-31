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

export const HOMEPAGE_SLUG          = (process.env.STRAPI_HOMEPAGE_SLUG   || 'homepage').trim();
export const ABOUTPAGE_SLUG         = (process.env.STRAPI_ABOUTPAGE_SLUG  || 'aboutpage').trim();
export const NAVIGATION_SLUG        = (process.env.STRAPI_NAVIGATION_SLUG || 'navigation').trim();
export const TEAM_MEMBERS_SLUG      = (process.env.STRAPI_TEAM_MEMBERS_SLUG || 'team-members').trim();
export const GALLERY_SLUG           = (process.env.STRAPI_GALLERY_SLUG || 'gallery').trim();
export const GALLERY_CATEGORY_SLUG  = (process.env.STRAPI_GALLERY_CATEGORY_SLUG || 'gallery-categories').trim();
export const GALLERY_IMAGE_SLUG     = (process.env.STRAPI_GALLERY_IMAGE_SLUG || 'gallery-images').trim(); // for completeness

/* ------------------------------------------------------------
 * Low-level fetch helper (ISR = 60s everywhere)
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
 * Generic single-type helper
 * ---------------------------------------------------------- */
async function getSingleType(apiId, populate = '*') {
  const query = populate ? `?populate=${encodeURIComponent(populate)}` : '';
  const json = await fetchFromStrapi(`/api/${apiId}${query}`);
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

export const getAboutPage = async () => {
  try {
    return await getSingleType(ABOUTPAGE_SLUG, 'principles');
  } catch (err) {
    console.error('getAboutPage →', err.message);
    return null;
  }
};

export const getGalleryContent = async () => {
  try {
    return await getSingleType(GALLERY_SLUG, '*');
  } catch (err) {
    console.error('getGalleryContent →', err.message);
    return null;
  }
};

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
    const json = await fetchFromStrapi(`/api/${TEAM_MEMBERS_SLUG}?populate=*`);
    const items = json?.data || [];

    return items.map((item) => {
      const src = item.attributes ?? item;
      const get = (...candidates) =>
        candidates.reduce((val, key) => val ?? src[key], undefined);
      const media =
        get('photo', 'Photo')?.data?.attributes ?? get('photo', 'Photo');
      const url = media?.url
        ? media.url.startsWith('/')
          ? `${BASE_URL}${media.url}`
          : media.url
        : null;

      return {
        id: item.id,
        name: get('name', 'Name') ?? '—',
        role: get('title', 'Title', 'role', 'Role') ?? '',
        bio: get('bio', 'Bio') ?? '',
        img: url,
        alt: media?.alternativeText || get('name', 'Name') || '',
      };
    });
  } catch (err) {
    console.error('getTeamMembers →', err.message);
    return [];
  }
};

/* ---------- Gallery categories + their images ---------- */
export const getGalleryCategories = async () => {
  try {
    // sort categories and their inner images; populate image media
    const json = await fetchFromStrapi(
      `/api/${GALLERY_CATEGORY_SLUG}?sort=sortOrder&populate[gallery_images][populate]=image&populate[gallery_images][sort]=sortOrder`
    );
    const items = json?.data || [];

    return items.map((cat) => {
      const attr = cat.attributes ?? {};
      const title = attr.title || '—';
      const slug = attr.slug || '';

      const images = (attr.gallery_images?.data || []).map((imgItem) => {
        const a = imgItem.attributes ?? {};
        const media = a.image?.data?.attributes;
        const url = media?.url
          ? media.url.startsWith('/')
            ? `${BASE_URL}${media.url}`
            : media.url
          : null;

        return {
          id: imgItem.id,
          src: url,
          alt: media?.alternativeText || a.caption || '',
          caption: a.caption || '',
        };
      });

      return {
        id: cat.id,
        title,
        slug,
        images,
      };
    });
  } catch (err) {
    console.error('getGalleryCategories →', err.message);
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
