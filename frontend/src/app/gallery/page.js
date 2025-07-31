// app/gallery/page.js

import Image from 'next/image';
import SkyBackground from '@/components/SkyBackground';
import styles from '../../styles/Gallery.module.css';
import { Modak } from 'next/font/google';

const modak = Modak({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-modak',
});

export const metadata = {
  title: 'Gallery – Kiwi Explorers',
  description: 'A snapshot of play, learning and laughter at Kiwi Explorers.',
};

const images = [
  '/gallery/circle-time.jpg',
  '/gallery/outdoor-play.jpg',
  '/gallery/art-project.jpg',
  '/gallery/nature-walk.jpg',
  '/gallery/music-time.jpg',
  '/gallery/snack-time.jpg',
];

export default function GalleryPage() {
  const heading = 'Our Gallery'.split('').map((ch, i) => {
    // staggered but independent bobbing
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

        <div className={styles.grid}>
          {images.map((src, idx) => (
            <div key={idx} className={styles.gridItem}>
              <div className={styles.imageWrapper}>
                <Image
                  src={src}
                  alt={`Kiwi Explorers gallery image ${idx + 1}`}
                  fill
                  sizes="(min-width:1000px) 33vw, (min-width:600px) 50vw, 100vw"
                  style={{ objectFit: 'cover' }}
                  priority={idx < 3}
                  placeholder="blur"
                  blurDataURL="/placeholder.png"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
