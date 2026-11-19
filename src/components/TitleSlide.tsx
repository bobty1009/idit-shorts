import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ACCENT, FONT_STACK, MUTED, SAFE, TEXT } from "../constants";
import { Background } from "./Background";

export type TitleSlideProps = {
  term: string;
  termJa?: string;
  typeTitle: string;
};

/** 大きく出した用語を下段キャッチから省き、重複を避ける */
function hookLine(typeTitle: string, term: string, termJa?: string): string {
  let h = typeTitle;
  if (termJa) {
    h = h.replace(`（${termJa}）`, "").replace(termJa, "");
  }
  const parts = [term, term.toLowerCase(), term.toUpperCase()].filter(Boolean);
  for (const p of parts) {
    h = h.split(p).join("");
  }
  h = h.replace(/\s+/g, " ").replace(/\s+([？?！!])/g, "$1").trim();
  return h.length >= 4 ? h : typeTitle;
}

/**
 * サムネ兼用の冒頭スライド。
 * UI セーフゾーン内で用語を大きく中央配置する。
 */
export const TitleSlide: React.FC<TitleSlideProps> = ({
  term,
  termJa,
  typeTitle,
}) => {
  const hook = hookLine(typeTitle, term, termJa);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const brandIn = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 120 },
  });
  const termIn = spring({
    frame: frame - 4,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const barW = interpolate(frame, [10, 28], [0, 240], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subOpacity = interpolate(frame, [16, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subY = interpolate(frame, [16, 28], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const termSize =
    term.length <= 6 ? 118 : term.length <= 10 ? 96 : term.length <= 14 ? 80 : 68;

  return (
    <AbsoluteFill style={{ fontFamily: FONT_STACK, color: TEXT }}>
      <Background intensity={1.15} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: SAFE.top,
          paddingBottom: SAFE.bottom,
          paddingLeft: SAFE.left,
          paddingRight: SAFE.right,
          textAlign: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: SAFE.maxWidth }}>
          <div
            style={{
              opacity: brandIn,
              transform: `translateY(${(1 - brandIn) * 16}px)`,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 26px",
                borderRadius: 999,
                border: `1.5px solid ${ACCENT}`,
                background: "rgba(56,189,248,0.1)",
                color: ACCENT,
                fontSize: 26,
                letterSpacing: 3,
                fontWeight: 600,
              }}
            >
              IDIT Knowledge
            </div>
          </div>

          <div
            style={{
              opacity: termIn,
              transform: `scale(${0.88 + termIn * 0.12}) translateY(${(1 - termIn) * 24}px)`,
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: termSize,
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: term.length <= 8 ? 5 : 2,
                wordBreak: "keep-all",
                overflowWrap: "anywhere",
                textShadow: "0 0 48px rgba(56,189,248,0.35)",
              }}
            >
              {term}
            </h1>
            {termJa ? (
              <div
                style={{
                  marginTop: 16,
                  fontSize: 40,
                  color: MUTED,
                  fontWeight: 600,
                  letterSpacing: 4,
                }}
              >
                {termJa}
              </div>
            ) : null}
          </div>

          <div
            style={{
              width: barW,
              height: 5,
              borderRadius: 4,
              background: `linear-gradient(90deg, ${ACCENT}, #818cf8)`,
              margin: "36px auto 32px",
              boxShadow: `0 0 24px ${ACCENT}`,
            }}
          />

          <p
            style={{
              margin: 0,
              fontSize: 38,
              lineHeight: 1.45,
              fontWeight: 600,
              color: TEXT,
              opacity: subOpacity,
              transform: `translateY(${subY}px)`,
              wordBreak: "keep-all",
              overflowWrap: "anywhere",
            }}
          >
            {hook}
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
