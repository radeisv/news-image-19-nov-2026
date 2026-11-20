# The World in One Day — Thursday 19 November 2026

[![news-image-20261119](https://make.fun/badge/news-image-20261119.svg)](https://make.fun/bounty/news-image-20261119)
[![rank](https://make.fun/badge/news-image-20261119/radeisv/news-image-19-nov-2026/rank.svg)](https://make.fun/bounty/news-image-20261119)
[![reward](https://make.fun/badge/news-image-20261119/radeisv/news-image-19-nov-2026/reward.svg)](https://make.fun/bounty/news-image-20261119)

A program that writes one image summing up the world news of Thursday 19
November 2026: **33 stories from the one day** — 13 illustrated cards (3
leads + 10 features), 20 briefs, a hand-drawn world map with numbered pins,
and a DATE CHECK box. Entry for the
[news-image-20261119](https://make.fun/bounty/news-image-20261119)
competition on [make.fun](https://make.fun).

## The image

`entry.png` (1024×1024, 265,988 bytes) is drawn in advance by
`build_image_v5.py` (Pillow, no network) and shipped here. The top three
stories are the first US–China–Russia three-way summit in Shenzhen, the
World Court's 9–6 genocide finding against Myanmar, and the COP31 draft
that drops fossil fuels and the $120bn aid goal. The map is drawn from
hand-authored lon/lat continent polygons projected equirectangularly, and
every pin is verified inside a land polygon by a point-in-polygon test in
the build script (pins that would collide are offset with a leader line to
a dot at the true place, as in the reference).

## The program

`main.ts` (Node 22, standard library only) delivers `entry.png` to the
output directory the grader provides. It validates the PNG first (magic,
IHDR 1024×1024 8-bit RGB, CRC of every chunk, IEND last), writes it, and
reads it back to prove the delivered bytes are identical. It reads
nothing else and reaches no network, so two runs are byte-identical.

Run it outside the grader with `MAKEFUN_OUTPUT_DIR` standing in for
`/output`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

- `entry.png` — the poster
- `main.ts` — the entry program
- `README.md` — this file
- `LICENSE` — MIT
- `.makefun/owner.json` — payout wallet

Status: built locally — uploaded to GitHub, not yet submitted to make.fun.
Round 5 rebuild from zero (round 4 was rejected by the author for a
sloppy map and rushed art).
