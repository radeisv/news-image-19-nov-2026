// v1 entry for make.fun "Sum up 19 November's world news in one
// image" (competition news-image-20261119, Node 22, standard library only).
//
// What this page is: a newspaper front page for Thursday 19 November
// 2026 — 42 stories, 13 of them illustrated (3 large cards on top, then
// 5 + 5 medium cards), 29 one-line briefs in two columns, a "THE DAY IN
// NUMBERS" strip (22,133 people told to evacuate in Minamata, 50,000
// evacuated ahead of Cyclone Akvan, the EU's 2-year methane-rule delay,
// 750 fighters the UN must fly out of DR Congo), a thick segmented
// region bar whose counts sum to 42, a beige land-mass world map with 13
// numbered pins, and a date-check box naming the stories deliberately
// left out because they first appeared before Thursday. The three
// still-open stories of the day are carded only as "today" items — the
// Trump–Xi–Putin trilateral meets today, the ICJ Rohingya verdict is due
// today, Anthropic shares trade today — because at the research cut-off
// (Thu 19 Nov 10:57 WIB) no outcome for any of them was known, and this
// page never invents one. Cyclone Akvan is "bearing down", never "hits":
// its landfall is Fri 20 Nov.
//
// The finished image is entry.png beside this file. This program does
// not draw anything: it checks the image against the competition's
// gate (PNG, 1024x1024, at most 1 MiB, complete IEND chunk) and copies
// it byte for byte to /output/entry.png, verifying the copy by hash.
// No network, no randomness: identical bytes on every run.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for
// /output: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function die(message) {
  throw new Error(`news-image-20261119 v1: ${message}`);
}

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");
const ONE_MIB = 1024 * 1024;

if (!existsSync(source)) die(`entry.png not found next to main.ts (${source})`);
const bytes = readFileSync(source);

// A PNG starts with the 8-byte signature 89 50 4E 47 0D 0A 1A 0A.
const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
if (bytes.length < 8 || signature.some((b, i) => bytes[i] !== b)) {
  die("entry.png is not a PNG (bad signature)");
}
// Width and height live in the IHDR chunk at bytes 16 and 20.
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width !== 1024 || height !== 1024) {
  die(`image is ${width}x${height}, expected 1024x1024`);
}
// Revision: check the IHDR chunk itself, not just the size fields —
// its length must be 13, its type must read IHDR, and the bit depth
// and colour type must be values a PNG decoder accepts, so a file
// with a plausible size but a corrupt header fails here.
const ihdrLength = bytes.readUInt32BE(8);
const ihdrType = bytes.subarray(12, 16).toString("latin1");
const bitDepth = bytes[24];
const colourType = bytes[25];
if (ihdrLength !== 13 || ihdrType !== "IHDR") {
  die(`first chunk is not IHDR (length ${ihdrLength}, type ${ihdrType})`);
}
if (![1, 2, 4, 8, 16].includes(bitDepth) || ![0, 2, 3, 4, 6].includes(colourType)) {
  die(`unsupported IHDR: bit depth ${bitDepth}, colour type ${colourType}`);
}
if (bytes.length > ONE_MIB) {
  die(`image is ${bytes.length} bytes, over the 1 MiB limit`);
}
// A complete PNG ends with an empty IEND chunk: length 0, the letters
// IEND, then the chunk CRC.
const iendLength = bytes.readUInt32BE(bytes.length - 12);
const iendTag = bytes.subarray(bytes.length - 8, bytes.length - 4).toString("latin1");
if (iendLength !== 0 || iendTag !== "IEND") {
  die("image is truncated: no trailing IEND chunk");
}

mkdirSync(outDir, { recursive: true });
// Never copy the file onto itself: if MAKEFUN_OUTPUT_DIR ever points
// at this repository directory, the copy would truncate the source.
if (resolve(target) === resolve(source)) {
  die(`refusing to copy entry.png onto itself (${target})`);
}
copyFileSync(source, target);

// Verify the copy itself, not just its size: hash the destination and
// compare it with the source, so a partial or corrupted write fails
// loudly instead of reaching the judge.
const sourceHash = createHash("sha256").update(bytes).digest("hex");
const copiedHash = createHash("sha256").update(readFileSync(target)).digest("hex");
if (copiedHash !== sourceHash) {
  die(`copy hash mismatch: ${copiedHash.slice(0, 12)}... != ${sourceHash.slice(0, 12)}...`);
}
const written = statSync(target).size;
if (written !== bytes.length) {
  die(`copy size mismatch: wrote ${written} bytes, expected ${bytes.length}`);
}
console.log(
  `news-image-20261119 v1: front page, 42 stories (13 drawn + 29 briefs), ` +
  `${width}x${height} PNG, ${bytes.length} bytes, sha256 ${sourceHash.slice(0, 12)}... -> ${target}`,
);
