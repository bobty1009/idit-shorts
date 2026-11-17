import fs from "node:fs";
import { google } from "googleapis";
import type { BatchItem } from "../src/types";

export type UploadResult = {
  videoId: string;
  url: string;
};

export async function uploadYoutube(opts: {
  filePath: string;
  item: BatchItem;
  privacy: "public" | "unlisted" | "private";
}): Promise<UploadResult> {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Missing YOUTUBE_CLIENT_ID / YOUTUBE_CLIENT_SECRET / YOUTUBE_REFRESH_TOKEN",
    );
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret);
  oauth2.setCredentials({ refresh_token: refreshToken });
  const youtube = google.youtube({ version: "v3", auth: oauth2 });

  const AI_DISCLAIMER =
    "内容はAIを使用して生成しているため正しくない情報が含まれる場合があります。";
  const VOICE_CREDIT = "VOICEVOX:ずんだもん";
  let description = opts.item.youtube.description.trim();
  if (!description.includes(AI_DISCLAIMER)) {
    description = `${description}\n\n${AI_DISCLAIMER}`;
  }
  if (!description.includes("VOICEVOX")) {
    description = `${description}\n\n${VOICE_CREDIT}`;
  }

  const res = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title: opts.item.youtube.title.slice(0, 100),
        description,
        tags: opts.item.youtube.tags ?? [],
        categoryId: "27",
      },
      status: {
        privacyStatus: opts.privacy,
        selfDeclaredMadeForKids: false,
      },
    },
    media: {
      body: fs.createReadStream(opts.filePath),
    },
  });

  const videoId = res.data.id;
  if (!videoId) throw new Error("YouTube upload returned no video id");
  return {
    videoId,
    url: `https://www.youtube.com/shorts/${videoId}`,
  };
}

async function main() {
  const videoPath = process.argv[2];
  const itemPath = process.argv[3];
  const privacy = (process.argv[4] ?? "private") as
    | "public"
    | "unlisted"
    | "private";
  if (!videoPath || !itemPath) {
    console.error(
      "Usage: tsx scripts/upload-youtube.ts <video.mp4> <item.json> [privacy]",
    );
    process.exit(1);
  }
  const item = JSON.parse(fs.readFileSync(itemPath, "utf8")) as BatchItem;
  const result = await uploadYoutube({ filePath: videoPath, item, privacy });
  console.log(JSON.stringify(result));
}

if (process.argv[1]?.endsWith("upload-youtube.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
