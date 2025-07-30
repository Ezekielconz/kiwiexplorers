// components/Footer.js
'use client'

import { useMemo } from 'react'
import styles from '../styles/Footer.module.css'

export default function Footer() {
  // ← change this number to control how many trees appear
  const TREE_COUNT = 8

  // constants matching our <svg viewBox="0 0 1200 240">
  const VIEW_WIDTH      = 1200
  const TRUNK_BASE      = 501.649 // y-coordinate of the very bottom of the trunk in the raw SVG

  // tweak these to change how big/small your trees can be
  const MIN_SCALE       = 0.18
  const MAX_SCALE       = 0.30

  // per-tree baseline range (random for each tree)
  const BASELINE_MIN    = 160
  const BASELINE_MAX    = 240

  // generate tree positions once per-mount
  const trees = useMemo(() => {
    return Array.from({ length: TREE_COUNT }).map(() => {
      const scale    = Math.random() * (MAX_SCALE - MIN_SCALE) + MIN_SCALE
      const x        = Math.random() * VIEW_WIDTH
      const baseline = Math.random() * (BASELINE_MAX - BASELINE_MIN) + BASELINE_MIN
      // translate so that (trunk base * scale) lands at this tree's baseline
      const y        = baseline - TRUNK_BASE * scale
      return { x, y, scale }
    })
  }, [TREE_COUNT])

  // the four <path> fragments from your SVG-Repo tree
  const TREE_PATHS = [
    {
      fill: "#95673F",
      d: "M338.254,501.649c-2.671,6.233-8.682,10.351-15.471,10.351H189.217c-6.79,0-12.8-4.118-15.471-10.351c-2.56-6.233-1.113-13.357,3.673-18.143c18.365-18.365,28.494-42.852,28.494-68.786v-80.807c0-9.238,7.457-16.696,16.696-16.696l66.783,0.223c9.238,0,16.696,7.457,16.696,16.696v80.584c0,25.934,10.129,50.421,28.494,68.786C339.367,488.292,340.814,495.416,338.254,501.649z"
    },
    {
      fill: "#875334",
      d: "M338.254,501.649c-2.671,6.233-8.682,10.351-15.471,10.351H256V317.329l33.391,0.111c9.238,0,16.696,7.457,16.696,16.696v80.584c0,25.934,10.129,50.421,28.494,68.786C339.367,488.292,340.814,495.416,338.254,501.649z"
    },
    {
      fill: "#9DCA40",
      d: "M456.236,162.838c-1.224-29.384-17.809-58.212-44.522-77.134c-19.59-13.802-39.736-20.035-61.329-18.699C336.584,27.381,299.075,0,256,0s-80.584,27.381-94.386,67.005c-22.483-1.336-42.852,5.677-61.329,18.699c-26.713,18.922-43.297,47.75-44.522,77.134c-1.002,25.043,7.457,49.308,23.485,68.452c-8.904,22.483-9.238,46.414-0.89,69.675c11.687,32.39,39.29,56.877,72.014,63.89c34.727,7.569,70.01-3.005,94.275-28.16c3.117-3.228,7.235-4.675,11.353-4.564c3.45,0.11,6.901,1.446,9.683,4.007c28.271,27.047,62.664,35.951,96.056,28.716c32.612-7.012,60.216-31.499,71.903-63.89c8.458-23.485,7.68-47.972-0.779-69.899C448.89,212.035,457.238,187.77,456.236,162.838z"
    },
    {
      fill: "#8EB043",
      d: "M432.863,231.068c8.459,21.927,9.238,46.414,0.779,69.899c-11.687,32.39-39.29,56.877-71.903,63.89c-33.391,7.235-67.784-1.67-96.056-28.717c-2.783-2.56-6.233-3.896-9.683-4.007V0c43.075,0,80.584,27.381,94.386,67.005c21.593-1.336,41.739,4.897,61.329,18.699c26.713,18.922,43.297,47.75,44.522,77.134C457.238,187.77,448.89,212.035,432.863,231.068z"
    },
  ]

  return (
    <footer className={styles.footer}>
      <svg
        className={styles.hillSvg}
        viewBox="0 0 1200 240"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* static hill */}
        <path
          d="M0,120 Q300,60 600,120 T1200,120 L1200,240 L0,240 Z"
          fill="#81C784"
        />

        {/* each tree lands on its own random baseline between 160–240 */}
        {trees.map(({ x, y, scale }, i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${scale})`}>
            {TREE_PATHS.map((p, j) => (
              <path key={j} fill={p.fill} d={p.d} />
            ))}
          </g>
        ))}
      </svg>

      <div className={styles.content}>
        <p>© 2025 Kiwi Explorers. All rights reserved.</p>
        <nav className={styles.links}>
          <a href="/about">About</a>
          <a href="/gallery">Gallery</a>
          <a href="/contact">Contact</a>
          <a href="/enrol">Enrol</a>
        </nav>
      </div>
    </footer>
  )
}
