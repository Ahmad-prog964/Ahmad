"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { hasWebGL, isLowPowerDevice } from "@/lib/device";
import { useSceneStore } from "@/store/useSceneStore";
import { business } from "@/lib/business";

const Scene = dynamic(() => import("@/components/canvas/Scene"), { ssr: false });

export default function SceneGate() {
  const [webglOk, setWebglOk] = useState<boolean | null>(null);
  const setLowPower = useSceneStore((s) => s.setLowPower);
  const setIntroDone = useSceneStore((s) => s.setIntroDone);

  useEffect(() => {
    const ok = hasWebGL();
    setWebglOk(ok);
    const forced = new URLSearchParams(window.location.search).get("lowpower");
    setLowPower(forced ? forced !== "0" : isLowPowerDevice());
    if (!ok) {
      setIntroDone(true);
      document.body.classList.remove("noscroll-lock");
    }
  }, [setLowPower, setIntroDone]);

  if (webglOk === null) return null;

  if (!webglOk) {
    return (
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-ink via-ink-2 to-ink">
        <div className="flex h-screen w-full flex-col items-center justify-center px-6 text-center">
          <p className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.5em] text-accent-2">
            {business.initials} — {business.name}
          </p>
          <h1 className="text-huge text-5xl text-paper md:text-7xl">
            Mobile Mechanic.
            <span className="mt-3 block text-2xl font-normal tracking-normal text-mute md:text-3xl">
              We come to you.
            </span>
          </h1>
        </div>
      </div>
    );
  }

  return <Scene />;
}
