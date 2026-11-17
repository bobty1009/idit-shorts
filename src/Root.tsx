import React from "react";
import { Composition } from "remotion";
import { ExplainShort, type ExplainShortProps } from "./ExplainShort";

const defaultProps: ExplainShortProps = {
  typeTitle: "Sample",
  slides: [
    {
      title: "サンプル",
      bullets: ["スライド1", "プレビュー用"],
      visual: "プレースホルダ",
    },
  ],
  audioFile: "silence.wav",
  slideDurationsInFrames: [90],
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ExplainShort"
        component={ExplainShort}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
        calculateMetadata={async ({ props }) => {
          const intro = 36;
          const body = props.slideDurationsInFrames.reduce((a, b) => a + b, 0);
          return {
            durationInFrames: Math.max(intro + body, 60),
          };
        }}
      />
    </>
  );
};
