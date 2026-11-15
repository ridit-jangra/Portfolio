import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ANIMALS, SHARED_CONTROLS } from "../engine";
import type { AnimalKey, KnobSpec } from "../engine";
import { GLASS_DEFAULTS, STORAGE_PREFIX } from "../tweaks";
import type { GlassSettings, Tweaks } from "../tweaks";

const OPEN_KEY = `${STORAGE_PREFIX}tweaks-open`;

const GLASS_CONTROLS: [keyof GlassSettings, string, number, number, number, string][] = [
  ["blur", "Blur (px)", 0, 30, 0.5, "How frosted the chat box is: how much it blurs what's behind it."],
  ["refraction", "Refraction", 0, 150, 1, "How strongly the glass bends what's behind it, like liquid glass (Chrome and Edge only)."],
  ["ripple", "Ripple", 0.001, 0.04, 0.001, "Size of the refraction ripples: higher is finer and busier, lower is broad and smooth."],
  ["tint", "Tint", 0, 3, 0.05, "How milky the glass is. 0 is perfectly clear."],
  ["edge", "Edge", 0, 2, 0.05, "How strong the glass borders and their bright rims are, on the chat box, the animal bar at the top and this panel. 0 hides them."],
  ["radius", "Corner radius", 0, 48, 1, "How rounded the chat box's corners are."],
  ["width", "Width", 320, 960, 10, "How wide the chat box is."],
];

const decimals = (step: number) => (step >= 1 ? 0 : Math.min(3, Math.ceil(-Math.log10(step))));

function readOpen(): boolean {
  try {
    return localStorage.getItem(OPEN_KEY) === "1";
  } catch {
    return false;
  }
}

interface RowBase {
  key: string;
  label: string;
  hint: string;
}
interface RangeRow extends RowBase {
  kind: "range";
  min: number;
  max: number;
  step: number;
  def: number;
  value: number;
  set: (value: number) => void;
  disabled?: boolean;
}
interface ToggleRow extends RowBase {
  kind: "toggle";
  def: boolean;
  value: boolean;
  set: (value: boolean) => void;
}
type RowDef = RangeRow | ToggleRow;
type Group = [title: string, rows: RowDef[]];

/** Turns an animal's control definitions into rows the panel can render. */
function buildGroups(animal: AnimalKey, tweaks: Tweaks): Group[] {
  const config = ANIMALS[animal];
  const hidden = new Set<string>(config.hide ?? []);

  const tuningRow = (o: KnobSpec): RowDef => {
    const base = { key: o.key, label: o.label, hint: o.hint };
    const value = tweaks.tuning[o.key];
    const def = config.defaults[o.key];
    const set = (v: number | boolean) => tweaks.setTuning(o.key, v);
    if ("toggle" in o) {
      return { ...base, kind: "toggle", def: !!def, value: !!value, set };
    }
    return {
      ...base,
      kind: "range",
      min: o.min,
      max: o.max,
      step: o.step,
      def: Number(def),
      value: Number(value),
      set,
      disabled: o.disabledWhen ? !!tweaks.tuning[o.disabledWhen] : false,
    };
  };
  const shared = (list: KnobSpec[]) => list.filter((o) => !hidden.has(o.key)).map(tuningRow);

  const glassRows: RangeRow[] = GLASS_CONTROLS.map(([key, label, min, max, step, hint]) => ({
    key,
    label,
    hint,
    min,
    max,
    step,
    kind: "range",
    def: GLASS_DEFAULTS[key],
    value: tweaks.glass[key],
    set: (v: number) => tweaks.setGlassValue(key, v),
  }));

  return [
    ["Movement", shared(SHARED_CONTROLS.movement)],
    ...config.controls.map(([title, items]): Group => [title, items.map(tuningRow)]),
    ["Look", shared(SHARED_CONTROLS.look)],
    ["Chat glass", glassRows],
  ];
}

function Row({ row, onTip }: { row: RowDef; onTip: (row: HTMLElement | null, hint?: string) => void }) {
  const reset = (e: React.MouseEvent) => {
    e.preventDefault();
    (row.set as (v: number | boolean) => void)(row.def);
  };
  const show = (e: React.SyntheticEvent<HTMLElement>) => onTip(e.currentTarget, row.hint);

  return (
    <label
      className={`tweaks-row ${row.kind}${row.kind === "range" && row.disabled ? " off" : ""}`}
      onPointerEnter={show}
      onPointerLeave={() => onTip(null)}
      onFocus={show}
      onBlur={() => onTip(null)}
    >
      <span className="tweaks-label" onDoubleClick={reset}>
        {row.label}
      </span>
      {row.kind === "toggle" ? (
        <input type="checkbox" checked={row.value} onChange={(e) => row.set(e.target.checked)} />
      ) : (
        <>
          <output className="tweaks-value">{row.value.toFixed(decimals(row.step))}</output>
          <input
            type="range"
            min={row.min}
            max={row.max}
            step={row.step}
            value={row.value}
            disabled={row.disabled}
            style={{ "--fill": `${((row.value - row.min) / (row.max - row.min)) * 100}%` } as CSSProperties}
            onChange={(e) => row.set(Number(e.target.value))}
          />
        </>
      )}
    </label>
  );
}

interface Tip {
  hint: string;
  rowRect: DOMRect;
  panelLeft: number;
}

export default function TweaksPanel({ animal, tweaks }: { animal: AnimalKey; tweaks: Tweaks }) {
  const [open, setOpen] = useState(readOpen);
  const [tip, setTip] = useState<Tip | null>(null);
  const [copyLabel, setCopyLabel] = useState("Copy");
  const [confirmReset, setConfirmReset] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  const changeOpen = (next: boolean) => {
    setOpen(next);
    setTip(null);
    try {
      localStorage.setItem(OPEN_KEY, next ? "1" : "0");
    } catch {
      /* storage unavailable */
    }
  };

  const showTip = (row: HTMLElement | null, hint?: string) => {
    if (!row || !hint || !panelRef.current) return setTip(null);
    setTip({
      hint,
      rowRect: row.getBoundingClientRect(),
      panelLeft: panelRef.current.getBoundingClientRect().left,
    });
  };

  // Place the tooltip beside the panel, centred on the hovered row.
  useLayoutEffect(() => {
    const el = tipRef.current;
    if (!tip || !el) return;
    const { rowRect, panelLeft } = tip;
    el.style.right = `${window.innerWidth - panelLeft + 10}px`;
    el.style.top = `${Math.max(
      8,
      Math.min(window.innerHeight - el.offsetHeight - 8, rowRect.top + rowRect.height / 2 - el.offsetHeight / 2),
    )}px`;
  }, [tip]);

  // The reset button asks for confirmation, then backs out after 3 seconds.
  useEffect(() => {
    if (!confirmReset) return;
    const id = setTimeout(() => setConfirmReset(false), 3000);
    return () => clearTimeout(id);
  }, [confirmReset]);

  useEffect(() => {
    if (copyLabel === "Copy") return;
    const id = setTimeout(() => setCopyLabel("Copy"), 1400);
    return () => clearTimeout(id);
  }, [copyLabel]);

  const copy = async () => {
    const json = tweaks.exportJSON();
    try {
      await navigator.clipboard.writeText(json);
      setCopyLabel("Copied");
    } catch {
      console.log(json);
      setCopyLabel("In console");
    }
  };

  const reset = () => {
    if (!confirmReset) return setConfirmReset(true);
    setConfirmReset(false);
    tweaks.resetAll();
  };

  if (!open) {
    return (
      <button type="button" className="tweaks-open glass" onClick={() => changeOpen(true)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
          <circle cx="16" cy="6" r="2" />
          <circle cx="10" cy="12" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
        <span>Tweaks</span>
      </button>
    );
  }

  return (
    <>
      <aside ref={panelRef} className="tweaks glass" aria-label="Tweaks">
        <header className="tweaks-head">
          <h2>Tweaks</h2>
          <button type="button" className="tweaks-action" onClick={copy}>
            {copyLabel}
          </button>
          <button
            type="button"
            className={`tweaks-action${confirmReset ? " confirm" : ""}`}
            onClick={reset}
          >
            {confirmReset ? "Reset all?" : "Reset"}
          </button>
          <button type="button" className="tweaks-close" aria-label="Close tweaks" onClick={() => changeOpen(false)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>
        <div className="tweaks-body">
          {buildGroups(animal, tweaks).map(([title, rows]) => (
            <section className="tweaks-group" key={title}>
              <h3>{title}</h3>
              {rows.map((row) => (
                <Row key={row.key} row={row} onTip={showTip} />
              ))}
            </section>
          ))}
        </div>
      </aside>
      {tip && (
        <div ref={tipRef} className="tweaks-tip" role="tooltip">
          <span>{tip.hint}</span>
          <small>Double-click the name to reset it.</small>
        </div>
      )}
    </>
  );
}
