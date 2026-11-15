interface Props {
  refraction: number;
  ripple: number;
}

// Displacement map for the liquid-glass refraction.
export default function LiquidGlassFilter({ refraction, ripple }: Props) {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <filter
        id="liquid-glass"
        filterUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="8192"
        height="8192"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency={`${ripple} ${ripple * 1.5}`}
          numOctaves="2"
          seed="11"
          result="noise"
        />
        <feGaussianBlur in="noise" stdDeviation="2" result="map" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="map"
          scale={refraction}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
      <filter
        id="liquid-glass-strong"
        filterUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="8192"
        height="8192"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency={`${ripple * 1.6} ${ripple * 2.4}`}
          numOctaves="2"
          seed="11"
          result="noise"
        />
        <feGaussianBlur in="noise" stdDeviation="2" result="map" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="map"
          scale={refraction * 2.4}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
