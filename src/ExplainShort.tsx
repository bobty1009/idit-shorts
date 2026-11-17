import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { ContentSlide } from "./components/ContentSlide";
import { TitleSlide } from "./components/TitleSlide";
import { BG, INTRO_FRAMES } from "./constants";
import type { Slide } from "./types";

export type ExplainShortProps = {
  typeTitle: string;
  /** サムネ兼タイトルに大きく出す用語（例: COMMIT） */
  term: string;
  /** 用語の日本語併記（任意） */
  termJa?: string;
  slides: Slide[];
  audioFile: string;
  slideDurationsInFrames: number[];
};

export const ExplainShort: React.FC<ExplainShortProps> = ({
  typeTitle,
  term,
  termJa,
  slides,
  audioFile,
  slideDurationsInFrames,
}) => {
  let from = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Audio src={staticFile(audioFile)} />
      <Sequence durationInFrames={INTRO_FRAMES}>
        <TitleSlide term={term} termJa={termJa} typeTitle={typeTitle} />
      </Sequence>
      {slides.map((slide, i) => {
        const duration = slideDurationsInFrames[i] ?? 90;
        const start = from + INTRO_FRAMES;
        from += duration;
        return (
          <Sequence
            key={`${slide.title}-${i}`}
            from={start}
            durationInFrames={duration}
          >
            <ContentSlide slide={slide} index={i} total={slides.length} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
