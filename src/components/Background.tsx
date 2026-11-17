import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BG } from "../constants";

/** 旧版 Short に近い、動くグロー＋斜めストリーク背景 */
export const Background: React.FC<{ intensity?: number }> = ({
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 90], [0, 40], {
    extrapolateRight: "extend",
  });
  const pulse = interpolate(Math.sin(frame / 18), [-1, 1], [0.85, 1.15]);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse 80% 55% at 20% ${18 + drift * 0.15}%, rgba(56,189,248,${0.28 * intensity * pulse}), transparent 60%),
            radial-gradient(ellipse 70% 50% at 88% ${72 - drift * 0.1}%, rgba(99,102,241,${0.22 * intensity}), transparent 55%),
            radial-gradient(ellipse 60% 40% at 50% 100%, rgba(14,165,233,${0.12 * intensity}), transparent 50%)
          `,
        }}
      />
      {/* 斜めストリーク */}
      <div
        style={{
          position: "absolute",
          top: -200 + drift,
          left: -120,
          width: 1400,
          height: 220,
          transform: "rotate(-18deg)",
          background:
            "linear-gradient(90deg, transparent, rgba(56,189,248,0.14), rgba(165,180,252,0.1), transparent)",
          filter: "blur(2px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 120 - drift * 0.5,
          right: -200,
          width: 1100,
          height: 160,
          transform: "rotate(12deg)",
          background:
            "linear-gradient(90deg, transparent, rgba(99,102,241,0.12), transparent)",
          filter: "blur(3px)",
        }}
      />
      {/* 微細な縦グリッド */}
      <AbsoluteFill
        style={{
          opacity: 0.045,
          backgroundImage:
            "repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 72px)",
        }}
      />
    </AbsoluteFill>
  );
};
