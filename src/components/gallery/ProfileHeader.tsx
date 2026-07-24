import { motion } from 'motion/react';
import { BadgeCheck, Instagram } from 'lucide-react';
import { PROFILE } from '@/data/gallery';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center md:flex-row md:gap-1.5">
      <span className="font-semibold text-foreground tabular-nums">
        {value}
      </span>
      <span className="text-sm text-muted-foreground md:text-base">
        {label}
      </span>
    </div>
  );
}

export default function ProfileHeader() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-14 lg:gap-20"
    >
      {/* Avatar with the IG-style gradient story ring */}
      <motion.div variants={fadeUp} className="shrink-0">
        <div className="rounded-full bg-gradient-to-tr from-amber-500 via-orange-600 to-fuchsia-600 p-[3px] shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <div className="rounded-full bg-background p-[3px]">
            <div className="flex h-24 w-24 flex-col items-center justify-center overflow-hidden rounded-full bg-white md:h-36 md:w-36">
              <img
                src={PROFILE.avatar.mark}
                alt=""
                className="h-10 w-auto object-contain md:h-16"
              />
              <img
                src={PROFILE.avatar.wordmark}
                alt="ViMa Doors logo"
                className="-mt-2 h-6 w-16 object-contain md:-mt-3 md:h-9 md:w-24"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Handle, stats, name, bio */}
      <div className="flex min-w-0 flex-col items-center text-center md:items-start md:text-left">
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-3 md:justify-start md:gap-4"
        >
          <h2 className="!font-sans text-xl font-normal lowercase tracking-normal text-foreground md:text-2xl">
            {PROFILE.handle}
          </h2>
          <BadgeCheck
            size={18}
            className="fill-sky-500 text-white"
            aria-label="Verified"
          />
          <a
            href={PROFILE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Instagram size={14} />
            Follow
          </a>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-5 flex items-center gap-8 md:mt-6 md:gap-10"
        >
          <Stat value={PROFILE.stats.posts} label="posts" />
          <Stat value={PROFILE.stats.followers} label="followers" />
          <Stat value={PROFILE.stats.following} label="following" />
        </motion.div>

        <motion.div variants={fadeUp} className="mt-5 md:mt-6">
          <p className="text-sm font-semibold text-foreground">
            {PROFILE.name}
          </p>
          <div className="mt-1.5 space-y-0.5">
            {PROFILE.bio.map((line) => (
              <p
                key={line}
                className="text-sm leading-relaxed text-foreground/80"
              >
                {line}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
