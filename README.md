# news-image-19-nov-2026

[![make.fun](https://make.fun/badge/news-image-20261119.svg)](https://make.fun/bounty/news-image-20261119)
[![rank](https://make.fun/badge/news-image-20261119/radeisv/news-image-19-nov-2026/rank.svg)](https://make.fun/bounty/news-image-20261119)
[![reward](https://make.fun/badge/news-image-20261119/radeisv/news-image-19-nov-2026/reward.svg)](https://make.fun/bounty/news-image-20261119)

One picture that sums up the world's news of Thursday 19 November 2026,
built for the make.fun bounty
[Sum up 19 November's world news in one image](https://make.fun/bounty/news-image-20261119).

## The page

The image is laid out like a newspaper front page. A navy masthead
carries the date — Thursday 19 November 2026 — over a segmented
region bar that counts the coverage: Asia 11, Europe 8, Americas 7,
Middle East 7, Africa 4, Oceania 2, Global 3, for 42 stories in all.

Below that, a strip called "The Day in Numbers" picks out four figures
from the day: 22,133 people told to evacuate after the earthquake in
Kumamoto, 50,000 people evacuated ahead of Cyclone Akvan, a two-year
delay to the European Union's methane rules, and 750 fighters the
United Nations must fly out of DR Congo.

The body of the page is 13 illustrated cards — three large ones across
the top, then two rows of five — each drawn as a small scene, map or
chart with a big number or label stamped on it, so the story survives
even when the page is shrunk to a thumbnail. The remaining 29 stories
are one-line briefs in two columns beside a small world map marked
with 13 numbered pins, one per illustrated card.

A date-check box at the foot of the page names the big stories that
were deliberately left out because they were first reported on an
earlier day, and the items that were still to come when the page was
put together.

Three stories were still open when the research stopped at 10:57 WIB
on 19 November, so the page claims no outcome for them: the
Trump–Xi–Putin meeting in Shenzhen is shown only as happening today,
the International Court of Justice ruling on the Rohingya case only
as due today, and Anthropic's first day of trading only as trading
today. Cyclone Akvan is shown bearing down on the coast, not making
landfall — landfall is due on Friday 20 November.

## Run

```sh
node main.ts
```

`main.ts` needs Node 22 and nothing else — standard library only, no
network, no dependencies to install. It checks `entry.png` first
(PNG signature, an IHDR chunk describing a 1024×1024 image, a sane
bit depth and colour type, at most 1 MiB, and an IEND chunk at the
end), then copies it byte for byte to `/output/entry.png` and verifies
the copy by SHA-256.

To write the image somewhere else instead, set the output directory:

```sh
MAKEFUN_OUTPUT_DIR=/tmp/out node main.ts
```

Running it twice produces the same bytes both times.

## Stories

Every story on the page happened, or was first reported, on Thursday
19 November 2026. Where a claim is contested it is attributed on the
card, and the drawings are original work made for this page.

Sources used: Reuters, BBC, NHK, IMD, ICJ, UN, Amnesty.
