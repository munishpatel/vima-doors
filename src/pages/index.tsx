import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';

// ─── Animation Variants ───────────────────────────────────────────────────────
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

// ─── Testimonials Data ────────────────────────────────────────────────────────
const testimonials = [
  {
    quote:
      "Vima Doors transformed our home's entryway. The craftsmanship is extraordinary — every detail speaks to decades of expertise.",
    name: 'Ramu Vaddaji',
    project: 'Full Home Renovation, BHEL',
  },
  {
    quote:
      "We've used Vima for three commercial projects now. Consistent quality, on-time delivery, and the prefinished product saves us days on site.",
    name: 'Santosh Kumar',
    project: 'General Contractor, Tellapur',
  },
  {
    quote:
      'The exterior door they custom-built for us is a showstopper. Neighbors stop to ask about it. Worth every penny.',
    name: 'Bharat Patel',
    project: 'Custom Build, Beeramguda',
  },
];

export default function HomePage() {
  return (
    <>
      <title>Vima Doors — Doors That Define a Home</title>
      <meta
        name="description"
        content="3rd-generation family business crafting prefinished interior and exterior doors. Premium quality, security, and design tailored to your home."
      />

      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[640px] flex items-end overflow-hidden">
        {/* Background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover scale-105"
          src="/assets/herosection_video.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Top gradient — darkens behind header so white text/logo pops */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        {/* Side + bottom gradients for hero text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-gray-900/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />

        {/* Hero content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-10 pb-20 md:pb-28">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs tracking-[0.3em] uppercase text-stone-300 mb-5 font-medium"
            >
              3rd Generation Family Craftsmanship
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="font-heading text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight mb-7"
            >
              The Doors you Desire<br />Defining a Home.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-stone-300 text-lg leading-relaxed mb-10 max-w-md"
            >
              Prefinished interior and exterior doors crafted to the highest standards
              of quality, performance, and security — tailored to your taste.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm tracking-widest uppercase px-7 py-3.5 hover:bg-primary/90 transition-colors duration-200"
              >
                Explore Doors
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-stone-400 text-stone-200 text-sm tracking-widest uppercase px-7 py-3.5 hover:border-white hover:text-white transition-colors duration-200"
              >
                Request a Quote
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-stone-400"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── INTERIOR DOORS ────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-background overflow-hidden">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative aspect-[4/5] overflow-hidden group"
            >
              <img
                src="/assets/interior-doors.webp"
                alt="Interior wooden door with warm wood grain"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-950/30 to-transparent" />
            </motion.div>

            {/* Text */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="md:pl-6"
            >
              <motion.p variants={fadeUp} className="text-xs tracking-[0.3em] uppercase text-primary mb-4 font-medium">
                Interior Collection
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-heading text-4xl md:text-5xl text-foreground leading-tight mb-6">
                Warmth in<br />Every Room
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed mb-5">
                Our interior doors are more than transitions between spaces — they're
                architectural statements. Crafted from premium hardwoods and finished
                to perfection, each door brings warmth, character, and lasting beauty
                to your home.
              </motion.p>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed mb-10">
                Available in a wide range of styles, profiles, and prefinished tones
                to complement any interior design vision.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-primary border-b border-primary pb-0.5 hover:gap-4 transition-all duration-200"
                >
                  View Interior Doors
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── EXTERIOR DOORS ────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-muted overflow-hidden">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text — left */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="md:pr-6 order-2 md:order-1"
            >
              <motion.p variants={fadeUp} className="text-xs tracking-[0.3em] uppercase text-primary mb-4 font-medium">
                Exterior Collection
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-heading text-4xl md:text-5xl text-foreground leading-tight mb-6">
                First Impressions<br />Built to Last
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed mb-5">
                Your front door is the face of your home. Our exterior doors combine
                striking design with engineered performance — weather-resistant,
                secure, and built to endure decades of use without compromise.
              </motion.p>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed mb-10">
                From classic solid wood to modern flush designs, every exterior door
                is prefinished and ready to install — saving time without sacrificing quality.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-primary border-b border-primary pb-0.5 hover:gap-4 transition-all duration-200"
                >
                  View Exterior Doors
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </motion.div>

            {/* Image — right */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative aspect-[4/5] overflow-hidden group order-1 md:order-2"
            >
              <img
                src="/assets/exterior-doors.webp"
                alt="Elegant exterior front door on a modern home"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
          </div>
        </div>
      </section>

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
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-stone-300 border-b border-stone-600 pb-0.5 hover:text-stone-100 hover:border-stone-300 hover:gap-4 transition-all duration-200"
                >
                  Our Story
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-14"
          >
            <motion.p variants={fadeUp} className="text-xs tracking-[0.3em] uppercase text-primary mb-3 font-medium">
              Client Stories
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-heading text-4xl md:text-5xl text-foreground">
              What Our Clients Say
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-muted border border-border p-8 flex flex-col gap-6 cursor-default"
              >
                <p className="text-foreground/80 leading-relaxed text-sm italic flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-border pt-5">
                  <p className="font-medium text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 tracking-wide">{t.project}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Wood texture background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/assets/cta-texture.webp')` }}
        />
        <div className="absolute inset-0 bg-gray-950/75" />

        <div className="relative z-10 container mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-xl"
            >
              <motion.p variants={fadeUp} className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-4 font-medium">
                Start Your Project
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-heading text-4xl md:text-5xl text-white leading-tight">
                Ready to Find<br />Your Perfect Door?
              </motion.h2>
              <motion.p variants={fadeUp} className="text-stone-300 mt-5 leading-relaxed">
                Tell us about your project and we'll help you find the right door —
                tailored to your style, space, and budget.
              </motion.p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="shrink-0"
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground text-sm tracking-widest uppercase px-8 py-4 hover:bg-primary/90 transition-colors duration-200"
              >
                Request a Free Quote
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
