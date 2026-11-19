export const FPS = 30;
/** タイトル（サムネ）スライドの尺 */
export const INTRO_SEC = 2.6;
export const INTRO_FRAMES = Math.round(FPS * INTRO_SEC);
/** イントロ内でアニメが落ち着いたフレーム → サムネ切り出し */
export const THUMB_FRAME = Math.round(FPS * 1.15);

export const BG = "#070d1a";
export const ACCENT = "#38bdf8";
export const ACCENT_SOFT = "rgba(56,189,248,0.22)";
export const TEXT = "#f8fafc";
export const MUTED = "#94a3b8";

/**
 * Shorts / TikTok UI に食われない中央セーフゾーン（1080×1920 基準）。
 * 上: キャプション / 下: ハンドル・CTA / 右: いいね列
 */
export const SAFE = {
  top: 320,
  bottom: 380,
  left: 96,
  right: 140,
  maxWidth: 780,
} as const;

/** CI (Ubuntu) は fonts-noto-cjk。ローカル Mac は Hiragino も可 */
export const FONT_STACK =
  '"Noto Sans CJK JP", "Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif';
