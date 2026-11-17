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

/** CI (Ubuntu) では fonts-noto-cjk を入れる。ローカル Mac は Hiragino も可 */
const FONT_STACK =
  '"Noto Sans CJK JP", "Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif';

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
        fontFamily: FONT_STACK,
        padding: "96px 64px",
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
      <div style={{ position: "relative", zIndex: 1, maxWidth: 920 }}>
        <div
          style={{
            fontSize: 28,
            letterSpacing: 4,
            color: ACCENT,
            marginBottom: 28,
          }}
        >
          {index + 1} / {total}
        </div>
        <h1
          style={{
            fontSize: 64,
            lineHeight: 1.25,
            margin: "0 0 36px",
            fontWeight: 700,
            wordBreak: "keep-all",
            overflowWrap: "anywhere",
          }}
        >
          {slide.title}
        </h1>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {slide.bullets.map((b) => (
            <li
              key={b}
              style={{
                fontSize: 38,
                lineHeight: 1.5,
                marginBottom: 24,
                color: TEXT,
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: ACCENT, flexShrink: 0 }}>▸</span>
              <span style={{ wordBreak: "keep-all", overflowWrap: "anywhere" }}>
                {b}
              </span>
            </li>
          ))}
        </ul>
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
  const introFrames = Math.round(fps * 2.0);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Audio src={staticFile(audioFile)} />
      <Sequence durationInFrames={introFrames}>
        <AbsoluteFill
          style={{
            backgroundColor: BG,
            color: TEXT,
            justifyContent: "center",
            alignItems: "center",
            padding: 72,
            textAlign: "center",
            fontFamily: FONT_STACK,
          }}
        >
          <div style={{ fontSize: 30, color: ACCENT, marginBottom: 28 }}>
            IDIT Knowledge
          </div>
          <h1
            style={{
              fontSize: 56,
              lineHeight: 1.3,
              margin: 0,
              fontWeight: 700,
              wordBreak: "keep-all",
              overflowWrap: "anywhere",
            }}
          >
            {typeTitle}
          </h1>
        </AbsoluteFill>
      </Sequence>
      {slides.map((slide, i) => {
        const duration = slideDurationsInFrames[i] ?? Math.round(fps * 10);
        const start = from + introFrames;
        from += duration;
        return (
          <Sequence
            key={`${slide.title}-${i}`}
            from={start}
            durationInFrames={duration}
          >
            <SlideCard slide={slide} index={i} total={slides.length} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
