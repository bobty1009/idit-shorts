import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Slide } from "../types";
import {
  ACCENT,
  FONT_STACK,
  MUTED,
  TEXT,
} from "../constants";
import { Background } from "./Background";

const Bullet: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  return (
    <li
      style={{
        fontSize: 36,
        lineHeight: 1.5,
        marginBottom: 28,
        color: TEXT,
        display: "flex",
        gap: 18,
        alignItems: "flex-start",
        opacity: enter,
        transform: `translateX(${(1 - enter) * 36}px)`,
      }}
    >
      <span
        style={{
          color: ACCENT,
          flexShrink: 0,
          marginTop: 4,
          fontSize: 28,
          filter: "drop-shadow(0 0 8px rgba(56,189,248,0.6))",
        }}
      >
        ▸
      </span>
      <span style={{ wordBreak: "keep-all", overflowWrap: "anywhere" }}>
        {text}
      </span>
    </li>
  );
};

export const ContentSlide: React.FC<{
  slide: Slide;
  index: number;
  total: number;
}> = ({ slide, index, total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerIn = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 100 },
  });
  const titleIn = spring({
    frame: frame - 3,
    fps,
    config: { damping: 15, stiffness: 95 },
  });

  const label = String(index + 1).padStart(2, "0");

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, color: TEXT }}>
      <Background intensity={0.95} />

      {/* 左アクセントバー */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 180,
          bottom: 220,
          width: 8,
          borderRadius: "0 6px 6px 0",
          background: `linear-gradient(180deg, ${ACCENT}, #818cf8)`,
          boxShadow: `0 0 20px ${ACCENT}`,
          opacity: headerIn,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "120px 72px 160px",
          maxWidth: 980,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
            opacity: headerIn,
            transform: `translateY(${(1 - headerIn) * 12}px)`,
          }}
        >
          <span
            style={{
              fontSize: 26,
              letterSpacing: 5,
              color: ACCENT,
              fontWeight: 700,
            }}
          >
            POINT {label}
          </span>
          <span style={{ color: MUTED, fontSize: 24 }}>
            / {String(total).padStart(2, "0")}
          </span>
        </div>

        <h1
          style={{
            fontSize: 58,
            lineHeight: 1.28,
            margin: "0 0 44px",
            fontWeight: 800,
            wordBreak: "keep-all",
            overflowWrap: "anywhere",
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 20}px)`,
          }}
        >
          {slide.title}
        </h1>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {slide.bullets.map((b, i) => (
            <Bullet key={`${b}-${i}`} text={b} delay={10 + i * 7} />
          ))}
        </ul>
      </div>

      {/* 下部ドット進捗（旧版タッチ） */}
      <div
        style={{
          position: "absolute",
          bottom: 96,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 14,
        }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const active = i === index;
          const w = active
            ? interpolate(frame, [0, 12], [10, 28], {
                extrapolateRight: "clamp",
              })
            : 10;
          return (
            <div
              key={i}
              style={{
                width: w,
                height: 10,
                borderRadius: 999,
                background: active ? ACCENT : "rgba(148,163,184,0.45)",
                boxShadow: active ? `0 0 12px ${ACCENT}` : "none",
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
