#!/usr/bin/env node
/**
 * Repeatable image-generation workflow for this project.
 *
 * Uses Google's official Gemini API image models ("Nano Banana" family) via the
 * official @google/genai SDK — the currently supported path for Google image
 * generation. The older standalone Imagen API is deprecated and being shut down,
 * so this deliberately targets Gemini's native image generation instead.
 *
 * Usage:
 *   node scripts/generate-image.mjs --prompt "..." --out "hero-engine-bay" [options]
 *
 * Options:
 *   --prompt   <text>     Required. The image description.
 *   --out      <name>     Required. Output filename (no extension) under public/images/generated/.
 *   --model    <id>       Gemini image model. Default: gemini-2.5-flash-image (stable GA).
 *                         Try gemini-3-pro-image or gemini-3.1-flash-image for newer/higher-quality
 *                         output if your API key has access.
 *   --aspect   <ratio>    Aspect ratio hint appended to the prompt, e.g. "16:9". Default: 16:9.
 *   --width    <px>       Max output width after compression. Default: 1920.
 *   --quality  <0-100>    WebP quality. Default: 82.
 *
 * Requires GEMINI_API_KEY in the environment (.env.local) — get one free at
 * https://aistudio.google.com/apikey
 */

import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import { config as loadEnv } from "dotenv";
import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
loadEnv({ path: path.join(ROOT, ".env.local") });

const OUTPUT_DIR = path.join(ROOT, "public", "images", "generated");
const DEFAULT_MODEL = "gemini-2.5-flash-image";

function parseArgs(argv) {
  const args = { model: DEFAULT_MODEL, aspect: "16:9", width: 1920, quality: 82 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--prompt") args.prompt = argv[++i];
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--model") args.model = argv[++i];
    else if (a === "--aspect") args.aspect = argv[++i];
    else if (a === "--width") args.width = Number(argv[++i]);
    else if (a === "--quality") args.quality = Number(argv[++i]);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.prompt || !args.out) {
    console.error(
      'Usage: node scripts/generate-image.mjs --prompt "<description>" --out "<filename-no-ext>" [--model id] [--aspect 16:9] [--width 1920] [--quality 82]'
    );
    process.exit(1);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error(
      "Missing GEMINI_API_KEY.\n\n" +
        "1. Get a free key at https://aistudio.google.com/apikey\n" +
        "2. Create a .env.local file in the project root containing:\n" +
        "   GEMINI_API_KEY=your-key-here\n"
    );
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  const fullPrompt = `${args.prompt}\n\nAspect ratio: ${args.aspect}. Photorealistic, professional commercial photography quality, sharp focus, natural lighting.`;

  console.log(`Generating with ${args.model} …`);
  console.log(`Prompt: ${fullPrompt}`);

  let response;
  try {
    response = await ai.models.generateContent({
      model: args.model,
      contents: fullPrompt,
    });
  } catch (err) {
    console.error("Gemini API request failed:", err?.message ?? err);
    process.exit(1);
  }

  const parts = response?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData?.data);

  if (!imagePart) {
    const textPart = parts.find((p) => p.text)?.text;
    console.error(
      "No image was returned.\n" +
        (textPart
          ? `Model response: ${textPart}`
          : "The model may have refused the prompt, or this model/account doesn't support image output.")
    );
    process.exit(1);
  }

  const rawBuffer = Buffer.from(imagePart.inlineData.data, "base64");

  await mkdir(OUTPUT_DIR, { recursive: true });
  const outPath = path.join(OUTPUT_DIR, `${args.out}.webp`);

  await sharp(rawBuffer)
    .resize({ width: args.width, withoutEnlargement: true })
    .webp({ quality: args.quality })
    .toFile(outPath);

  const [rawSize, finalSize] = await Promise.all([
    Promise.resolve(rawBuffer.length),
    stat(outPath).then((s) => s.size),
  ]);

  console.log(`\nSaved: ${path.relative(ROOT, outPath)}`);
  console.log(`Size: ${(rawSize / 1024).toFixed(0)}KB → ${(finalSize / 1024).toFixed(0)}KB (WebP)`);
  console.log(`Use in the site as: /images/generated/${args.out}.webp`);
}

main();
