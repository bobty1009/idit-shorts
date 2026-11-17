import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { synthesizeItem } from "./synthesize-voicevox";
import { uploadYoutube } from "./upload-youtube";
import type { Batch, BatchItem } from "../src/types";
import { FPS, INTRO_SEC, THUMB_FRAME } from "../src/constants";

/** Shorts 平均尺の目安。音声が短い場合も最低この秒数までスライドを伸ばす */
const MIN_TARGET_SEC = 48;

function resolveTerm(item: BatchItem): { term: string; termJa?: string } {
  if (item.term?.trim()) {
    return { term: item.term.trim(), termJa: item.term_ja?.trim() || undefined };
  }
  // fallback: slug を見やすく（transaction → TRANSACTION）
  return { term: item.slug.replace(/-/g, " ").toUpperCase() };
}

function splitDuration(
  audioSec: number,
  slideCount: number,
  targetSec?: number,
): number[] {
  const goal = Math.max(audioSec, targetSec ?? MIN_TARGET_SEC, MIN_TARGET_SEC);
  const usable = Math.max(goal - INTRO_SEC, slideCount * 3);
  const each = usable / slideCount;
  return Array.from({ length: slideCount }, () =>
    Math.max(Math.round(each * FPS), FPS * 3),
  );
}

async function processItem(
  item: BatchItem,
  privacy: "public" | "unlisted" | "private",
  skipUpload: boolean,
) {
  const publicDir = path.resolve("public");
  const outDir = path.resolve("out");
  fs.mkdirSync(outDir, { recursive: true });

  const { term, termJa } = resolveTerm(item);

  console.log(`==> synthesize ${item.slug}`);
  const { audioFile, durationSec } = await synthesizeItem(item, publicDir);
  const slideDurationsInFrames = splitDuration(
    durationSec,
    item.slides.length,
    item.target_sec,
  );
  const props = {
    typeTitle: item.type_title,
    term,
    termJa,
    slides: item.slides,
    audioFile,
    slideDurationsInFrames,
  };
  const propsPath = path.join(outDir, `${item.slug}.props.json`);
  fs.writeFileSync(propsPath, JSON.stringify(props));

  const mp4Path = path.join(outDir, `${item.slug}.mp4`);
  console.log(`==> render ${item.slug}`);
  execSync(
    `npx remotion render ExplainShort "${mp4Path}" --props="${propsPath}"`,
    { stdio: "inherit" },
  );

  const thumbPath = path.join(outDir, `${item.slug}.thumb.png`);
  console.log(`==> still thumbnail ${item.slug} @ frame ${THUMB_FRAME}`);
  execSync(
    `npx remotion still ExplainShort "${thumbPath}" --frame=${THUMB_FRAME} --props="${propsPath}"`,
    { stdio: "inherit" },
  );

  if (skipUpload) {
    return {
      slug: item.slug,
      mp4Path,
      thumbPath,
      url: null as string | null,
    };
  }

  console.log(`==> upload ${item.slug}`);
  const uploaded = await uploadYoutube({
    filePath: mp4Path,
    thumbPath,
    item,
    privacy,
  });
  const result = {
    slug: item.slug,
    vault_path: item.vault_path,
    thumbPath,
    ...uploaded,
  };
  fs.writeFileSync(
    path.join(outDir, `${item.slug}.upload.json`),
    JSON.stringify(result, null, 2),
  );
  return result;
}

async function main() {
  const batchPath = process.argv[2] ?? "batches/current.json";
  const skipUpload = process.env.SKIP_UPLOAD === "1";
  const batch = JSON.parse(fs.readFileSync(batchPath, "utf8")) as Batch;
  const privacy = batch.privacy ?? "private";
  const results = [];
  for (const item of batch.items) {
    results.push(await processItem(item, privacy, skipUpload));
  }
  const summaryPath = path.resolve("out/summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify({ privacy, results }, null, 2));
  console.log(JSON.stringify({ privacy, results }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
