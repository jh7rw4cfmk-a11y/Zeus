export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" className="fill-sky-600" />
      <g stroke="white" strokeWidth="2.5" strokeLinecap="round">
        <line x1="24" y1="9" x2="24" y2="39" />
        <line x1="9" y1="24" x2="39" y2="24" />
        <line x1="14.5" y1="14.5" x2="33.5" y2="33.5" />
        <line x1="33.5" y1="14.5" x2="14.5" y2="33.5" />
      </g>
      <circle cx="24" cy="24" r="4" className="fill-white" />
    </svg>
  );
}
