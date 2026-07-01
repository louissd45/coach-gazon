export default function BrandLogo({ size = 32, white = false }) {
  const leaf = white ? 'white' : '#1b4332';
  const drop = white ? 'rgba(255,255,255,0.8)' : '#2d9cdb';
  const text = white ? 'white' : '#1b4332';

  return (
    <div className="brand-logo">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Feuille */}
        <path
          d="M20 34C20 34 9 27 9 16C9 9.5 14 5 20 5C26 5 31 9.5 31 16C31 27 20 34 20 34Z"
          fill={leaf}
        />
        {/* Nervure centrale */}
        <path
          d="M20 34C20 26 20 19 20 16C20 12 17 8 13 7"
          stroke="white"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {/* Petite nervure latérale */}
        <path
          d="M20 22C20 22 24 20 25 17"
          stroke="white"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        {/* Goutte d'eau */}
        <path
          d="M30 10C30 10 28 7 28 5.5C28 4.1 29 3 30 3C31 3 32 4.1 32 5.5C32 7 30 10 30 10Z"
          fill={drop}
        />
      </svg>
      <div className="brand-logo__text">
        <span className="brand-logo__mon">MON EXPERT</span>
        <span className="brand-logo__name">JARDIN</span>
      </div>
    </div>
  );
}
