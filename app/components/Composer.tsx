import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent, KeyboardEvent } from "react";
import type { GlassSettings } from "../tweaks";

interface Props {
  glass: GlassSettings;
  onSubmit?: (text: string) => void;
}

export default function Composer({ glass, onSubmit }: Props) {
  const [text, setText] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  // Grow the textarea with its content.
  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
    el.style.overflowY = el.scrollHeight > el.clientHeight + 1 ? "auto" : "hidden";
  }, [text]);

  useEffect(() => {
    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
      areaRef.current?.focus({ preventScroll: true });
    }
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    onSubmit?.(value);
    setText("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const style = {
    "--blur": `${glass.blur}px`,
    borderRadius: glass.radius,
    width: `min(${glass.width}px, calc(100vw - 32px))`,
  } as CSSProperties;

  return (
    <form ref={formRef} className="composer glass" autoComplete="off" onSubmit={submit} style={style}>
      <div className="composer-field">
        <svg
          className="composer-search"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.5 15.5 5 5" />
        </svg>
        <textarea
          ref={areaRef}
          name="prompt"
          rows={1}
          placeholder="Ask anything..."
          aria-label="Ask anything"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </div>
      <div className="composer-bar">
        <button type="button" className="pill">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span>Add tabs or files</span>
        </button>
        <div className="tools">
          <button type="button" className="icon-btn" aria-label="Voice input">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
            </svg>
          </button>
          <button type="submit" className="send" aria-label="Send" disabled={text.trim() === ""}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}
