import Image from 'next/image';
import SkyBackground from '@/components/SkyBackground';
import styles from '../../styles/Gallery.module.css';
import { Modak } from 'next/font/google';
import {
  getGalleryContent,
  getGalleryCategories,
} from '@/lib/strapi';

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
  const [galleryContent, categories] = await Promise.all([
    getGalleryContent(),
    getGalleryCategories(),
  ]);

  const headingText = galleryContent?.heroTitle || 'Our Gallery';

  const heading = headingText.split('').map((ch, i) => {
    const delay = (i * 0.08).toFixed(2) + 's';
    return (
      <span
        key={i}
        className={styles.bounce}
        style={{ animationDelay: delay }}
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

        {categories.length === 0 ? (
          <p>No gallery categories found.</p>
        ) : (
          categories.map((cat) => (
            <section
              key={cat.id}
              className={styles.categorySection}
              aria-label={cat.title}
            >
              <h2 className={styles.categoryTitle}>{cat.title}</h2>

              {cat.images.length === 0 ? (
                <p>No images in this category.</p>
              ) : (
                <div className={styles.grid}>
                  {cat.images.map((img, idx) => (
                    <div key={img.id} className={styles.gridItem}>
                      <div className={styles.imageWrapper}>
                        {img.src ? (
                          <Image
                            src={img.src}
                            alt={img.alt || `${cat.title} image ${idx + 1}`}
                            fill
                            sizes="(min-width:1000px) 33vw, (min-width:600px) 50vw, 100vw"
                            style={{ objectFit: 'cover' }}
                            priority={idx < 3}
                          />
                        ) : (
                          <div
                            aria-label="missing image"
                            style={{
                              background: '#eee',
                              width: '100%',
                              height: '100%',
                            }}
                          />
                        )}
                      </div>
                      {img.caption && (
                        <div className={styles.caption}>{img.caption}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))
        )}
      </section>
    </main>
  );
}
