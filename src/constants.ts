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

/** CI (Ubuntu) は fonts-noto-cjk。ローカル Mac は Hiragino も可 */
export const FONT_STACK =
  '"Noto Sans CJK JP", "Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif';
