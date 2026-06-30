export default function Logo({ size = 26 }) {
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
          d="M16 28C16 28 7 23 7 13.5C7 8 11 4 16 4C21 4 25 8 25 13.5C25 23 16 28 16 28Z"
          stroke="var(--gold)"
          strokeWidth="1.2"
        />
        <path
          d="M16 28C16 22 16 16 16 13C16 9.5 13 6 9.5 5"
          stroke="var(--forest)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M16 19C16 19 19.5 17.5 20.5 14"
          stroke="var(--forest)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
      <span className="logo__text">Coach Gazon</span>
    </div>
  );
}
