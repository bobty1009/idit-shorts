export type Slide = {
  title: string;
  bullets: string[];
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
