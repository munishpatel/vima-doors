import { useMemo, useState } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { Instagram } from 'lucide-react';
import { POSTS, PROFILE } from '@/data/gallery';
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

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-20 md:py-28"
        style={{ backgroundColor: '#1a0f08' }}
      >
        <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[60rem] -translate-x-1/2 rounded-full bg-amber-500/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-fuchsia-500/[0.05] blur-3xl" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative container mx-auto px-6 lg:px-10 text-center"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-amber-300/90"
          >
            Follow Our Work
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-heading text-4xl leading-[1.08] tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Craftsmanship,
            <br />
            Straight From Our Feed.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl leading-relaxed text-stone-300"
          >
            Real doors, real installs, real workshop moments — browse our latest
            posts from Instagram and see the craft up close.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <a
              href={PROFILE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-sm bg-gradient-to-tr from-amber-500 via-orange-600 to-fuchsia-600 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_30px_rgba(217,70,140,0.25)] transition-transform duration-200 hover:scale-[1.03]"
            >
              <Instagram size={15} />@{PROFILE.handle}
            </a>
          </motion.div>
        </motion.div>
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
