import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Fragment, useEffect, useRef } from 'react';
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Instagram,
  X,
} from 'lucide-react';
import { GalleryPost, PROFILE } from '@/data/gallery';
import { mediaUrl, posterUrl, MODAL_IMAGE_TRANSFORM } from '@/lib/cloudinary';

/** Render a caption with #hashtags tinted in the brand accent. */
function Caption({ text }: { text: string }) {
  const parts = text.split(/(#[\p{L}\p{N}_]+)/u);
  return (
    <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/85">
      {parts.map((part, i) =>
        part.startsWith('#') ? (
          <span key={i} className="text-primary/80">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </p>
  );
}

function MiniAvatar() {
  return (
    <span className="rounded-full bg-gradient-to-tr from-amber-500 via-orange-600 to-fuchsia-600 p-[2px]">
      <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-white">
        <img
          src={PROFILE.avatar.mark}
          alt=""
          className="h-5 w-auto object-contain"
        />
      </span>
    </span>
  );
}

export default function PostDialog({
  post,
  onClose,
  onPrev,
  onNext,
}: {
  post: GalleryPost | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play with sound on open. Opening the dialog comes from a user click, so
  // there is user activation and browsers permit unmuted autoplay. If a
  // browser still blocks it, fall back to muted playback rather than nothing.
  useEffect(() => {
    if (!post || post.type !== 'video') return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.volume = 1;
    const played = video.play();
    if (played) {
      played.catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    }
  }, [post]);

  return (
    <DialogPrimitive.Root
      open={post !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      {post && (
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />

          <DialogPrimitive.Content
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') onPrev();
              if (e.key === 'ArrowRight') onNext();
            }}
            className="fixed left-1/2 top-1/2 z-50 flex max-h-[92dvh] w-[calc(100vw-1.5rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-background shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 md:grid md:grid-cols-[minmax(0,1.35fr)_minmax(300px,1fr)]"
          >
            <DialogPrimitive.Title className="sr-only">
              Instagram post by @{PROFILE.handle}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              {post.alt}
            </DialogPrimitive.Description>

            {/* ── Media pane ─────────────────────────────────────────── */}
            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black md:flex-auto">
              {post.type === 'video' ? (
                <video
                  key={post.id}
                  ref={videoRef}
                  src={post.src}
                  poster={posterUrl(post.src, 'so_0,f_auto,q_auto,w_1080')}
                  controls
                  playsInline
                  autoPlay
                  loop
                  preload="metadata"
                  className="max-h-[52dvh] w-full object-contain md:max-h-[86dvh]"
                />
              ) : (
                <img
                  key={post.id}
                  src={mediaUrl(post.src, MODAL_IMAGE_TRANSFORM)}
                  alt={post.alt}
                  className="max-h-[52dvh] w-full object-contain md:max-h-[86dvh]"
                />
              )}

              {/* Prev / next (overlay chevrons) */}
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous post"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/90 backdrop-blur-sm transition-all hover:bg-black/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label="Next post"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white/90 backdrop-blur-sm transition-all hover:bg-black/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* ── Caption pane ───────────────────────────────────────── */}
            <div className="flex min-h-0 shrink-0 flex-col md:max-h-[86dvh]">
              {/* Header row */}
              <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
                <MiniAvatar />
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-foreground">
                    {PROFILE.handle}
                  </span>
                  <BadgeCheck
                    size={14}
                    className="fill-sky-500 text-white"
                    aria-label="Verified"
                  />
                </div>
                <DialogPrimitive.Close
                  aria-label="Close"
                  className="ml-auto rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <X size={18} />
                </DialogPrimitive.Close>
              </div>

              {/* Caption */}
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                <Caption text={post.caption} />
              </div>

              {/* Footer link */}
              <div className="border-t border-border px-4 py-3.5">
                <a
                  href={PROFILE.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:text-primary/80"
                >
                  <Instagram size={14} />
                  View on Instagram
                </a>
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      )}
    </DialogPrimitive.Root>
  );
}
