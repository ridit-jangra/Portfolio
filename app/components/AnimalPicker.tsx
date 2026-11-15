import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import type { AnimalKey } from "../engine";

export interface PickerOption {
  value: AnimalKey;
  label: string;
  swatch?: string;
}

interface Props {
  options: PickerOption[];
  value: AnimalKey;
  onChange: (value: AnimalKey) => void;
}

/** Radio group with a sliding "thumb" behind the selected option. */
export default function AnimalPicker({ options, value, onChange }: Props) {
  const thumbRef = useRef<HTMLSpanElement>(null);
  const buttonRefs = useRef<Partial<Record<AnimalKey, HTMLButtonElement | null>>>({});

  const placeThumb = useCallback(() => {
    const button = buttonRefs.current[value];
    const thumb = thumbRef.current;
    if (!button || !thumb) return;
    thumb.style.translate = `${button.offsetLeft}px 0`;
    thumb.style.width = `${button.offsetWidth}px`;
  }, [value]);

  useLayoutEffect(placeThumb, [placeThumb]);

  useEffect(() => {
    void document.fonts?.ready.then(placeThumb);
    window.addEventListener("resize", placeThumb);
    return () => window.removeEventListener("resize", placeThumb);
  }, [placeThumb]);

  useEffect(() => {
    buttonRefs.current[value]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [value]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const index = options.findIndex((o) => buttonRefs.current[o.value] === document.activeElement);
    if (index < 0) return;
    e.preventDefault();
    const step = e.key === "ArrowRight" ? 1 : -1;
    const next = options[(index + step + options.length) % options.length];
    buttonRefs.current[next.value]?.focus();
    onChange(next.value);
  };

  return (
    <div className="choices glass" role="radiogroup" aria-label="Animal" onKeyDown={onKeyDown}>
      <span ref={thumbRef} className="thumb" aria-hidden="true" />
      {options.map((o) => (
        <button
          key={o.value}
          ref={(el) => {
            buttonRefs.current[o.value] = el;
          }}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          tabIndex={o.value === value ? 0 : -1}
          onClick={() => onChange(o.value)}
        >
          {o.swatch && (
            <span
              className="dot"
              style={{ "--swatch": o.swatch } as CSSProperties}
              aria-hidden="true"
            />
          )}
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}
