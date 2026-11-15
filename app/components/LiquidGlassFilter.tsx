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
        x="0"
        y="0"
        width="100%"
        height="100%"
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
    </svg>
  );
}
