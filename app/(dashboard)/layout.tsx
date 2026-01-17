import { Menu } from "@/components/menu";
import { JSX } from "react";

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <div className="text-foreground min-h-screen w-full">
      <Menu />
      <div>{children}</div>
    </div>
  );
}
