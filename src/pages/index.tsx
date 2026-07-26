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

// ─── Trust Badges ─────────────────────────────────────────────────────────────
const GREEN_FILTER = 'brightness(0) saturate(100%) invert(37%) sepia(52%) saturate(530%) hue-rotate(101deg) brightness(90%)';

const TRUST_BADGES = [
  { src: '/assets/strip/trust.png',      label: 'Trust of\n3 Decades'       },
  { src: '/assets/strip/creativity.png', label: 'Endless Design\nInnovation' },
  { src: '/assets/strip/shield-checkmark.png', label: 'Zero Error\nProducts' },
  { src: '/assets/strip/people-connection.png', label: 'Widest Dealer\nNetwork' },
  { src: '/assets/strip/quality.png',    label: 'Premium\nQuality'           },
  { src: '/assets/strip/precision.png',  label: 'Precision\nCrafting'        },
  { src: '/assets/title-logo.png',       label: 'Elegant\nDesigns' },
];

// ─── Door Showcase Data ───────────────────────────────────────────────────────
const DOOR_SHOWCASE = [
  { name: 'Membrane Door',         src: 'https://res.cloudinary.com/vimadoors/image/upload/v1785105090/MEMBRANE-01_bgnpg3.webp' },
  { name: 'Teak Door',             src: 'https://res.cloudinary.com/vimadoors/image/upload/v1785105090/TEAK-01_btvt99.webp' },
  { name: 'Laminate Door',         src: 'https://res.cloudinary.com/vimadoors/image/upload/v1785105090/LAMINATE-02_nvdyk4.png' },
  { name: 'Veneer Door',           src: 'https://res.cloudinary.com/vimadoors/image/upload/v1785105090/VENEER-01_bo3ahd.webp' },
  { name: 'Pooja Door',            src: 'https://res.cloudinary.com/vimadoors/image/upload/v1785105090/PPOJA-01_lolxew.webp' },
  { name: 'Premium Door',          src: 'https://res.cloudinary.com/vimadoors/image/upload/v1785105089/DOOR-01_zqybcy.png' },
  { name: 'Goldpatti Door',        src: 'https://res.cloudinary.com/vimadoors/image/upload/v1785105089/GOLDPATTI-01_fu5r62.png' },
  { name: 'Vintage Laminate Door', src: 'https://res.cloudinary.com/vimadoors/image/upload/v1785105090/LAMINATE-01_rp03mn.png' },
  { name: 'Indian Teak Door',      src: 'https://res.cloudinary.com/vimadoors/image/upload/v1785105089/INDTEAK-01_ac4ngr.webp' },
  { name: 'Designer Door',         src: 'https://res.cloudinary.com/vimadoors/image/upload/v1785105089/DESIGN-01_jutrwm.png' },
];

// Interleave so every track carries a varied mix of styles rather than
// grouping similar finishes together.
// Desktop: three vertical columns. Mobile: two horizontal rows.
const DOOR_COLS = [0, 1, 2].map((c) => DOOR_SHOWCASE.filter((_, i) => i % 3 === c));
const DOOR_ROWS = [0, 1].map((r) => DOOR_SHOWCASE.filter((_, i) => i % 2 === r));

// ─── Testimonials Data ────────────────────────────────────────────────────────
const testimonials = [
  {
    quote:
      "Vima Doors transformed our home's entryway. The craftsmanship is extraordinary. Every detail speaks to decades of expertise.",
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

// ─── Door Showcase Card ───────────────────────────────────────────────────────
function DoorCard({
  name,
  src,
  variant,
  ariaHidden = false,
}: {
  name: string;
  src: string;
  variant: 'v' | 'h';
  ariaHidden?: boolean;
}) {
  const isVertical = variant === 'v';
  return (
    <figure
      aria-hidden={ariaHidden}
      className={`group/card relative m-0 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-[0_14px_34px_rgba(0,0,0,0.12)] ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-[0_22px_48px_rgba(0,0,0,0.22)] ${
        isVertical ? 'mb-5 w-full' : 'mr-4 h-64 sm:h-80'
      }`}
    >
      <img
        src={src}
        alt={ariaHidden ? '' : name}
        loading="lazy"
        decoding="async"
        className={`block ${isVertical ? 'h-auto w-full' : 'h-full w-auto'}`}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-3">
        <span className="text-xs md:text-sm font-medium tracking-wide text-white drop-shadow-sm">
          {name}
        </span>
      </figcaption>
    </figure>
  );
}

export default function HomePage() {
  return (
    <>
      <title>Vima Doors - Doors That Define a Home</title>
      <meta
        name="description"
        content="3rd-generation family business crafting prefinished interior and exterior doors. Premium quality, security, and design tailored to your home."
      />

      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="relative flex items-end overflow-hidden -mt-6 md:mt-0 h-[calc(100svh-96px)] md:h-[calc(100svh-120px)] min-h-[600px]"
      >
        {/* Background video */}
        <video
          ref={(el) => {
            if (el) el.playbackRate = 0.75;
          }}
          className="absolute inset-0 w-full h-full object-cover object-[center_35%]"
          src="/assets/herosection_video.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Top gradient, darkens behind header so logo pops */}
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
<motion.h1
              variants={fadeUp}
              className="font-heading text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight mb-7"
            >
              The Doors you Desire<br />Defining a Home.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-stone-300 text-lg leading-relaxed mb-10 max-w-md text-justify"
            >
              Premium interior and exterior doors crafted to the highest standards
              of quality, performance, and security, tailored to your taste.
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
                Contact Us
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

      {/* ─── WELCOME ───────────────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-muted/50 to-muted overflow-hidden">
        {/* Decorative ambient glows, more layered and modern */}
        <div className="pointer-events-none absolute -top-28 -right-28 h-96 w-96 rounded-full bg-primary/[0.08] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/[0.05] blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/[0.02] blur-3xl" />

        <div className="relative container mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text (left) */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.p
                variants={fadeUp}
                className="text-xs tracking-[0.3em] uppercase text-primary mb-5 font-semibold"
              >
                India&rsquo;s Leading Door Manufacturer &amp; Supplier
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.08] tracking-tight"
              >
                Welcome to <span className="text-primary">Vima Doors</span>
              </motion.h2>
              <motion.div
                variants={fadeUp}
                className="mt-7 mb-8 h-px w-20 bg-gradient-to-r from-primary/70 to-transparent"
              />

              <motion.p
                variants={fadeUp}
                className="text-lg text-foreground/80 leading-relaxed mb-6 text-justify"
              >
                At Vima Doors, we carry forward three generations of craftsmanship to
                bring you doors that are built to impress and designed to last. As one of
                India&rsquo;s trusted door manufacturers and suppliers, we specialise in
                premium prefinished interior and exterior doors, delivering quality,
                security, and elegance that truly defines a home.
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="hidden md:block text-muted-foreground leading-relaxed mb-6 text-justify"
              >
                Whether you are furnishing a new home, renovating a space, or sourcing
                for a commercial project, we have the right door for you. From warm,
                character-rich interior doors to weather-resistant exterior doors that
                make a bold first impression, our collections are crafted to suit every
                style, space, and budget.
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="hidden md:block text-muted-foreground leading-relaxed text-justify"
              >
                Every door that leaves our workshop is prefinished to the highest
                standard, saving you time on-site without compromising on finish. Over
                the years, Vima Doors has earned the trust and loyalty of homeowners,
                architects, and contractors alike, who return to us time and again for
                our consistent quality and honest craftsmanship. We work closely with
                each customer to deliver tailored solutions, backed by the expertise of
                a family that has lived and breathed door manufacturing for over three
                decades.
              </motion.p>
            </motion.div>

            {/* Image (right): hero image + offset detail card */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative mx-auto w-full max-w-md lg:max-w-none pr-10 pb-12 lg:pr-16 lg:pb-16"
            >
              {/* Main image */}
              <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                <img
                  src="/assets/welcome_door.jpg"
                  alt="Vima Doors prefinished interior door"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                <span className="absolute bottom-5 left-5 bg-background/85 backdrop-blur-sm text-[10px] tracking-[0.2em] uppercase text-foreground/70 px-3 py-1.5 rounded-md">
                  Hero Door
                </span>
              </div>

              {/* Offset detail card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                className="absolute bottom-0 right-0 w-2/5 aspect-[3/4] overflow-hidden rounded-xl border-[6px] border-background shadow-[0_16px_40px_rgba(0,0,0,0.22)]"
              >
                <img
                  src="/assets/welcome_door.jpg"
                  alt="Close-up of carved fan detail with brass medallion"
                  className="h-full w-full object-cover object-[50%_42%] scale-[2.8]"
                />
                <span className="absolute bottom-3 left-3 bg-background/85 backdrop-blur-sm text-[9px] tracking-[0.18em] uppercase text-foreground/70 px-2.5 py-1 rounded">
                  Detail / Grain
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TRUST STRIP ───────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-[#f0f7f0]">
        {/* Mobile: horizontal scroll. Desktop: 7-col grid */}
        <div className="md:hidden overflow-hidden">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
          <div
            className="flex gap-10 w-max"
            style={{ animation: 'marquee 18s linear infinite' }}
          >
            {[...TRUST_BADGES, ...TRUST_BADGES].map((badge, i) => (
              <div
                key={`${badge.label}-${i}`}
                className="flex flex-col items-center gap-3 w-24"
              >
                <img
                  src={badge.src}
                  alt={badge.label}
                  className="h-10 w-10 object-contain"
                  style={{ filter: GREEN_FILTER }}
                />
                <p className="text-center text-[10px] tracking-[0.15em] uppercase text-foreground/80 font-semibold leading-relaxed whitespace-pre-line">
                  {badge.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:block container mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-4 lg:grid-cols-7 gap-y-10 gap-x-6">
            {TRUST_BADGES.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.07 }}
                className="group flex flex-col items-center gap-4"
              >
                <img
                  src={badge.src}
                  alt={badge.label}
                  className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-110"
                  style={{ filter: GREEN_FILTER }}
                />
                <p className="text-center text-[11px] md:text-xs tracking-[0.18em] uppercase text-foreground/80 font-semibold leading-relaxed whitespace-pre-line">
                  {badge.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DOOR SHOWCASE (dual-direction moving gallery) ─────────────────── */}
      <section className="relative overflow-hidden bg-muted py-20 md:py-28">
        {/* Ambient glows to keep the wide background from reading as dead space.
            Warm amber echoes the wood tones, green ties back to the brand mark. */}
        <div className="pointer-events-none absolute -right-40 top-1/4 h-[420px] w-[420px] rounded-full bg-[hsl(38_92%_58%)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-[hsl(152_45%_42%)]/[0.14] blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 -top-16 h-72 w-72 rounded-full bg-[hsl(19_60%_50%)]/[0.10] blur-3xl" />

        <div className="relative container mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-14">
            {/* Text (right). Kept first in the DOM so the heading is read before
                the decorative gallery; reordered visually at lg. */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center lg:order-2 lg:text-left"
            >
              <motion.p variants={fadeUp} className="text-xs tracking-[0.3em] uppercase text-primary mb-4 font-medium">
                Our Collections
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.08] tracking-tight">
                A Door for<br />Every Home
              </motion.h2>
              <motion.div
                variants={fadeUp}
                className="mx-auto lg:mx-0 mt-7 mb-7 h-px w-20 bg-gradient-to-r from-primary/70 to-transparent"
              />
              <motion.p variants={fadeUp} className="mx-auto lg:mx-0 max-w-md text-muted-foreground leading-relaxed">
                From timeless teak to designer laminates, every collection is
                prefinished in our Hyderabad workshop and built to last. Ten
                signature ranges, endless ways to make an entrance.
              </motion.p>

              {/* Collection names double as a quick scan of the range */}
              <motion.ul
                variants={fadeUp}
                className="mt-8 flex flex-wrap justify-center lg:justify-start gap-2"
              >
                {DOOR_SHOWCASE.map((d) => (
                  <li
                    key={d.name}
                    className="rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1.5 text-[11px] tracking-wide text-foreground/70"
                  >
                    {d.name.replace(' Door', '')}
                  </li>
                ))}
              </motion.ul>

              <motion.div variants={fadeUp} className="mt-9">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-primary border-b border-primary pb-0.5 hover:gap-4 transition-all duration-200"
                >
                  View All Doors
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </motion.div>

            {/* Doors (left): three vertical columns, alternating direction */}
            <div className="door-gallery-v hidden h-[720px] grid-cols-3 gap-5 lg:order-1 lg:grid xl:h-[800px]">
              {DOOR_COLS.map((col, c) => (
                <div key={`col-${c}`} className="overflow-hidden">
                  <div
                    className={`door-track flex flex-col ${
                      c === 1 ? 'door-track--down' : 'door-track--up'
                    }`}
                    style={{ animationDuration: `${46 + c * 6}s` }}
                  >
                    {[...col, ...col].map((d, i) => (
                      <DoorCard
                        key={`v-${c}-${i}`}
                        {...d}
                        variant="v"
                        ariaHidden={i >= col.length}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: two horizontal rows moving in opposite directions */}
        <div className="door-gallery-h mt-12 flex flex-col gap-4 lg:hidden">
          {DOOR_ROWS.map((row, r) => (
            <div key={`row-${r}`} className="overflow-hidden">
              <div
                className={`door-track flex w-max ${
                  r === 0 ? 'door-track--left' : 'door-track--right'
                }`}
              >
                {[...row, ...row].map((d, i) => (
                  <DoorCard
                    key={`h-${r}-${i}`}
                    {...d}
                    variant="h"
                    ariaHidden={i >= row.length}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <style>{`
          .door-track { will-change: transform; }
          .door-track--up    { animation: doorUp 48s linear infinite; }
          .door-track--down  { animation: doorDown 48s linear infinite; }
          .door-track--left  { animation: doorLeft 40s linear infinite; }
          .door-track--right { animation: doorRight 40s linear infinite; }
          @keyframes doorUp    { from { transform: translateY(0); }    to { transform: translateY(-50%); } }
          @keyframes doorDown  { from { transform: translateY(-50%); } to { transform: translateY(0); } }
          @keyframes doorLeft  { from { transform: translateX(0); }    to { transform: translateX(-50%); } }
          @keyframes doorRight { from { transform: translateX(-50%); } to { transform: translateX(0); } }
          .door-gallery-v {
            -webkit-mask-image: linear-gradient(to bottom, transparent, #000 9%, #000 91%, transparent);
            mask-image: linear-gradient(to bottom, transparent, #000 9%, #000 91%, transparent);
          }
          .door-gallery-h {
            -webkit-mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent);
            mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent);
          }
          .door-gallery-v:hover .door-track,
          .door-gallery-h:hover .door-track { animation-play-state: paused; }
          @media (prefers-reduced-motion: reduce) {
            .door-track { animation: none !important; }
          }
        `}</style>
      </section>

      {/* ─── INTERIOR DOORS ────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-background overflow-hidden">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text (left) */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="md:pr-6 order-2 md:order-1"
            >
              <motion.p variants={fadeUp} className="text-xs tracking-[0.3em] uppercase text-primary mb-4 font-medium">
                Interior Collection
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-heading text-4xl md:text-5xl text-foreground leading-tight mb-6">
                Warmth in<br />Every Room
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed mb-5">
                Our interior doors are more than transitions between spaces. They're
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

            {/* Image (right) */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative aspect-[4/5] overflow-hidden group order-1 md:order-2"
            >
              <img
                src="/assets/interior-doors.webp"
                alt="Interior wooden door with warm wood grain"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-950/30 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── EXTERIOR DOORS ────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-muted overflow-hidden">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text (right) */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="md:pl-6 order-2"
            >
              <motion.p variants={fadeUp} className="text-xs tracking-[0.3em] uppercase text-primary mb-4 font-medium">
                Exterior Collection
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-heading text-4xl md:text-5xl text-foreground leading-tight mb-6">
                First Impressions<br />Built to Last
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed mb-5">
                Your front door is the face of your home. Our exterior doors combine
                striking design with engineered performance: weather-resistant,
                secure, and built to endure decades of use without compromise.
              </motion.p>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed mb-10">
                From classic solid wood to modern flush designs, every exterior door
                is prefinished and ready to install, saving time without sacrificing quality.
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

            {/* Image (left) */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative aspect-[4/5] overflow-hidden group order-1"
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
                Tell us about your project and we'll help you find the right door,
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
