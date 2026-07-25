import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Highlight, PROFILE } from '@/data/gallery';
import { mediaUrl } from '@/lib/cloudinary';

const STORY_DURATION = 5000; // ms per story, like Instagram
const STORY_TRANSFORM = 'f_auto,q_auto,c_limit,h_1600';

function MiniAvatar() {
  return (
    <span className="rounded-full bg-gradient-to-tr from-amber-500 via-orange-600 to-fuchsia-600 p-[2px]">
      <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-white">
        <img
          src={PROFILE.avatar.mark}
          alt=""
          className="h-5 w-auto object-contain"
        />
      </span>
    </span>
  );
}

export default function StoryViewer({
  highlight,
  onClose,
}: {
  highlight: Highlight | null;
  onClose: () => void;
}) {
  const stories = highlight?.stories ?? [];
  const count = stories.length;

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1 for the current story
  const [paused, setPaused] = useState(false);

  const elapsedRef = useRef(0);
  const startRef = useRef(0);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heldRef = useRef(false);

  // Reset to the first story whenever a highlight is opened.
  useEffect(() => {
    if (!highlight) return;
    setIndex(0);
    setPaused(false);
  }, [highlight]);

  // Restart the timer bar on every story change.
  useEffect(() => {
    setProgress(0);
    elapsedRef.current = 0;
  }, [index]);

  const goNext = useCallback(() => {
    if (index + 1 >= count) onClose();
    else setIndex(index + 1);
  }, [index, count, onClose]);

  const goPrev = useCallback(() => {
    if (index > 0) setIndex(index - 1);
  }, [index]);

  // Auto-advance timer (rAF so pause/resume keeps elapsed time).
  useEffect(() => {
    if (!highlight || paused) return;
    let frame = 0;
    startRef.current = performance.now() - elapsedRef.current;
    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      elapsedRef.current = elapsed;
      const p = Math.min(1, elapsed / STORY_DURATION);
      setProgress(p);
      if (p >= 1) {
        goNext();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [highlight, paused, index, goNext]);

  // Preload the next story image for a seamless advance.
  useEffect(() => {
    if (!highlight || index + 1 >= count) return;
    const img = new Image();
    img.src = mediaUrl(stories[index + 1], STORY_TRANSFORM);
  }, [highlight, index, count, stories]);

  // Press-and-hold anywhere pauses; a quick tap navigates.
  const handlePointerDown = () => {
    heldRef.current = false;
    holdTimer.current = setTimeout(() => {
      heldRef.current = true;
      setPaused(true);
    }, 220);
  };
  const handlePointerUp = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    setPaused(false);
  };
  const navGuard = (fn: () => void) => () => {
    if (heldRef.current) {
      heldRef.current = false;
      return; // was a hold-to-pause, not a tap
    }
    fn();
  };

  return (
    <DialogPrimitive.Root
      open={highlight !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      {highlight && (
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />

          <DialogPrimitive.Content
            aria-describedby={undefined}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') goPrev();
              if (e.key === 'ArrowRight') goNext();
            }}
            className="fixed inset-0 z-50 flex items-center justify-center outline-none"
          >
            <DialogPrimitive.Title className="sr-only">
              {highlight.label}, story highlights by @{PROFILE.handle}
            </DialogPrimitive.Title>

            {/* Click the dark surround to close */}
            <DialogPrimitive.Close
              aria-label="Close stories"
              className="absolute inset-0 h-full w-full cursor-default"
              tabIndex={-1}
            />

            {/* Story card */}
            <div
              className="relative flex aspect-[9/16] max-h-[100dvh] w-full max-w-[440px] select-none flex-col overflow-hidden bg-black shadow-2xl sm:max-h-[92dvh] sm:rounded-xl"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {/* Segmented progress bars */}
              <div className="absolute inset-x-0 top-0 z-20 flex gap-1 px-3 pt-3">
                {stories.map((_, i) => (
                  <span
                    key={i}
                    className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/35"
                  >
                    <span
                      className="block h-full rounded-full bg-white"
                      style={{
                        width:
                          i < index
                            ? '100%'
                            : i === index
                              ? `${progress * 100}%`
                              : '0%',
                        transition: i === index ? 'none' : undefined,
                      }}
                    />
                  </span>
                ))}
              </div>

              {/* Header */}
              <div className="absolute inset-x-0 top-0 z-20 flex items-center gap-3 px-4 pt-7">
                <MiniAvatar />
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-sm font-semibold text-white">
                    {PROFILE.handle}
                  </span>
                  <span className="truncate text-xs text-white/70">
                    {highlight.label}
                  </span>
                </div>
                <DialogPrimitive.Close
                  aria-label="Close"
                  className="relative z-30 ml-auto rounded-full p-1.5 text-white/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <X size={22} />
                </DialogPrimitive.Close>
              </div>

              {/* The story image */}
              <img
                key={stories[index]}
                src={mediaUrl(stories[index], STORY_TRANSFORM)}
                alt={`${highlight.label}, ${index + 1} of ${count}`}
                className="absolute inset-0 h-full w-full object-contain"
                draggable={false}
              />

              {/* Tap zones: left = previous, right = next */}
              <button
                type="button"
                aria-label="Previous"
                onClick={navGuard(goPrev)}
                className="absolute inset-y-0 left-0 z-10 w-1/3 cursor-default focus:outline-none"
              />
              <button
                type="button"
                aria-label="Next"
                onClick={navGuard(goNext)}
                className="absolute inset-y-0 right-0 z-10 w-2/3 cursor-default focus:outline-none"
              />

              {/* Desktop arrows outside the tap zones for discoverability */}
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous story"
                disabled={index === 0}
                className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/15 p-1.5 text-white backdrop-blur-sm transition hover:bg-white/25 disabled:opacity-0 sm:block"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next story"
                className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/15 p-1.5 text-white backdrop-blur-sm transition hover:bg-white/25 sm:block"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      )}
    </DialogPrimitive.Root>
  );
}
