import React from 'react';

export function Doodle({ name, className = '', color = 'currentColor', width = 24, height = 24 }) {
  const svgMap = {
    rocket: (
      <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
    star: (
      <svg width={width} height={height} viewBox="0 0 24 24" fill={color} stroke="none" className={className}>
        <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
      </svg>
    ),
    sparkle: (
      <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className={className}>
        <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
      </svg>
    ),
    arrow: (
      <svg width={width} height={height} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 20 Q 20 5, 35 20 M35 20 L 25 10 M35 20 L 25 30" />
      </svg>
    ),
    underline: (
      <svg width={width} height={height} viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" className={className}>
        <path d="M5 8 Q 100 0, 195 8" stroke={color} strokeWidth="6" strokeLinecap="round" />
      </svg>
    ),
    squiggle: (
      <svg width={width} height={height} viewBox="0 0 200 20" fill="none" preserveAspectRatio="none" className={className}>
        <path d="M5 10 Q 30 -5, 60 15 T 120 5 T 195 15" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    loop: (
      <svg width={width} height={height} viewBox="0 0 100 40" fill="none" preserveAspectRatio="none" className={className}>
        <path d="M5 20 C 5 5, 95 5, 95 20 C 95 35, 5 35, 5 20" stroke={color} strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />
      </svg>
    ),
    scribble: (
      <svg width={width} height={height} viewBox="0 0 200 40" fill="none" preserveAspectRatio="none" className={className}>
        <path d="M10 20 Q 50 5, 100 20 T 190 20" stroke={color} strokeWidth="15" strokeLinecap="round" />
      </svg>
    ),
    burst: (
       <svg width={width} height={height} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M50 10 L 55 40 L 90 30 L 60 55 L 85 85 L 50 65 L 15 85 L 40 55 L 10 30 L 45 40 Z" />
       </svg>
    ),
    dot: (
      <svg width={width} height={height} viewBox="0 0 20 20" fill={color} className={className}>
        <circle cx="10" cy="10" r="10" />
      </svg>
    )
  };

  return svgMap[name] || null;
}
