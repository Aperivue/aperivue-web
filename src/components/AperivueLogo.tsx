interface AperivueLogoProps {
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { icon: 24, text: "text-base" },
  md: { icon: 32, text: "text-xl" },
  lg: { icon: 48, text: "text-3xl" },
};

function ApertureIcon({ size = 32 }: { size?: number }) {
  const cx = 50;
  const cy = 50;
  const bladeCount = 6;
  const outerR = 38;
  const innerR = 14;

  // Generate aperture blades
  const blades = Array.from({ length: bladeCount }, (_, i) => {
    const angle = (i * 360) / bladeCount - 90;
    const nextAngle = ((i + 1) * 360) / bladeCount - 90;
    const rad = (angle * Math.PI) / 180;
    const nextRad = (nextAngle * Math.PI) / 180;
    const midRad = ((angle + nextAngle) / 2 * Math.PI) / 180;

    const x1 = cx + outerR * Math.cos(rad);
    const y1 = cy + outerR * Math.sin(rad);
    const x2 = cx + innerR * Math.cos(midRad);
    const y2 = cy + innerR * Math.sin(midRad);
    const x3 = cx + outerR * Math.cos(nextRad);
    const y3 = cy + outerR * Math.sin(nextRad);

    return `M${x1},${y1} L${x2},${y2} L${x3},${y3} Z`;
  });

  // Eye shape (vesica piscis)
  const eyeW = 46;
  const eyeH = 22;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Aperivue logo"
    >
      <defs>
        <linearGradient id="aperivue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--primary, #1e40af)" />
          <stop offset="100%" stopColor="var(--accent, #0891b2)" />
        </linearGradient>
        <clipPath id="eye-clip">
          <path
            d={`M${cx - eyeW},${cy} Q${cx},${cy - eyeH} ${cx + eyeW},${cy} Q${cx},${cy + eyeH} ${cx - eyeW},${cy} Z`}
          />
        </clipPath>
      </defs>

      {/* Eye outline */}
      <path
        d={`M${cx - eyeW},${cy} Q${cx},${cy - eyeH} ${cx + eyeW},${cy} Q${cx},${cy + eyeH} ${cx - eyeW},${cy} Z`}
        stroke="url(#aperivue-grad)"
        strokeWidth="2.5"
        fill="none"
      />

      {/* Aperture blades inside eye */}
      <g clipPath="url(#eye-clip)" opacity="0.85">
        {blades.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="url(#aperivue-grad)"
            opacity={0.6 + (i % 2) * 0.15}
          />
        ))}
      </g>

      {/* Center pupil */}
      <circle cx={cx} cy={cy} r={6} fill="url(#aperivue-grad)" />
      <circle cx={cx} cy={cy} r={3} fill="var(--background, #f8fafc)" />
    </svg>
  );
}

export default function AperivueLogo({
  variant = "full",
  size = "md",
  className = "",
}: AperivueLogoProps) {
  const s = sizes[size];

  if (variant === "icon") {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <ApertureIcon size={s.icon} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <ApertureIcon size={s.icon} />
      <span className={`${s.text} font-semibold tracking-tight`} style={{ letterSpacing: "-0.02em" }}>
        <span className="text-primary">aperi</span>
        <span className="text-accent">vue</span>
      </span>
    </span>
  );
}
