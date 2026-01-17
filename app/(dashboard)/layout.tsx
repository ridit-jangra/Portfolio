import { Menu } from "@/components/menu";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="text-foreground min-h-screen w-full">
      <Menu />
      <div>{children}</div>
    </div>
  );
}
