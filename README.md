# idit-shorts

[idit-knowledge](https://github.com/bobty1009/idit-knowledge) の `explain_video` バッチを、VOICEVOX + Remotion で Shorts 化し YouTube にアップロードする工場リポ。

- **public** 想定（GitHub Actions 無料枠のため）
- MP4 はランナー一時ディスクのみ → YouTube が正本
- 資格情報は GitHub Secrets のみ（コードに置かない）

## OAuth / ブランディング用 URL

| 用途 | URL |
|---|---|
| ホームページ | https://github.com/bobty1009/idit-shorts |
| プライバシーポリシー | https://github.com/bobty1009/idit-shorts/blob/main/docs/privacy.md |

## 必要な Secrets

| Name | 内容 |
|---|---|
| `YOUTUBE_CLIENT_ID` | Google OAuth client id |
| `YOUTUBE_CLIENT_SECRET` | Google OAuth client secret |
| `YOUTUBE_REFRESH_TOKEN` | `youtube.upload` スコープの refresh token |

## ローカル（任意・VOICEVOX が必要）

手元常駐は本線ではない。デバッグ時のみ:

```bash
docker run --rm -p 50021:50021 voicevox/voicevox_engine:cpu-latest
npm ci
SKIP_UPLOAD=1 npm run batch -- batches/example.json
```

## Actions から回す

vault 側 skill がバッチ JSON を base64 して起動する:

```bash
BATCH_B64=$(base64 < batches/example.json | tr -d '\n')
gh workflow run render-and-upload.yml \
  -f batch_b64="$BATCH_B64" \
  -f privacy=private \
  -f skip_upload=false
```

完了後 artifact `batch-summary` の `out/summary.json` に URL が入る。
サムネは冒頭タイトルスライドを `remotion still` で切り出し、`thumbnails.set` で投稿する。

### カスタムサムネの前提

YouTube のカスタムサムネは **チャンネル認証（電話番号など）済み** が必要。
未認証だと動画投稿は成功し、`thumbnailSet: false` と警告だけ残る。
Studio で手動設定するか、[YouTube Studio → 設定 → チャンネル → 機能の利用資格](https://studio.youtube.com/) で認証する。

## バッチ JSON の term

| フィールド | 用途 |
|---|---|
| `term` | 冒頭・サムネに大きく出す用語（例: `COMMIT`） |
| `term_ja` | 任意の日本語併記（例: `コミット`） |
| `type_title` | 用語の下に出すキャッチタイトル |

## VOICEVOX クレジット

投稿 description 末尾に `VOICEVOX:ずんだもん` を付与する（スクリプト側でも補完）。
