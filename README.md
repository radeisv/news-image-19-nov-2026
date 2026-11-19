# news-image-19-nov-2026

[![make.fun · news-image-20261119](https://make.fun/badge/news-image-20261119.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![rank](https://make.fun/badge/news-image-20261119/radeisv/news-image-19-nov-2026/rank.svg)](https://make.fun/bounty/news-image-20261119/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![reward](https://make.fun/badge/news-image-20261119/radeisv/news-image-19-nov-2026/reward.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)

A dense newspaper front page that sums up Thursday 19 November 2026 in
one picture: 42 stories, 13 of them illustrated. A dark navy masthead
carries the date; below it, a thick segmented region bar (Asia 11 ·
Europe 8 · Americas 7 · Middle East 7 · Africa 4 · Oceania 2 · Global
3) and a "THE DAY IN NUMBERS" strip (22,133 people told to evacuate in
Minamata, 50,000 evacuated ahead of Cyclone Akvan, the EU's 2-year
methane-rule delay, 750 fighters the UN must fly out of DR Congo).
Three large cards lead — the Trump–Xi–Putin trilateral meeting in
Shenzhen, the Crimean Bridge hit a third time, and the Kumamoto quake
that put a whole city on evacuation order — followed by ten medium
cards, each with a big in-image number or label, and 29 one-line briefs
in two columns beside a beige land-mass world map with 13 numbered
pins. A date-check box names the stories left out on purpose because
they first appeared before Thursday.

The three still-open stories of the day are carded only as "today"
items — the trilateral meets today, the ICJ Rohingya verdict is due
today, Anthropic shares trade today — because at the research cut-off
(Thu 19 Nov 10:57 WIB) no outcome for any of them was known, and this
page never invents one. Cyclone Akvan is "bearing down", never "hits":
its landfall is Fri 20 Nov.

## Run

```sh
node main.ts
```

`main.ts` (Node 22, standard library only) checks `entry.png` (PNG,
1024×1024, at most 1 MiB, complete IEND chunk) and copies it byte for
byte to `/output/entry.png`, verifying the copy by SHA-256. Set
`MAKEFUN_OUTPUT_DIR` to write somewhere else. No network, no
randomness: identical bytes on every run.

## Stories

Every story on this page happened, or was first reported, on Thursday
19 November 2026. Contested claims are attributed. Original drawings.
Sources: Reuters · BBC · NHK · IMD · ICJ · UN · Amnesty.
