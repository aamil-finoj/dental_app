export function NatureBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Day scene */}
      <svg
        className="absolute inset-0 h-full w-full opacity-70 dark:hidden"
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMax slice"
      >
        <circle cx="720" cy="300" r="55" fill="#fde68a" opacity="0.5" />

        <g fill="#ffffff" opacity="0.65">
          <ellipse cx="610" cy="280" rx="42" ry="16" />
          <ellipse cx="568" cy="274" rx="30" ry="13" />
          <ellipse cx="850" cy="330" rx="42" ry="16" />
          <ellipse cx="888" cy="324" rx="30" ry="13" />
        </g>

        <g stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.45">
          <path d="M640,250 q8,-8 16,0 q8,-8 16,0" />
          <path d="M790,235 q6,-6 12,0 q6,-6 12,0" />
        </g>

        <path
          d="M0,420 C240,360 480,460 720,400 C960,340 1200,420 1440,380 L1440,600 L0,600 Z"
          className="hill-day-back"
        />
        <path
          d="M0,480 C200,440 500,500 760,460 C1000,430 1250,490 1440,450 L1440,600 L0,600 Z"
          className="hill-day-mid"
        />
        <path
          d="M0,540 C220,510 460,560 700,530 C950,500 1200,555 1440,520 L1440,600 L0,600 Z"
          className="hill-day-front"
        />

        <g opacity="0.9">
          <rect x="617" y="510" width="6" height="24" rx="2" fill="#a9835f" />
          <circle cx="620" cy="502" r="20" fill="#7fbf9e" />
          <rect x="717" y="495" width="6" height="26" rx="2" fill="#a9835f" />
          <circle cx="720" cy="487" r="24" fill="#74b393" />
          <rect x="817" y="503" width="6" height="24" rx="2" fill="#a9835f" />
          <circle cx="820" cy="495" r="19" fill="#89c7a5" />
        </g>
      </svg>

      {/* Night scene */}
      <svg
        className="absolute inset-0 hidden h-full w-full opacity-80 dark:block"
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMax slice"
      >
        <circle cx="720" cy="300" r="58" fill="#f3e9d2" opacity="0.05" />
        <circle cx="720" cy="300" r="34" fill="#f3e9d2" opacity="0.28" />

        <g fill="#f5f0dc" opacity="0.55">
          <circle cx="600" cy="260" r="2" />
          <circle cx="640" cy="330" r="1.6" />
          <circle cx="580" cy="300" r="2" />
          <circle cx="800" cy="270" r="2" />
          <circle cx="840" cy="320" r="1.5" />
          <circle cx="860" cy="250" r="2" />
          <circle cx="660" cy="235" r="1.6" />
          <circle cx="790" cy="235" r="1.4" />
        </g>

        <path
          d="M0,420 C240,360 480,460 720,400 C960,340 1200,420 1440,380 L1440,600 L0,600 Z"
          className="hill-night-back"
        />
        <path
          d="M0,480 C200,440 500,500 760,460 C1000,430 1250,490 1440,450 L1440,600 L0,600 Z"
          className="hill-night-mid"
        />
        <path
          d="M0,540 C220,510 460,560 700,530 C950,500 1200,555 1440,520 L1440,600 L0,600 Z"
          className="hill-night-front"
        />

        <g fill="#0f1729" opacity="0.95">
          <path d="M620,532 L633,494 L646,532 Z" />
          <path d="M720,517 L736,472 L752,517 Z" />
          <path d="M820,525 L833,490 L846,525 Z" />
        </g>
      </svg>
    </div>
  );
}
