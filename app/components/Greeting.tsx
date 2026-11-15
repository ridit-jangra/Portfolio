import { useEffect, useState } from "react";

export function greetingFor(name: string, date: Date = new Date()): string {
  const h = date.getHours();
  if (h >= 5 && h < 12) return `Good morning, ${name}`;
  if (h >= 12 && h < 17) return `Good afternoon, ${name}`;
  if (h >= 17 && h < 22) return `Good evening, ${name}`;
  return `Still up, ${name}?`;
}

export default function Greeting({ name }: { name: string }) {
  const [text, setText] = useState(() => greetingFor(name));

  useEffect(() => {
    const update = () => setText(greetingFor(name));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [name]);

  return <h1 className="greeting">{text}</h1>;
}
