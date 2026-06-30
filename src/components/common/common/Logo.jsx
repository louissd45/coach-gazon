export default function Logo({ size = 28 }) {
  return (
    <div className="logo">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M16 29C16 29 6 24 6 13C6 7 10 3 16 3C22 3 26 7 26 13C26 24 16 29 16 29Z"
          fill="var(--lawn-fresh)"
        />
        <path
          d="M16 29C16 29 16 18 16 13C16 9 13 5 9 4"
          stroke="var(--lawn-deep)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="logo__text">Coach Gazon</span>
    </div>
  );
}
