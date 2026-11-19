// main.ts — "Sum up 19 November's world news in one image"
// (make.fun competition news-image-20261119, entry: news-image-19-nov-2026)
//
// What the finished page shows, in one glance:
//   Thursday 19 November 2026, as a newspaper front page — 42 stories
//   in total, 13 of them drawn as illustrated cards (3 large across the
//   top, then 5 + 5 medium cards), the other 29 as one-line briefs in
//   two columns under a small world map with 13 numbered pins.
//   A strip headed "THE DAY IN NUMBERS" carries four figures from the
//   day: 22,133 people told to evacuate after the Kumamoto quake,
//   50,000 evacuated ahead of Cyclone Akvan, a 2-year delay to the EU's
//   methane rules, and 750 fighters the UN must fly out of DR Congo.
//   A date-check box at the foot lists the big stories deliberately
//   left out because they belong to an earlier day.
//
// Honesty note — three stories were still open when the research
// stopped at 10:57 WIB on 19 November, so no outcome is claimed for
// them: the Trump–Xi–Putin trilateral in Shenzhen is carded only as
// "meet today", the ICJ's Rohingya-genocide verdict only as "due
// today", and Anthropic's first day of trading only as "trades today"
// (its $83 price is labelled as Wednesday's pricing). Cyclone Akvan
// is drawn as "bearing down" on Odisha because its landfall is not
// until Friday 20 November.
//
// This file does no drawing and needs no network. The picture already
// exists next to it as entry.png; this program's only job is to check
// that file is a sound, in-limits PNG and then copy it, byte for
// byte, to the output location the harness reads.

import { copyFileSync, existsSync, mkdirSync, readFileSync, realpathSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The picture this entry ships, and the limits the bounty sets for it.
const SOURCE_FILE = "entry.png";
const OUTPUT_FILE = "entry.png";
const MAX_FILE_BYTES = 1024 * 1024; // 1 MiB
const EXPECTED_WIDTH = 1024;
const EXPECTED_HEIGHT = 1024;

// PNG's eight signature bytes: 137 80 78 71 13 10 26 10.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// Bit depths and colour types the PNG specification allows.
const ALLOWED_BIT_DEPTHS = new Set([1, 2, 4, 8, 16]);
const ALLOWED_COLOUR_TYPES = new Set([0, 2, 3, 4, 6]);

function die(message) {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

function sha256Hex(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

// Walk the PNG chunk by chunk, starting after the 8-byte signature.
// Every chunk is: 4-byte big-endian length, 4-byte type, length bytes
// of data, 4-byte CRC. The first chunk must be IHDR; the last chunk
// must be IEND and the file must end exactly there, so a truncated or
// trailing-garbage file cannot slip through.
function readPngHeader(bytes) {
  if (bytes.length < PNG_SIGNATURE.length + 8 + 13 + 4 + 12) {
    die(`entry.png is too short to be a PNG (${bytes.length} bytes)`);
  }
  if (!bytes.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    die("entry.png does not start with the PNG magic bytes");
  }

  let offset = PNG_SIGNATURE.length;
  let sawIhdr = false;
  let sawIend = false;
  let header = null;

  while (offset + 8 <= bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString("ascii", offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const chunkEnd = dataEnd + 4; // plus the CRC
    if (chunkEnd > bytes.length) {
      die(`PNG chunk ${type} at offset ${offset} runs past the end of the file`);
    }

    if (!sawIhdr) {
      if (type !== "IHDR") die(`first PNG chunk is ${type}, expected IHDR`);
      if (length !== 13) die(`IHDR chunk is ${length} bytes, expected 13`);
      sawIhdr = true;
      const width = bytes.readUInt32BE(dataStart);
      const height = bytes.readUInt32BE(dataStart + 4);
      const bitDepth = bytes[dataStart + 8];
      const colourType = bytes[dataStart + 9];
      const compression = bytes[dataStart + 10];
      const filter = bytes[dataStart + 11];
      const interlace = bytes[dataStart + 12];
      if (width !== EXPECTED_WIDTH || height !== EXPECTED_HEIGHT) {
        die(`entry.png is ${width}x${height}, expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}`);
      }
      if (!ALLOWED_BIT_DEPTHS.has(bitDepth)) die(`unsupported PNG bit depth ${bitDepth}`);
      if (!ALLOWED_COLOUR_TYPES.has(colourType)) die(`unsupported PNG colour type ${colourType}`);
      if (compression !== 0) die(`unsupported PNG compression method ${compression}`);
      if (filter !== 0) die(`unsupported PNG filter method ${filter}`);
      if (interlace !== 0 && interlace !== 1) die(`unsupported PNG interlace method ${interlace}`);
      header = { width, height, bitDepth, colourType };
    }

    if (type === "IEND") {
      if (length !== 0) die("IEND chunk must be empty");
      if (chunkEnd !== bytes.length) die("bytes found after the IEND chunk");
      sawIend = true;
      break;
    }

    offset = chunkEnd;
  }

  if (!sawIhdr) die("no IHDR chunk found in entry.png");
  if (!sawIend) die("no IEND chunk found in entry.png — the file may be truncated");
  return header;
}

function loadAndValidate(sourcePath) {
  if (!existsSync(sourcePath)) die(`cannot find ${sourcePath}`);
  const bytes = readFileSync(sourcePath);
  if (bytes.length > MAX_FILE_BYTES) {
    die(`entry.png is ${bytes.length} bytes, over the 1 MiB limit (${MAX_FILE_BYTES})`);
  }
  const header = readPngHeader(bytes);
  console.log(
    `validated entry.png: ${header.width}x${header.height}, ` +
      `bit depth ${header.bitDepth}, colour type ${header.colourType}, ` +
      `${bytes.length} bytes`,
  );
  return bytes;
}

// Where the finished image goes. The harness reads /output/entry.png
// by default; MAKEFUN_OUTPUT_DIR overrides the directory (used when
// testing locally, so the test run never touches /output).
function outputDirectory() {
  const override = process.env.MAKEFUN_OUTPUT_DIR;
  return override && override.trim() !== "" ? override : "/output";
}

function sameFile(first, second) {
  if (resolve(first) === resolve(second)) return true;
  if (existsSync(first) && existsSync(second)) {
    try {
      return realpathSync(first) === realpathSync(second);
    } catch {
      return false;
    }
  }
  return false;
}

function main() {
  // The picture lives beside this file, wherever the repository was
  // checked out, so resolve it from the script's own location.
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const sourcePath = join(scriptDir, SOURCE_FILE);
  const sourceBytes = loadAndValidate(sourcePath);
  const sourceHash = sha256Hex(sourceBytes);

  const destinationDir = outputDirectory();
  const destinationPath = join(destinationDir, OUTPUT_FILE);
  if (sameFile(sourcePath, destinationPath)) {
    die("refusing to copy entry.png onto itself — pick a different output directory");
  }

  mkdirSync(destinationDir, { recursive: true });
  copyFileSync(sourcePath, destinationPath);

  // Prove the copy is exact: hash what landed in the output
  // directory and compare it with the hash of the source.
  const copiedBytes = readFileSync(destinationPath);
  const copiedHash = sha256Hex(copiedBytes);
  if (copiedHash !== sourceHash) {
    die(`copy mismatch: source sha256 ${sourceHash}, copy sha256 ${copiedHash}`);
  }

  console.log(`wrote ${destinationPath} (${copiedBytes.length} bytes)`);
  console.log(`sha256: ${copiedHash}`);
}

main();
