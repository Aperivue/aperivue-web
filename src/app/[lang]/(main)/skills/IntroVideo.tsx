"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

const VIDEO_ID = "MclQ_RIofpE";

/* Minimal YouTube IFrame API typings (we only use what we need). */
interface YTPlayer {
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}
interface YTStateEvent {
  data: number;
}
declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        opts: { events: { onStateChange: (e: YTStateEvent) => void } },
      ) => YTPlayer;
      PlayerState: { PLAYING: number; ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

/** Load the YT IFrame API once and resolve when ready. */
function loadYouTubeApi(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT?.Player) return resolve();
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    if (!document.getElementById("yt-iframe-api")) {
      const s = document.createElement("script");
      s.id = "yt-iframe-api";
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    }
  });
}

/**
 * Responsive 16:9 intro-video embed that reports engagement to GA4.
 * Fires: video_play (first play), video_progress (25/50/75%), video_complete.
 * Pageviews are already tracked by the root-layout gtag config.
 */
export function IntroVideo({ location = "skills" }: { location?: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let player: YTPlayer | null = null;
    let interval: number | undefined;
    let cancelled = false;
    let played = false;
    const milestones = new Set<number>();

    loadYouTubeApi().then(() => {
      if (cancelled || !iframeRef.current || !window.YT) return;
      player = new window.YT.Player(iframeRef.current, {
        events: {
          onStateChange: (e) => {
            const YT = window.YT;
            if (!YT || !player) return;
            if (e.data === YT.PlayerState.PLAYING) {
              if (!played) {
                played = true;
                trackEvent("video_play", { video_id: VIDEO_ID, location });
              }
              if (interval === undefined) {
                interval = window.setInterval(() => {
                  if (!player) return;
                  const dur = player.getDuration();
                  if (!dur) return;
                  const pct = (player.getCurrentTime() / dur) * 100;
                  for (const m of [25, 50, 75]) {
                    if (pct >= m && !milestones.has(m)) {
                      milestones.add(m);
                      trackEvent("video_progress", {
                        video_id: VIDEO_ID,
                        location,
                        percent: m,
                      });
                    }
                  }
                }, 1000);
              }
            } else if (e.data === YT.PlayerState.ENDED && !milestones.has(100)) {
              milestones.add(100);
              trackEvent("video_complete", { video_id: VIDEO_ID, location });
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (interval !== undefined) window.clearInterval(interval);
      player?.destroy?.();
    };
  }, [location]);

  return (
    <div className="mx-auto mt-6 max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="relative h-0 w-full pb-[56.25%]">
        <iframe
          ref={iframeRef}
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?enablejsapi=1&rel=0&modestbranding=1`}
          title="MedSci Skills — 2-minute intro"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
