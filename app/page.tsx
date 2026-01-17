"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center font-mono text-2xl">
      Loading...
    </div>
  );
}
