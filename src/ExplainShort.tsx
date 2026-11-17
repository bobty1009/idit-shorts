import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Slide } from "./types";

export type ExplainShortProps = {
  typeTitle: string;
  slides: Slide[];
  audioFile: string;
  slideDurationsInFrames: number[];
};

const BG = "#0b1220";
const ACCENT = "#7dd3fc";
const TEXT = "#f8fafc";
const MUTED = "#94a3b8";

const SlideCard: React.FC<{
  slide: Slide;
  index: number;
  total: number;
}> = ({ slide, index, total }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [0, 12], [24, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        color: TEXT,
        fontFamily:
          '"Hiragino Sans", "Noto Sans JP", "Segoe UI", sans-serif',
        padding: "96px 72px",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(56,189,248,0.18), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.16), transparent 50%)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontSize: 28,
            letterSpacing: 4,
            color: ACCENT,
            marginBottom: 28,
            textTransform: "uppercase",
          }}
        >
          {index + 1} / {total}
        </div>
        <h1
          style={{
            fontSize: 72,
            lineHeight: 1.15,
            margin: "0 0 40px",
            fontWeight: 800,
          }}
        >
          {slide.title}
        </h1>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {slide.bullets.map((b) => (
            <li
              key={b}
              style={{
                fontSize: 40,
                lineHeight: 1.45,
                marginBottom: 22,
                color: TEXT,
                display: "flex",
                gap: 16,
              }}
            >
              <span style={{ color: ACCENT }}>▸</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        {slide.visual ? (
          <p
            style={{
              marginTop: 48,
              fontSize: 28,
              color: MUTED,
              lineHeight: 1.4,
            }}
          >
            {slide.visual}
          </p>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const ExplainShort: React.FC<ExplainShortProps> = ({
  typeTitle,
  slides,
  audioFile,
  slideDurationsInFrames,
}) => {
  const { fps } = useVideoConfig();
  let from = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Audio src={staticFile(audioFile)} />
      <Sequence durationInFrames={Math.round(fps * 1.2)}>
        <AbsoluteFill
          style={{
            backgroundColor: BG,
            color: TEXT,
            justifyContent: "center",
            alignItems: "center",
            padding: 80,
            textAlign: "center",
            fontFamily:
              '"Hiragino Sans", "Noto Sans JP", "Segoe UI", sans-serif',
          }}
        >
          <div style={{ fontSize: 32, color: ACCENT, marginBottom: 24 }}>
            IDIT Knowledge
          </div>
          <h1 style={{ fontSize: 64, lineHeight: 1.2, margin: 0 }}>
            {typeTitle}
          </h1>
        </AbsoluteFill>
      </Sequence>
      {slides.map((slide, i) => {
        const duration = slideDurationsInFrames[i] ?? Math.round(fps * 8);
        const start = from + Math.round(fps * 1.2);
        from += duration;
        return (
          <Sequence key={`${slide.title}-${i}`} from={start} durationInFrames={duration}>
            <SlideCard slide={slide} index={i} total={slides.length} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
