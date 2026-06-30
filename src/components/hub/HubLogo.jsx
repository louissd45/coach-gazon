export default function HubLogo({ size = 40 }) {
  return (
    <div className="hub-logo">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle className="hub-logo__ring" cx="24" cy="24" r="21.5" strokeWidth="1.4" />
        <path
          className="hub-logo__leaf"
          d="M24 35C24 35 14 29 14 18.5C14 12.5 18.5 8 24 8C29.5 8 34 12.5 34 18.5C34 29 24 35 24 35Z"
        />
        <path
          className="hub-logo__vein"
          d="M24 35C24 28 24 21 24 18C24 14 20.5 10 16.5 9"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <circle className="hub-logo__dot" cx="38" cy="14" r="3" />
      </svg>
      <span className="hub-logo__text">Mon Coach Extérieur</span>
    </div>
  );
}
