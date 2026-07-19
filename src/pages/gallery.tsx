import { useMemo, useState } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { Clapperboard, Instagram } from 'lucide-react';
import { POSTS, PROFILE } from '@/data/gallery';
import { mediaUrl, posterUrl } from '@/lib/cloudinary';
import ProfileHeader from '@/components/gallery/ProfileHeader';
import HighlightsRow from '@/components/gallery/HighlightsRow';
import TabBar, { GalleryTab } from '@/components/gallery/TabBar';
import PostGrid from '@/components/gallery/PostGrid';
import PostDialog from '@/components/gallery/PostDialog';

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ------------------------------------------------------------------ */
/*  Hero collage — real posts, tilted like scattered prints            */
/* ------------------------------------------------------------------ */

const COLLAGE_TRANSFORM = 'so_0,f_auto,q_auto,c_fill,ar_4:5,w_480';

const COLLAGE: { postIndex: number; position: string; rotate: number }[] = [
  { postIndex: 2, position: 'left-0 top-10 w-[52%] z-10', rotate: -7 },
  { postIndex: 0, position: 'right-0 top-0 w-[47%] z-10', rotate: 5 },
  { postIndex: 5, position: 'bottom-0 left-[23%] w-[50%] z-20', rotate: 2 },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function GalleryPage() {
  const [tab, setTab] = useState<GalleryTab>('posts');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const visiblePosts = useMemo(() => {
    if (tab === 'reels') return POSTS.filter((p) => p.type === 'video');
    if (tab === 'tagged') return [];
    return POSTS;
  }, [tab]);

  const activePost =
    activeIndex === null ? null : (visiblePosts[activeIndex] ?? null);

  const changeTab = (next: GalleryTab) => {
    setTab(next);
    setActiveIndex(null);
  };

  const showPrev = () =>
    setActiveIndex((i) =>
      i === null ? null : (i - 1 + visiblePosts.length) % visiblePosts.length,
    );
  const showNext = () =>
    setActiveIndex((i) => (i === null ? null : (i + 1) % visiblePosts.length));

  return (
    <MotionConfig reducedMotion="user">
      <title>Gallery — Vima Doors</title>
      <meta
        name="description"
        content="Browse the Vima Doors gallery — real posts from our Instagram: teak wood doors, laminate doors, pooja doors, and behind-the-scenes craftsmanship from our Hyderabad workshop."
      />

      {/* ─── HERO (light + floating collage) ─────────────────────────── */}
      <section className="relative overflow-hidden bg-background py-16 md:py-24">
        <div className="pointer-events-none absolute -top-28 -right-24 h-96 w-96 rounded-full bg-amber-400/[0.16] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-28 h-96 w-96 rounded-full bg-fuchsia-400/[0.08] blur-3xl" />

        <div className="relative container mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-10">
            {/* Copy */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              <motion.p
                variants={fadeUp}
                className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary"
              >
                Follow Our Work
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="font-heading text-4xl leading-[1.08] tracking-tight text-foreground md:text-5xl lg:text-6xl"
              >
                Craftsmanship,
                <br />
                Straight From Our Feed.
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="mx-auto mt-6 max-w-xl leading-relaxed text-muted-foreground lg:mx-0"
              >
                Real doors, real installs, real workshop moments — browse our
                latest posts from Instagram and see the craft up close.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8">
                <a
                  href={PROFILE.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-sm bg-gradient-to-tr from-amber-500 via-orange-600 to-fuchsia-600 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_30px_rgba(217,70,140,0.3)] transition-transform duration-200 hover:scale-[1.03]"
                >
                  <Instagram size={15} />@{PROFILE.handle}
                </a>
              </motion.div>
            </motion.div>

            {/* Collage — tap a print to open that post */}
            <div className="relative mx-auto h-[330px] w-full max-w-[420px] sm:h-[390px] lg:h-[430px] lg:max-w-[460px]">
              {COLLAGE.map(({ postIndex, position, rotate }, i) => {
                const post = POSTS[postIndex];
                const thumb =
                  post.type === 'video'
                    ? posterUrl(post.src, COLLAGE_TRANSFORM)
                    : mediaUrl(post.src, COLLAGE_TRANSFORM);
                return (
                  <motion.button
                    key={post.id}
                    type="button"
                    onClick={() => {
                      setTab('posts');
                      setActiveIndex(postIndex);
                    }}
                    aria-label={`Open post: ${post.alt}`}
                    initial={{ opacity: 0, y: 40, rotate: rotate * 2 }}
                    animate={{ opacity: 1, y: 0, rotate }}
                    whileHover={{ y: -8, scale: 1.04, rotate: rotate / 2 }}
                    transition={{
                      type: 'spring',
                      stiffness: 180,
                      damping: 20,
                      delay: 0.15 + i * 0.13,
                    }}
                    className={`absolute ${position} rounded-2xl bg-white p-2 pb-3 shadow-[0_18px_44px_rgba(26,15,8,0.20)] hover:z-30 focus-visible:z-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`}
                  >
                    <span className="relative block overflow-hidden rounded-xl">
                      <img
                        src={thumb}
                        alt={post.alt}
                        className="aspect-[4/5] w-full object-cover"
                      />
                      {post.type === 'video' && (
                        <span className="absolute right-2 top-2 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                          <Clapperboard size={14} className="fill-white/20" />
                        </span>
                      )}
                    </span>
                  </motion.button>
                );
              })}

              {/* Floating handle chip */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5, ease: 'easeOut' }}
                className="absolute -bottom-4 left-0 z-30 flex items-center gap-2 rounded-full bg-white py-2 pl-2.5 pr-4 shadow-[0_10px_30px_rgba(26,15,8,0.18)]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-orange-600 to-fuchsia-600 text-white">
                  <Instagram size={13} />
                </span>
                <span className="text-xs font-semibold text-foreground">
                  @{PROFILE.handle}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INSTAGRAM PROFILE ────────────────────────────────────────── */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto max-w-[960px] px-4 md:px-6">
          <ProfileHeader />

          <div className="mt-10 md:mt-14">
            <HighlightsRow />
          </div>

          <div className="mt-8 md:mt-12">
            <TabBar active={tab} onChange={changeTab} />
            <PostGrid posts={visiblePosts} onOpen={setActiveIndex} />
          </div>
        </div>
      </section>

      <PostDialog
        post={activePost}
        onClose={() => setActiveIndex(null)}
        onPrev={showPrev}
        onNext={showNext}
      />
    </MotionConfig>
  );
}
