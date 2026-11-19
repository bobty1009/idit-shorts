export type Slide = {
  title: string;
  /** 画面本文（段落）。推奨。参考 Short と同じ「説明文」スタイル */
  body?: string;
  /** 後方互換。body が無いとき結合して段落表示する */
  bullets?: string[];
  visual?: string;
};

export type YoutubeMeta = {
  title: string;
  description: string;
  tags?: string[];
};

export type BatchItem = {
  slug: string;
  vault_path?: string;
  type_title: string;
  /** サムネ／冒頭に大きく出す用語（例: COMMIT / トランザクション） */
  term?: string;
  /** 用語の日本語併記（任意。term が英字のときなど） */
  term_ja?: string;
  voice?: string;
  target_sec?: number;
  slides: Slide[];
  narration: string;
  youtube: YoutubeMeta;
};

export type Batch = {
  privacy?: "public" | "unlisted" | "private";
  items: BatchItem[];
};

export type VoiceMap = Record<string, number>;

export const DEFAULT_VOICE_MAP: VoiceMap = {
  zundamon: 3,
  "ja-JP-default": 3,
};
