import GradualBlurMemo from "@/components/GradualBlur";
import { Hero } from "./_components/hero";
import { Work } from "./_components/work";
import { About } from "./_components/about";

export default function SunlightBlob() {
  return (
    <div className="h-screen w-screen overflow-x-hidden">
      <GradualBlurMemo
        target="parent"
        position="top"
        height="7rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential
        opacity={1}
      />
      <Hero />
      <Work />
      <About />
    </div>
  );
}
