#!/usr/bin/env node
/**
 * Repeatable image-generation workflow for this project.
 *
 * Default provider: Cloudflare Workers AI (FLUX.1 [schnell]) — genuinely free,
 * no credit card, ~10,000 free "Neurons"/day (roughly 230 images/day), no
 * watermark. Verified against Cloudflare's own docs and this project's own
 * live test.
 *
 * Google's Gemini image models ("Nano Banana") are also wired up as an
 * alternative (--provider gemini), but Google does not offer a free tier for
 * image *output* — every image model requires a billing-enabled project, so
 * this is only useful if that's been set up.
 *
 * Usage:
 *   node scripts/generate-image.mjs --prompt "..." --out "hero-engine-bay" [options]
 *
 * Options:
 *   --provider  cloudflare|gemini   Default: cloudflare
 *   --prompt    <text>              Required. The image description.
 *   --out       <name>              Required. Output filename (no extension) under public/images/generated/.
 *   --model     <id>                Override the provider's default model.
 *   --width     <px>                Max output width after compression. Default: 1920.
 *   --quality   <0-100>             WebP quality. Default: 82.
 *   --steps     <n>                 Cloudflare only: diffusion steps, 1-8. Default: 8 (best quality).
 *
 * Requires (Cloudflare, default):
 *   CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN in .env.local
 *   Get both free at https://dash.cloudflare.com — no card needed for the free tier.
 *
 * Requires (Gemini, optional):
 *   GEMINI_API_KEY in .env.local — https://aistudio.google.com/apikey
 *   Needs a billing-enabled Google Cloud project for image models.
 */

import sharp from "sharp";
import { config as loadEnv } from "dotenv";
import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
loadEnv({ path: path.join(ROOT, ".env.local") });

const OUTPUT_DIR = path.join(ROOT, "public", "images", "generated");

function parseArgs(argv) {
  const args = { provider: "cloudflare", width: 1920, quality: 82, steps: 8 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--prompt") args.prompt = argv[++i];
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--provider") args.provider = argv[++i];
    else if (a === "--model") args.model = argv[++i];
    else if (a === "--width") args.width = Number(argv[++i]);
    else if (a === "--quality") args.quality = Number(argv[++i]);
    else if (a === "--steps") args.steps = Number(argv[++i]);
  }
  return args;
}

async function generateWithCloudflare(args) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !token) {
    console.error(
      "Missing Cloudflare credentials.\n\n" +
        "1. Sign up free at https://dash.cloudflare.com (no card required)\n" +
        "2. Find your Account ID on the Workers & Pages overview page\n" +
        "3. Create an API token: My Profile -> API Tokens -> Create Token -> give it Workers AI access\n" +
        "4. Add to .env.local:\n" +
        "   CLOUDFLARE_ACCOUNT_ID=your-account-id\n" +
        "   CLOUDFLARE_API_TOKEN=your-token\n"
    );
    process.exit(1);
  }

  const model = args.model ?? "@cf/black-forest-labs/flux-1-schnell";
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;

  console.log(`Generating with Cloudflare Workers AI (${model}) …`);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: args.prompt,
      steps: Math.min(8, Math.max(1, args.steps)),
    }),
  });

  const body = await res.json();
  if (!res.ok || !body.success) {
    console.error("Cloudflare API request failed:", JSON.stringify(body.errors ?? body, null, 2));
    process.exit(1);
  }

  const base64 = body.result?.image;
  if (!base64) {
    console.error("No image returned:", JSON.stringify(body, null, 2));
    process.exit(1);
  }

  return Buffer.from(base64, "base64");
}

async function generateWithGemini(args) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error(
      "Missing GEMINI_API_KEY.\n\n" +
        "1. Get a key at https://aistudio.google.com/apikey\n" +
        "2. Add to .env.local: GEMINI_API_KEY=your-key-here\n" +
        "3. Note: image models require a billing-enabled Google Cloud project — the free tier is 0 for image output.\n"
    );
    process.exit(1);
  }

  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey });
  const model = args.model ?? "gemini-2.5-flash-image";

  console.log(`Generating with Gemini (${model}) …`);

  let response;
  try {
    response = await ai.models.generateContent({ model, contents: args.prompt });
  } catch (err) {
    console.error("Gemini API request failed:", err?.message ?? err);
    process.exit(1);
  }

  const parts = response?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData?.data);
  if (!imagePart) {
    const textPart = parts.find((p) => p.text)?.text;
    console.error("No image was returned.\n" + (textPart ? `Model response: ${textPart}` : ""));
    process.exit(1);
  }

  return Buffer.from(imagePart.inlineData.data, "base64");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.prompt || !args.out) {
    console.error(
      'Usage: node scripts/generate-image.mjs --prompt "<description>" --out "<filename-no-ext>" [--provider cloudflare|gemini] [--width 1920] [--quality 82]'
    );
    process.exit(1);
  }

  const fullPrompt = `${args.prompt}. Photorealistic, professional commercial photography, sharp focus, natural lighting, high detail.`;
  args.prompt = fullPrompt;
  console.log(`Prompt: ${fullPrompt}`);

  const rawBuffer =
    args.provider === "gemini" ? await generateWithGemini(args) : await generateWithCloudflare(args);

  await mkdir(OUTPUT_DIR, { recursive: true });
  const outPath = path.join(OUTPUT_DIR, `${args.out}.webp`);

  await sharp(rawBuffer)
    .resize({ width: args.width, withoutEnlargement: true })
    .webp({ quality: args.quality })
    .toFile(outPath);

  const finalSize = (await stat(outPath)).size;

  console.log(`\nSaved: ${path.relative(ROOT, outPath)}`);
  console.log(`Size: ${(rawBuffer.length / 1024).toFixed(0)}KB → ${(finalSize / 1024).toFixed(0)}KB (WebP)`);
  console.log(`Use in the site as: /images/generated/${args.out}.webp`);
}

main();
