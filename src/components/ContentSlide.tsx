import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Slide } from "../types";
import { ACCENT, FONT_STACK, MUTED, SAFE, TEXT } from "../constants";
import { Background } from "./Background";

function slideBody(slide: Slide): string {
  if (slide.body?.trim()) return slide.body.trim();
  const bullets = slide.bullets ?? [];
  if (bullets.length === 0) return "";
  return bullets
    .map((b) => b.trim().replace(/[。．]$/, ""))
    .filter(Boolean)
    .join("。")
    .concat("。");
}

export const ContentSlide: React.FC<{
  slide: Slide;
  index: number;
  total: number;
}> = ({ slide, index, total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const body = slideBody(slide);

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
  const bodyIn = spring({
    frame: frame - 8,
    fps,
    config: { damping: 16, stiffness: 100 },
  });

  const titleSize =
    slide.title.length <= 12 ? 64 : slide.title.length <= 18 ? 56 : 48;

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, color: TEXT }}>
      <Background intensity={0.95} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: SAFE.top,
          paddingBottom: SAFE.bottom,
          paddingLeft: SAFE.left,
          paddingRight: SAFE.right,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: SAFE.maxWidth,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 22,
              opacity: headerIn,
              transform: `translateY(${(1 - headerIn) * 10}px)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span
                style={{
                  fontSize: 22,
                  letterSpacing: 4,
                  color: MUTED,
                  fontWeight: 600,
                }}
              >
                EXPLAIN
              </span>
              <div
                style={{
                  width: 72,
                  height: 2,
                  background: `linear-gradient(90deg, ${ACCENT}, transparent)`,
                }}
              />
            </div>
            <span style={{ color: MUTED, fontSize: 24, letterSpacing: 1 }}>
              {index + 1}/{total}
            </span>
          </div>

          <h1
            style={{
              fontSize: titleSize,
              lineHeight: 1.3,
              margin: "0 0 36px",
              fontWeight: 800,
              wordBreak: "keep-all",
              overflowWrap: "anywhere",
              opacity: titleIn,
              transform: `translateY(${(1 - titleIn) * 16}px)`,
            }}
          >
            {slide.title}
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: 44,
              lineHeight: 1.65,
              fontWeight: 500,
              color: TEXT,
              wordBreak: "keep-all",
              overflowWrap: "anywhere",
              opacity: bodyIn,
              transform: `translateY(${(1 - bodyIn) * 14}px)`,
            }}
          >
            {body}
          </p>
        </div>
      </AbsoluteFill>

      {/* ドットは下部 UI の上に置く */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom - 56,
          left: SAFE.left,
          right: SAFE.right,
          display: "flex",
          justifyContent: "center",
          gap: 12,
        }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const active = i === index;
          const w = active
            ? interpolate(frame, [0, 12], [10, 26], {
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
                background: active ? ACCENT : "rgba(148,163,184,0.4)",
                boxShadow: active ? `0 0 12px ${ACCENT}` : "none",
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
