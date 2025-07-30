// app/contact/page.js

import SkyBackground from '@/components/SkyBackground';
import styles       from '../../styles/Contact.module.css';

export const metadata = {
  title: 'Contact – Kiwi Explorers',
  description: 'Have a question or want to chat? Reach out to Kiwi Explorers!',
};

export default function ContactPage() {
  return (
    <main className={styles.contact}>
      {/* animated backdrop – client-only */}
      <SkyBackground />

      <section className={styles.content}>
        <h1>Contact Us</h1>
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

          <button type="submit" className={styles.submitButton}>
            Send Message
          </button>
        </form>
      </section>
    </main>
  );
}
