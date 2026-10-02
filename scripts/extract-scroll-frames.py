#!/usr/bin/env python3
"""
Turn a video into an image sequence for the scroll animation
(src/components/ScrollSequence.tsx).

Scroll-scrubbing a <video> behaves differently on every device (colour
shifts, seeking stalls, autoplay rules on phones). A sequence of still frames
drawn to a canvas behaves the same everywhere, so the site uses that instead.

Usage (from the project root):
  python3 scripts/extract-scroll-frames.py src/assets/animation.mp4 public/videos/medivo-scroll

Produces:
  <out>/desktop/001.webp ... NNN.webp   1280px wide
  <out>/mobile/001.webp  ... NNN.webp    960px wide
  <out>-still.jpg                        frame shown for prefers-reduced-motion

If you change FRAME_COUNT, update `frameCount` where <ScrollSequence> is used.

Requirements: macOS (the system Python's PyObjC decodes the video) and the
project's node_modules (sharp, installed with Next.js, writes the WebP files).
On other systems the same result can be produced with ffmpeg + cwebp.
"""

import os
import shutil
import subprocess
import sys
import tempfile

import AVFoundation as AV
import CoreMedia as CM
import Quartz
from Foundation import NSURL

FRAME_COUNT = 120
STILL_AT = 0.4  # fraction of the animation used for the reduced-motion still

RENDITIONS = [
    # folder, width, WebP quality
    ("desktop", 1280, 70),
    ("mobile", 960, 62),
]

CONVERT_JS = r"""
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const [src, out, renditionsJson, stillIndex] = process.argv.slice(1);
(async () => {
  const frames = fs.readdirSync(src).filter((f) => f.endsWith(".png")).sort();
  for (const [folder, width, quality] of JSON.parse(renditionsJson)) {
    const dir = path.join(out, folder);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    let bytes = 0;
    for (const f of frames) {
      const file = path.join(dir, f.replace(".png", ".webp"));
      await sharp(path.join(src, f)).resize(width).webp({ quality, effort: 5 }).toFile(file);
      bytes += fs.statSync(file).size;
    }
    console.log(`${dir}: ${frames.length} frames, ${(bytes / 1e6).toFixed(1)} MB`);
  }
  await sharp(path.join(src, frames[Number(stillIndex)])).jpeg({ quality: 82 }).toFile(`${out}-still.jpg`);
  console.log(`${out}-still.jpg`);
})();
"""


def extract_pngs(src, tmp):
    asset = AV.AVURLAsset.URLAssetWithURL_options_(
        NSURL.fileURLWithPath_(os.path.abspath(src)), None
    )
    track = asset.tracksWithMediaType_(AV.AVMediaTypeVideo)[0]
    fps = track.nominalFrameRate() or 24
    last = CM.CMTimeGetSeconds(asset.duration()) - 1.0 / fps

    gen = AV.AVAssetImageGenerator.assetImageGeneratorWithAsset_(asset)
    gen.setAppliesPreferredTrackTransform_(True)
    gen.setRequestedTimeToleranceBefore_(CM.kCMTimeZero)
    gen.setRequestedTimeToleranceAfter_(CM.kCMTimeZero)

    for i in range(FRAME_COUNT):
        seconds = last * i / (FRAME_COUNT - 1)
        image = gen.copyCGImageAtTime_actualTime_error_(
            CM.CMTimeMakeWithSeconds(seconds, 60000), None, None
        )[0]
        dest = Quartz.CGImageDestinationCreateWithURL(
            NSURL.fileURLWithPath_(os.path.join(tmp, f"{i + 1:03d}.png")),
            "public.png",
            1,
            None,
        )
        Quartz.CGImageDestinationAddImage(dest, image, None)
        Quartz.CGImageDestinationFinalize(dest)


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, out = sys.argv[1], sys.argv[2]
    tmp = tempfile.mkdtemp(prefix="scroll-frames-")
    try:
        extract_pngs(src, tmp)
        import json

        subprocess.run(
            [
                "node",
                "-e",
                CONVERT_JS,
                tmp,
                out,
                json.dumps(RENDITIONS),
                str(round(STILL_AT * (FRAME_COUNT - 1))),
            ],
            check=True,
        )
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
