// The World in One Day — Thursday 19 November 2026
// news-image-20261119 entry program, round 5 (Node 22, stdlib only).
//
// The poster is drawn in advance by build_image_v5.py and shipped in this
// repository as entry.png (a 1024x1024 RGB PNG of 33 stories from the one
// day: 13 illustrated cards, 20 briefs, a hand-drawn world map with
// numbered pins, a DATE CHECK box). This program does exactly one job:
// deliver those exact bytes to the output directory the grader provides.
//
// It refuses to run if the file it is about to deliver is not a
// well-formed PNG of the right size inside the competition's 1 MiB limit,
// and it reads the file back after writing to prove the delivered bytes
// are identical. It reads nothing else, reaches no network, and writes
// the same bytes on every run, so two runs are byte-identical.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ENTRY_NAME = "entry.png";
const MAX_BYTES = 1024 * 1024;
const WANT_WIDTH = 1024;
const WANT_HEIGHT = 1024;
const WANT_BIT_DEPTH = 8;
const WANT_COLOR_TYPE = 2; // truecolour RGB
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function die(message) {
  console.error("makefun entry: " + message);
  process.exit(1);
}

function sha256Hex(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

// CRC-32 (IEEE) over a PNG chunk's type + data, computed by hand so the
// program needs no dependency.
const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function readU32(buf, off) {
  return buf.readUInt32BE(off);
}

// Walk every chunk: correct length, known structure, matching CRC, and
// IEND as the final chunk. Returns { width, height } from IHDR.
function validatePng(bytes) {
  if (bytes.length < 8 || !bytes.subarray(0, 8).equals(PNG_MAGIC)) {
    die("not a PNG file (bad magic)");
  }
  let off = 8;
  let seenIhdr = false;
  let seenIend = false;
  let first = true;
  let width = 0;
  let height = 0;
  while (off + 12 <= bytes.length) {
    const len = readU32(bytes, off);
    const type = bytes.subarray(off + 4, off + 8).toString("latin1");
    if (first && type !== "IHDR") die("first chunk is not IHDR");
    first = false;
    const dataStart = off + 8;
    const dataEnd = dataStart + len;
    const crcEnd = dataEnd + 4;
    if (crcEnd > bytes.length) {
      die("truncated PNG chunk " + type);
    }
    const stored = readU32(bytes, dataEnd);
    const actual = crc32(bytes.subarray(off + 4, dataEnd));
    if (stored !== actual) {
      die("CRC mismatch in chunk " + type);
    }
    if (type === "IHDR") {
      if (seenIhdr || len !== 13) die("bad IHDR");
      seenIhdr = true;
      width = readU32(bytes, dataStart);
      height = readU32(bytes, dataStart + 4);
      const bitDepth = bytes[dataStart + 8];
      const colorType = bytes[dataStart + 9];
      if (bitDepth !== WANT_BIT_DEPTH || colorType !== WANT_COLOR_TYPE) {
        die("expected 8-bit RGB PNG, got bitDepth " + bitDepth +
            " colorType " + colorType);
      }
    }
    if (type === "IEND") {
      if (len !== 0) die("bad IEND");
      seenIend = true;
      if (crcEnd !== bytes.length) die("trailing bytes after IEND");
      break;
    }
    off = crcEnd;
  }
  if (!seenIhdr) die("missing IHDR");
  if (!seenIend) die("missing IEND");
  if (width !== WANT_WIDTH || height !== WANT_HEIGHT) {
    die("expected " + WANT_WIDTH + "x" + WANT_HEIGHT + ", got " +
        width + "x" + height);
  }
  return { width, height };
}

function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const src = join(here, ENTRY_NAME);
  if (!existsSync(src)) die("missing " + ENTRY_NAME + " next to main.ts");
  const bytes = readFileSync(src);
  if (bytes.length > MAX_BYTES) {
    die(ENTRY_NAME + " is " + bytes.length + " bytes, over the 1 MiB limit");
  }
  validatePng(bytes);
  const wantHash = sha256Hex(bytes);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const dest = join(realpathSync(outDir), ENTRY_NAME);
  writeFileSync(dest, bytes);

  const back = readFileSync(dest);
  const gotHash = sha256Hex(back);
  if (gotHash !== wantHash) {
    die("read-back hash mismatch after writing " + dest);
  }
  const size = statSync(dest).size;
  console.log("wrote " + dest + " (" + size + " bytes, sha256 " +
              gotHash + ")");
}

main();
