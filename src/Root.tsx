import React from "react";
import { Composition } from "remotion";
import { ExplainShort, type ExplainShortProps } from "./ExplainShort";
import { INTRO_FRAMES } from "./constants";

const defaultProps: ExplainShortProps = {
  typeTitle: "保存ボタンのDB版？COMMIT（コミット）",
  term: "COMMIT",
  termJa: "コミット",
  slides: [
    {
      title: "コミットは確定の合図",
      body: "セットにした変更を正式な結果として残し、他の人からも見えるようにします。いわば、データベースにおける保存ボタンです。",
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
          const body = props.slideDurationsInFrames.reduce((a, b) => a + b, 0);
          return {
            durationInFrames: Math.max(INTRO_FRAMES + body, 60),
          };
        }}
      />
    </>
  );
};
