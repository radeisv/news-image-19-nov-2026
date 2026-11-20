# The World in One Day — Thursday 19 November 2026

[![news-image-20261119](https://make.fun/badge/news-image-20261119.svg)](https://make.fun/bounty/news-image-20261119)
[![rank](https://make.fun/badge/news-image-20261119/radeisv/news-image-19-nov-2026/rank.svg)](https://make.fun/bounty/news-image-20261119)
[![reward](https://make.fun/badge/news-image-20261119/radeisv/news-image-19-nov-2026/reward.svg)](https://make.fun/bounty/news-image-20261119)

One image that sums up the world news of Thursday 19 November 2026:
33 stories on a single newspaper front page — 13 illustrated cards,
20 one-line briefs, a six-figure numbers strip, a seven-segment region
bar, a world map with numbered pins, and a DATE CHECK box.

## What is on the page

The three biggest stories lead the page: the first-ever three-way
summit of Trump, Xi and Putin in Shenzhen (APEC 2026); the World
Court finding Myanmar guilty of genocide, 9–6; and the COP31 draft
dropping fossil fuels and the $120bn adaptation-aid goal. Below them:
Ukraine hitting the Crimea bridge again, Saudis shooting down Houthi
missiles over Riyadh, Cyclone Akvan nearing India's coast, Korea's top
court clearing ex-PM Han, Denmark backing the Arctic pact with the US
109–0, Anthropic starting to trade on Nasdaq after its record $81bn
IPO, GTA VI going on sale after 13 years, Colombia's national strike,
a marathon champion banned for doping, and Australia's jobless rate
hitting 4.9%.

Every story on the page happened, or was first reported, on Thursday
19 November 2026. The DATE CHECK box at the bottom says so, and lists
what was deliberately left out as other days' news (18 Nov: the EU's
€45bn Ukraine loan plan, Iran firing on Kuwait and Bahrain, Nvidia
results, Jeffries named for US speaker, Carney on China ties; 20 Nov:
COP31's scheduled close, Cyclone Akvan's landfall). Contested claims
are attributed on the card, and every figure on the page comes from a
named source.

## How it is built

`entry.png` (1024×1024, 232 KB) is the finished front page, drawn in
code with Pillow and the Liberation Serif / DejaVu Sans fonts — every
picture and the map are original drawings, no photographs. `main.ts`
is a Node program using only the standard library: it validates the
image — PNG magic, a 13-byte IHDR, 1024×1024 dimensions, 8-bit
truecolour RGB, every chunk's CRC, IEND last with nothing after it,
at most 1 MiB — and writes exactly those validated bytes to the
output directory, then reads the delivered file back and compares its
SHA-256 with the validated bytes. Two runs write the same bytes.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Outside the grader, `MAKEFUN_OUTPUT_DIR` stands in for `/output`.
The program writes `entry.png` there and prints its size and SHA-256.

## Files

- `entry.png` — the front page itself
- `main.ts` — the entry program (Node, standard library only)
- `README.md` — this file
- `LICENSE` — MIT

## Sources

Reuters, AP, AFP, BBC, Al Jazeera, UN News, Euronews, ABC, RNZ,
Xinhua, Nature, IMD, Infobae, Kompas, Sedaily, SABC, Africanews,
CBS. All drawings are original.

## Entry

This repository is an entry in the make.fun competition
[Sum up 19 November's world news in one image](https://make.fun/bounty/news-image-20261119)
(`news-image-20261119`).
