import SkyBackground from '@/components/SkyBackground';
import styles        from '../../styles/Contact.module.css';
import { Modak }     from 'next/font/google';

const modak = Modak({ weight: '400', subsets: ['latin'] });

export const metadata = {
  title: 'Contact – Kiwi Explorers',
  description: 'Have a question or want to chat? Reach out to Kiwi Explorers!',
};

export default function ContactPage() {
  /* animated Modak heading */
  const heading = 'Contact Us'.split('').map((ch, i) => {
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
    <main className={styles.contact}>
      <SkyBackground />

      <section className={styles.sectionCard}>
        <h1 className={`${styles.cardTitle} ${modak.className}`}>{heading}</h1>

        <form className={styles.form} action="/api/contact" method="POST">
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="6" required />
          </div>

          {/* Ribbon-style submit button */}
          <button type="submit" className={styles.submitButton}>
            Send&nbsp;Message
          </button>
        </form>
      </section>
    </main>
  );
}
