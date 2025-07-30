// app/gallery/page.js

import SkyBackground from '@/components/SkyBackground';
import styles       from '../../styles/Gallery.module.css';

export const metadata = {
  title: 'Gallery – Kiwi Explorers',
  description:
    'A snapshot of play, learning and laughter at Kiwi Explorers.',
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
  return (
    <main className={styles.gallery}>
      {/* backdrop animation (client-only) */}
      <SkyBackground />

      <section className={styles.content}>
        <h1>Our Gallery</h1>
        <div className={styles.grid}>
          {images.map((src, idx) => (
            <div key={idx} className={styles.gridItem}>
              <img
                src={src}
                alt={`Kiwi Explorers gallery image ${idx + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
