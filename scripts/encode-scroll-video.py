#!/usr/bin/env python3
"""
Re-encode a video for scroll-scrubbing (macOS only, no ffmpeg needed).

Scroll-driven video seeks constantly, forwards and backwards. Typical exports
have one keyframe every few seconds, so every seek has to decode from the
previous keyframe and scrubbing stutters. This script writes H.264 files with:

  - a keyframe every KEYFRAME_INTERVAL frames
  - no B-frames (frame reordering off), so frames decode independently of later ones
  - no audio track
  - moov atom at the front (fast start)
  - a desktop and a smaller mobile rendition, plus poster JPEGs

Usage:
  python3 scripts/encode-scroll-video.py src/assets/animation.mp4 public/videos/medivo-scroll

Produces:
  <out>.mp4            1280x720 desktop
  <out>-mobile.mp4     960x540 mobile
  <out>-poster.jpg     first frame (shown while loading)
  <out>-still.jpg      frame at STILL_AT (shown for prefers-reduced-motion)

Requires PyObjC, which ships with the macOS system Python.
"""

import os
import sys
import time

import AVFoundation as AV
import CoreMedia as CM
import Quartz
from Foundation import NSURL

KEYFRAME_INTERVAL = 4
STILL_AT = 0.4  # fraction of the duration used for the reduced-motion still

RENDITIONS = [
    # suffix, width, height, average bitrate (bits/s)
    ("", 1280, 720, 4_500_000),
    ("-mobile", 960, 540, 1_600_000),
]


def encode(src_url, dst_path, width, height, bitrate):
    if os.path.exists(dst_path):
        os.remove(dst_path)

    asset = AV.AVURLAsset.URLAssetWithURL_options_(src_url, None)
    track = asset.tracksWithMediaType_(AV.AVMediaTypeVideo)[0]
    fps = track.nominalFrameRate() or 30

    reader, err = AV.AVAssetReader.alloc().initWithAsset_error_(asset, None)
    if err:
        raise RuntimeError(err)
    output = AV.AVAssetReaderTrackOutput.alloc().initWithTrack_outputSettings_(
        track,
        {Quartz.kCVPixelBufferPixelFormatTypeKey: Quartz.kCVPixelFormatType_32BGRA},
    )
    output.setAlwaysCopiesSampleData_(False)
    reader.addOutput_(output)

    writer, err = AV.AVAssetWriter.alloc().initWithURL_fileType_error_(
        NSURL.fileURLWithPath_(dst_path), AV.AVFileTypeMPEG4, None
    )
    if err:
        raise RuntimeError(err)
    writer.setShouldOptimizeForNetworkUse_(True)

    settings = {
        AV.AVVideoCodecKey: AV.AVVideoCodecTypeH264,
        AV.AVVideoWidthKey: width,
        AV.AVVideoHeightKey: height,
        AV.AVVideoScalingModeKey: AV.AVVideoScalingModeResizeAspectFill,
        AV.AVVideoCompressionPropertiesKey: {
            AV.AVVideoAverageBitRateKey: bitrate,
            AV.AVVideoMaxKeyFrameIntervalKey: KEYFRAME_INTERVAL,
            AV.AVVideoAllowFrameReorderingKey: False,
            AV.AVVideoProfileLevelKey: AV.AVVideoProfileLevelH264HighAutoLevel,
            AV.AVVideoExpectedSourceFrameRateKey: round(fps),
        },
    }
    writer_input = AV.AVAssetWriterInput.assetWriterInputWithMediaType_outputSettings_(
        AV.AVMediaTypeVideo, settings
    )
    writer_input.setExpectsMediaDataInRealTime_(False)
    writer_input.setTransform_(track.preferredTransform())
    writer.addInput_(writer_input)

    reader.startReading()
    writer.startWriting()
    writer.startSessionAtSourceTime_(CM.kCMTimeZero)

    frames = 0
    while True:
        sample = output.copyNextSampleBuffer()
        if sample is None:
            break
        while not writer_input.isReadyForMoreMediaData():
            time.sleep(0.005)
        if not writer_input.appendSampleBuffer_(sample):
            raise RuntimeError(writer.error())
        frames += 1

    writer_input.markAsFinished()
    writer.finishWritingWithCompletionHandler_(lambda: None)
    while writer.status() == AV.AVAssetWriterStatusWriting:
        time.sleep(0.05)
    if writer.status() != AV.AVAssetWriterStatusCompleted:
        raise RuntimeError(writer.error())
    return frames


def save_frame(src_url, dst_path, fraction):
    asset = AV.AVURLAsset.URLAssetWithURL_options_(src_url, None)
    gen = AV.AVAssetImageGenerator.assetImageGeneratorWithAsset_(asset)
    gen.setRequestedTimeToleranceBefore_(CM.kCMTimeZero)
    gen.setRequestedTimeToleranceAfter_(CM.kCMTimeZero)
    seconds = CM.CMTimeGetSeconds(asset.duration()) * fraction
    image = gen.copyCGImageAtTime_actualTime_error_(
        CM.CMTimeMakeWithSeconds(seconds, 600), None, None
    )[0]
    dest = Quartz.CGImageDestinationCreateWithURL(
        NSURL.fileURLWithPath_(dst_path), "public.jpeg", 1, None
    )
    Quartz.CGImageDestinationAddImage(
        dest, image, {Quartz.kCGImageDestinationLossyCompressionQuality: 0.82}
    )
    Quartz.CGImageDestinationFinalize(dest)


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, out = sys.argv[1], sys.argv[2]
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    src_url = NSURL.fileURLWithPath_(os.path.abspath(src))

    for suffix, w, h, bitrate in RENDITIONS:
        path = f"{out}{suffix}.mp4"
        frames = encode(src_url, path, w, h, bitrate)
        print(f"{path}: {frames} frames, {os.path.getsize(path) / 1e6:.1f} MB")

    save_frame(src_url, f"{out}-poster.jpg", 0)
    save_frame(src_url, f"{out}-still.jpg", STILL_AT)
    print(f"{out}-poster.jpg, {out}-still.jpg")


if __name__ == "__main__":
    main()
