// main.ts — entry program for the news-image-20261119 round-4 poster.
//
// The poster itself is entry.png (1024x1024, drawn in code by the
// build script that lives outside this repository). This program does
// not generate the image: it proves the shipped file is exactly the
// poster it claims to be, then delivers those exact bytes.
//
// Checks, in order:
//   1. entry.png sits next to this file and is at most 1 MiB.
//   2. PNG signature, a 13-byte IHDR first, dimensions 1024x1024,
//      8-bit colour type 2 (truecolour RGB).
//   3. Every chunk's CRC-32 matches its stored value; IEND is the
//      last chunk and nothing follows it.
//   4. The delivered copy reads back byte-identical (SHA-256 match).
//
// Run:  MAKEFUN_OUTPUT_DIR=out node main.ts
// (Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output;
// with no variable set the program writes to ./out.)

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(HERE, "entry.png");
const MAX_BYTES = 1024 * 1024;
const EXPECTED_WIDTH = 1024;
const EXPECTED_HEIGHT = 1024;

function die(message) {
  console.error("main.ts: " + message);
  process.exit(1);
}

function sha256Hex(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

// CRC-32 (IEEE 802.3, polynomial 0xEDB88320), table built once.
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Walk the PNG chunk by chunk. Returns [width, height] after checking
// the signature, the IHDR contents, every chunk CRC and the IEND tail.
function inspectPng(bytes) {
  const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (bytes.length < 8 || !bytes.subarray(0, 8).equals(PNG_MAGIC)) {
    die("entry.png does not start with the PNG signature");
  }
  let offset = 8;
  let first = true;
  let width = 0;
  let height = 0;
  let sawIend = false;
  while (offset + 8 <= bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString("latin1", offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    if (dataEnd + 4 > bytes.length) {
      die("chunk " + type + " overruns the file");
    }
    const storedCrc = bytes.readUInt32BE(dataEnd);
    const computed = crc32(
      Buffer.concat([bytes.subarray(offset + 4, offset + 8),
                     bytes.subarray(dataStart, dataEnd)])
    );
    if (storedCrc !== computed) {
      die("chunk " + type + " has a bad CRC");
    }
    if (first) {
      if (type !== "IHDR" || length !== 13) {
        die("first chunk is not a 13-byte IHDR");
      }
      width = bytes.readUInt32BE(dataStart);
      height = bytes.readUInt32BE(dataStart + 4);
      const bitDepth = bytes[dataStart + 8];
      const colourType = bytes[dataStart + 9];
      if (width !== EXPECTED_WIDTH || height !== EXPECTED_HEIGHT) {
        die(`poster is ${width}x${height}, expected 1024x1024`);
      }
      if (bitDepth !== 8 || colourType !== 2) {
        die(`expected 8-bit truecolour RGB, got bit depth ${bitDepth}, ` +
            `colour type ${colourType}`);
      }
      first = false;
    }
    if (type === "IEND") {
      sawIend = true;
      if (dataEnd + 4 !== bytes.length) {
        die("trailing bytes after IEND");
      }
      break;
    }
    offset = dataEnd + 4;
  }
  if (!sawIend) {
    die("no IEND chunk found");
  }
  return [width, height];
}

function main() {
  const bytes = readFileSync(SOURCE);
  if (bytes.length > MAX_BYTES) {
    die(`entry.png is ${bytes.length} bytes, over the 1 MiB limit`);
  }
  const [width, height] = inspectPng(bytes);
  const digest = sha256Hex(bytes);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR
    ? resolve(process.env.MAKEFUN_OUTPUT_DIR)
    : join(HERE, "out");
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.png");
  if (resolve(target) === resolve(SOURCE)) {
    die("output directory is the entry directory; refusing to overwrite");
  }
  writeFileSync(target, bytes);

  const delivered = readFileSync(target);
  if (sha256Hex(delivered) !== digest) {
    die("delivered file does not match the validated bytes");
  }
  console.log(`entry.png ${width}x${height}, ${bytes.length} bytes`);
  console.log(`sha256 ${digest}`);
  console.log(`wrote ${target}`);
}

main();
