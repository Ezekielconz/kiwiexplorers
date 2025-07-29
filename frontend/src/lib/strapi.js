// src/lib/strapi.js

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
if (!API_URL) {
  throw new Error('Missing NEXT_PUBLIC_STRAPI_API_URL in your .env.local');
}

const SLUG = process.env.STRAPI_HOMEPAGE_SLUG || 'homepage';

/**
 * Fetch the Homepage single type and return its fields.
 * Handles Strapi v5 “flattened” single-type response.
 */
export async function getHomePage() {
  const endpoint = `${API_URL.replace(/\/$/, '')}/api/${SLUG}`;
  if (process.env.NODE_ENV === 'development') {
    console.log('⟳ fetching', endpoint);
  }
  const res = await fetch(endpoint);

  // if there’s no entry yet, Strapi returns 404
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.status}`);
  }

  const json = await res.json();
  const rawData = json.data;

  // Strapi v4 used rawData.attributes
  // Strapi v5 for single types flattens fields onto rawData
  const attrs = rawData.attributes ?? rawData;

  return attrs;
}
