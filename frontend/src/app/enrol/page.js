// app/enrol/page.js

import SkyBackground from '@/components/SkyBackground';
import styles        from '../../styles/Enrol.module.css';
import { Modak }     from 'next/font/google';

const modak = Modak({
  weight: '400',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Enrol – Kiwi Explorers',
  description: 'Enroll your child at Kiwi Explorers today!',
};

export default function EnrolPage() {
  return (
    <main className={styles.enrol}>
      <SkyBackground />

      <section className={styles.sectionCard}>
        <h1 className={`${styles.enrolTitle} ${modak.className}`}>
          Enrol Your Child
        </h1>

        <form className={styles.form} action="/api/enrol" method="POST">
          <div className={styles.formGroup}>
            <label htmlFor="childName">Child’s Full Name</label>
            <input type="text" id="childName" name="childName" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dob">Date of Birth</label>
            <input type="date" id="dob" name="dob" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="startDate">Desired Start Date</label>
            <input type="date" id="startDate" name="startDate" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="parentName">Parent/Guardian Name</label>
            <input type="text" id="parentName" name="parentName" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes">Additional Notes</label>
            <textarea id="notes" name="notes" rows={4} />
          </div>

          <button type="submit" className={styles.submitButton}>
            Submit Enrolment
          </button>
        </form>
      </section>
    </main>
  );
}
