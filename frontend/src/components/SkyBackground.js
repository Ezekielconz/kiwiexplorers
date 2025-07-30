'use client';

import { useState, useEffect } from 'react';
import Cloud   from './Cloud';
import Vehicle from './Vehicle';
import styles  from '../styles/Home.module.css'; // re-use the same containers

/**
 * Pure visual backdrop: clouds + occasional vehicles.
 * No headings, no CTA.
 */
export default function SkyBackground() {
  /* ---------- Clouds ---------- */
  const [clouds, setClouds] = useState([]);

  useEffect(() => {
    const cfg = Array.from({ length: 10 }).map(() => {
      const dur = Math.random() * 40 + 40;            // 40–80 s
      return {
        top:      `${Math.random() * 80 + 10}%`,
        size:     `${Math.random() * 120 + 80}px`,
        duration: `${dur}s`,
        delay:    `${-Math.random() * dur}s`,
      };
    });
    setClouds(cfg);
  }, []);

  /* ---------- Vehicles ---------- */
  const MAX_VEHICLES = 2;
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const types = ['airballoon', 'plane', 'zeppelin', 'helicopter'];
    let timer;

    function spawn() {
      setVehicles(v => {
        if (v.length >= MAX_VEHICLES) return v;
        const dur = Math.random() * 20 + 20; // 20–40 s
        return [
          ...v,
          {
            id:       `${Date.now()}-${Math.random()}`,
            type:     types[Math.floor(Math.random() * types.length)],
            top:      `${Math.random() * 60 + 20}%`,
            size:     `${Math.random() * 80 + 80}px`,
            duration: `${dur}s`,
            delay:    '0s',
          },
        ];
      });
      timer = setTimeout(spawn, Math.random() * 5000 + 5000); // 5–10 s
    }
    spawn();
    return () => clearTimeout(timer);
  }, []);

  const handleEnd = id =>
    setVehicles(v => v.filter(item => item.id !== id));

  /* ---------- Render ---------- */
  return (
    <>
      <div className={styles.cloudContainer} aria-hidden="true">
        {clouds.map((c, i) => <Cloud key={`cloud-${i}`} {...c} />)}
      </div>

      <div className={styles.vehicleContainer} aria-hidden="true">
        {vehicles.map(cfg => (
          <Vehicle key={cfg.id} {...cfg} onAnimationEnd={() => handleEnd(cfg.id)} />
        ))}
      </div>
    </>
  );
}
