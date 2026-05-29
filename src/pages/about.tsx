import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function AboutPage() {
  return (
    <>
      <title>About Us — Vima Doors</title>
      <meta
        name="description"
        content="Three generations of craftsmanship. Learn the story behind Vima Doors and our commitment to quality, performance, and security."
      />

      {/* ─── LEGACY STRIP ──────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 overflow-hidden" style={{ backgroundColor: '#1a0f08' }}>
        <div className="container mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Oversized "3" anchor */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-center gap-8"
            >
              <span
                className="font-heading leading-none select-none"
                style={{
                  fontSize: 'clamp(10rem, 20vw, 18rem)',
                  color: 'rgba(255,255,255,0.06)',
                  lineHeight: 1,
                }}
              >
                3
              </span>
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-stone-500 mb-3 font-medium">
                  Generations
                </p>
                <p className="font-heading text-3xl md:text-4xl text-stone-100 leading-snug">
                  One Standard<br />of Excellence.
                </p>
              </div>
            </motion.div>

            {/* Story text */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.p variants={fadeUp} className="text-stone-300 leading-relaxed mb-5">
                What started as a small family workshop has grown into one of the region's
                most trusted door manufacturers — but our values have never changed.
                Every door we build carries the same commitment to craft that our
                grandfather brought to his first installation.
              </motion.p>
              <motion.p variants={fadeUp} className="text-stone-400 leading-relaxed mb-10">
                Three generations of expertise mean we understand not just how to build
                a door, but how a door should feel — the weight of it, the sound of it
                closing, the way it frames a room. That knowledge can't be manufactured.
                It's inherited.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-stone-300 border-b border-stone-600 pb-0.5 hover:text-stone-100 hover:border-stone-300 hover:gap-4 transition-all duration-200"
                >
                  Get in Touch
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
