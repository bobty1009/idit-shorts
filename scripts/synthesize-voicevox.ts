import fs from "node:fs";
import path from "node:path";
import { DEFAULT_VOICE_MAP, type BatchItem } from "../src/types";

const HOST = process.env.VOICEVOX_HOST ?? "http://127.0.0.1:50021";

async function waitForEngine(timeoutMs = 180_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${HOST}/version`);
      if (res.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`VOICEVOX engine not ready at ${HOST}`);
}

async function synthesize(text: string, speaker: number, outPath: string) {
  const queryRes = await fetch(
    `${HOST}/audio_query?text=${encodeURIComponent(text)}&speaker=${speaker}`,
    { method: "POST" },
  );
  if (!queryRes.ok) {
    throw new Error(`audio_query failed: ${queryRes.status} ${await queryRes.text()}`);
  }
  const query = await queryRes.json();
  query.prePhonemeLength = 0;
  query.postPhonemeLength = 0.15;
  query.speedScale = 1.0;

  const synthRes = await fetch(`${HOST}/synthesis?speaker=${speaker}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });
  if (!synthRes.ok) {
    throw new Error(`synthesis failed: ${synthRes.status} ${await synthRes.text()}`);
  }
  const buf = Buffer.from(await synthRes.arrayBuffer());
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buf);
}

function wavDurationSec(filePath: string): number {
  const buf = fs.readFileSync(filePath);
  // PCM WAV: byteRate at offset 28, data size from chunk
  const byteRate = buf.readUInt32LE(28);
  let dataSize = buf.readUInt32LE(40);
  // Find data chunk if not at 36
  if (buf.toString("ascii", 36, 40) !== "data") {
    let offset = 12;
    dataSize = 0;
    while (offset + 8 <= buf.length) {
      const id = buf.toString("ascii", offset, offset + 4);
      const size = buf.readUInt32LE(offset + 4);
      if (id === "data") {
        dataSize = size;
        break;
      }
      offset += 8 + size;
    }
  }
  if (!byteRate || !dataSize) return 1;
  return dataSize / byteRate;
}

export async function synthesizeItem(item: BatchItem, publicDir: string) {
  await waitForEngine();
  const voice = item.voice ?? "zundamon";
  const speaker = DEFAULT_VOICE_MAP[voice] ?? 3;
  const rel = `voices/${item.slug}.wav`;
  const outPath = path.join(publicDir, rel);
  await synthesize(item.narration.trim(), speaker, outPath);
  const durationSec = wavDurationSec(outPath);
  return { audioFile: rel, durationSec };
}

async function main() {
  const itemPath = process.argv[2];
  if (!itemPath) {
    console.error("Usage: tsx scripts/synthesize-voicevox.ts <item.json>");
    process.exit(1);
  }
  const item = JSON.parse(fs.readFileSync(itemPath, "utf8")) as BatchItem;
  const publicDir = path.resolve("public");
  const result = await synthesizeItem(item, publicDir);
  const metaPath = path.join(publicDir, "voices", `${item.slug}.meta.json`);
  fs.writeFileSync(metaPath, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result));
}

const invokedDirectly =
  !!process.argv[1] && path.resolve(process.argv[1]).endsWith("synthesize-voicevox.ts");
if (invokedDirectly) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
