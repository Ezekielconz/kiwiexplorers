import Image from 'next/image';
import { Modak } from 'next/font/google';
import SkyBackground from '@/components/SkyBackground';
import styles from '@/styles/Gallery.module.css';
import { getGalleryContent, getGalleryCategories } from '@/lib/strapi';

const modak = Modak({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-modak',
});

export const metadata = {
  title: 'Gallery – Kiwi Explorers',
  description: 'A snapshot of play, learning and laughter at Kiwi Explorers.',
};

export default async function GalleryPage() {
  /* server-side data */
  const [galleryContent, categories] = await Promise.all([
    getGalleryContent(),
    getGalleryCategories(),
  ]);

  const headingText = galleryContent?.heroTitle || 'Our Gallery';

  /* same bounce logic as “About” page */
  const heading = headingText.split('').map((ch, i) => {
    const dur   = (1 + Math.random()).toFixed(2) + 's';
    const delay = (-Math.random()).toFixed(2) + 's';
    return (
      <span
        key={i}
        className={styles.bounce}
        style={{ animationDuration: dur, animationDelay: delay }}
      >
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    );
  });

  return (
    <main className={`${styles.gallery} ${modak.variable}`}>
      <SkyBackground />

      <section className={styles.content}>
        <h1 className={modak.className}>
          <span className={styles.galleryTitle}>{heading}</span>
        </h1>

        {categories.length === 0 && <p>No gallery categories found.</p>}

        {categories.map((cat) => (
          <section
            key={cat.id}
            className={styles.categorySection}
            aria-label={cat.title}
          >
            <h2 className={styles.categoryTitle}>{cat.title}</h2>

            {cat.images.length === 0 ? (
              <p>No images in this category.</p>
            ) : (
              <div className={styles.masonry}>
                {cat.images.map((img, idx) => (
                  <figure key={img.id} className={styles.masonryItem}>
                    <div className={styles.imgWrapper}>
                      {img.src ? (
                        <Image
                          src={img.src}
                          alt={img.alt || `${cat.title} image ${idx + 1}`}
                          fill
                          sizes="(min-width:1000px) 33vw,
                                 (min-width:600px) 50vw,
                                 100vw"
                          style={{ objectFit: 'cover' }}
                          priority={idx < 3} /* first row eager-loaded */
                        />
                      ) : (
                        <div aria-label="missing image" className={styles.placeholder} />
                      )}
                      {img.caption && (
                        <figcaption className={styles.caption}>{img.caption}</figcaption>
                      )}
                    </div>
                  </figure>
                ))}
              </div>
            )}
          </section>
        ))}
      </section>
    </main>
  );
}
