// components/SkyBackground.js
'use client';

import { useState, useEffect } from 'react';
import Cloud   from './Cloud';
import Vehicle from './Vehicle';

/* CSS modules */
import back  from '../styles/SkyBackground.module.css';
import home  from '../styles/Home.module.css';

import { useRouteTransition } from '@/contexts/RouteTransitionContext';

/* ------------------------------------------------------------
   Clouds are generated **once per browser tab** so positions
   stay identical while you navigate around the site.
------------------------------------------------------------ */
const INITIAL_CLOUDS = Array.from({ length: 10 }).map(() => {
  const dur = Math.random() * 40 + 40;            // 40–80 s
  return {
    // now 10%–80% (never in bottom 20vh)
    top:      `${Math.random() * 70 + 10}%`,
    size:     `${Math.random() * 120 + 80}px`,
    duration: `${dur}s`,
    delay:    `${-Math.random() * dur}s`,
  };
});

export default function SkyBackground() {
  /* ---------- Clouds (static) ---------- */
  const [clouds] = useState(INITIAL_CLOUDS);

  /* ---------- Vehicles (spawn over time) ---------- */
  const MAX = 2;
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const kinds = ['airballoon', 'plane', 'zeppelin', 'helicopter'];
    let timer;

    function spawn() {
      setVehicles(v => {
        if (v.length >= MAX) return v;
        const dur = Math.random() * 20 + 20;      // 20–40 s
        return [
          ...v,
          {
            id:    `${Date.now()}-${Math.random()}`,
            type:  kinds[Math.floor(Math.random() * kinds.length)],
            // already 20%–80%, so bottom 20vh is clear
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

  /* ---------- Exit-transition support ---------- */
  const { state, reset } = useRouteTransition();
  const exiting = state === 'exit';

  return (
    <div
      className={`${back.backdrop} ${exiting ? back.exit : ''}`}
      onTransitionEnd={exiting ? reset : undefined}
      aria-hidden="true"
    >
      <div className={home.cloudContainer}>
        {clouds.map((c, i) => (
          <Cloud key={`cloud-${i}`} {...c} />
        ))}
      </div>

      <div className={home.vehicleContainer}>
        {vehicles.map(v => (
          <Vehicle
            key={v.id}
            {...v}
            onAnimationEnd={() => handleEnd(v.id)}
          />
        ))}
      </div>
    </div>
  );
}
