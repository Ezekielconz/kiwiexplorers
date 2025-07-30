'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import Cloud from './Cloud';
import Vehicle from './Vehicle';
import styles from '../styles/Home.module.css';

export default function HeroClient({ heroTitle }) {
  /* ---------- Clouds ---------- */
  const [cloudConfigs, setCloudConfigs] = useState([]);

  useEffect(() => {
    const clouds = Array.from({ length: 10 }).map(() => {
      const duration = Math.random() * 40 + 40; // 40–80 s
      return {
        top:    `${Math.random() * 80 + 10}%`,
        size:   `${Math.random() * 120 + 80}px`,
        duration: `${duration}s`,
        delay:    `${-Math.random() * duration}s`,
      };
    });
    setCloudConfigs(clouds);
  }, []);

  /* ---------- Vehicles ---------- */
  const MAX_VEHICLES = 2; // cap in-flight vehicles
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const vehicleTypes = ['airballoon', 'plane', 'zeppelin', 'helicopter'];
    let timer; // keep reference so we can clear it on unmount

    // schedule the next spawn in 5–10 s
    function scheduleNext() {
      const ms = Math.random() * 5000 + 5000;
      timer = setTimeout(spawn, ms);
    }

    // create one vehicle config (if we have a free slot)
    function spawn() {
      setVehicles(v => {
        if (v.length >= MAX_VEHICLES) {
          return v; // cap reached → skip adding
        }

        const type     = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
        const duration = Math.random() * 20 + 20;          // 20–40 s
        const id       = `${Date.now()}-${Math.random()}`;

        return [
          ...v,
          {
            id,
            type,
            top:      `${Math.random() * 60 + 20}%`,
            size:     `${Math.random() * 80 + 80}px`,
            duration: `${duration}s`,
            delay:    '0s',
          },
        ];
      });

      scheduleNext();
    }

    scheduleNext();
    return () => {
      clearTimeout(timer);
      setVehicles([]);
    };
  }, []);

  // remove vehicle when its CSS animation ends
  const handleEnd = id => {
    setVehicles(v => v.filter(x => x.id !== id));
  };

  /* ---------- Render ---------- */
  return (
    <section className={styles.hero}>
      {/* Clouds */}
      <div className={styles.cloudContainer}>
        {cloudConfigs.map((cfg, i) => (
          <Cloud key={`cloud-${i}`} {...cfg} />
        ))}
      </div>

      {/* Vehicles */}
      <div className={styles.vehicleContainer}>
        {vehicles.map(cfg => (
          <Vehicle
            key={cfg.id}
            {...cfg}
            onAnimationEnd={() => handleEnd(cfg.id)}
          />
        ))}
      </div>

      {/* Hero content */}
      <motion.h1
        className={`${styles.title} atma-bold`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {heroTitle}
      </motion.h1>

      <motion.p
        className={styles.sub}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Where little explorers learn &amp; grow every day!
      </motion.p>

      <div className={styles.buttonGroup}>
        <Link href="/about" className={styles.secondaryButton}>
          Discover
        </Link>
        <motion.a
          href="/enrol"
          className={styles.cta}
          initial={{ scale: 0.9 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          Enrol&nbsp;Now
        </motion.a>
      </div>
    </section>
  );
}
