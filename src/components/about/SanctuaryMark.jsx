/**
 * Open-book mark from the "Paper Sanctuary" card (Figma group 296:202), assembled from the
 * design's own vector paths. Colours follow the theme tokens.
 */
export default function SanctuaryMark({ className = "" }) {
  return (
    <svg
      viewBox="-2 -1 119.5 111"
      width="115.5"
      height="109"
      aria-hidden="true"
      className={`text-primary ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {/* Book */}
      <path
        transform="translate(-1 28.02)"
        d="M58.5 16.9841C51 0.484313 25.4552 -2.98657 1 5.98412V62.9841C32.2159 55.1052 47.4237 54.2936 58.5 77.9841C66.3416 58.3159 79.573 55.1286 116.5 62.9841V5.98412C83.4108 -2.97866 71.0252 -0.170151 58.5 16.9841Z"
        className="fill-surface"
      />
      {/* Page curves */}
      <path
        transform="translate(11 40)"
        d="M1.00009 2.95534C17.9217 1.04188 28.6382 -3.06292 38.5001 12.4553"
        strokeOpacity="0.4"
        strokeLinecap="round"
      />
      <path
        transform="translate(101.5 40) scale(-1 1)"
        d="M1.00009 2.95534C17.9217 1.04188 28.6382 -3.06292 38.5001 12.4553"
        strokeOpacity="0.4"
        strokeLinecap="round"
      />
      {/* Spine */}
      <line x1="57.5" y1="44" x2="57.5" y2="104" />
      {/* Little sun with rays */}
      <circle cx="58" cy="14" r="8.5" strokeWidth="1.3" strokeDasharray="2.2 1.8" />
      <line x1="58" y1="0" x2="58" y2="3" />
      <line x1="58" y1="26" x2="58" y2="29" />
      <line x1="44" y1="14" x2="47" y2="14" />
      <line x1="69" y1="14" x2="72" y2="14" />
    </svg>
  );
}
