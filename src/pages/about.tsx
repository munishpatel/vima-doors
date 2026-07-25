import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Target,
  Eye,
  Gem,
  Handshake,
  Users,
  Leaf,
  MapPin,
} from 'lucide-react';

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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.55, ease: 'easeOut' as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const STATS = [
  { value: '1983', label: 'Established' },
  { value: '3', label: 'Generations' },
  { value: '3', label: 'Firms' },
  { value: '2', label: 'Showrooms' },
];

const PRODUCTS = [
  'Indian Teak Wood Doors',
  'African Teak Doors',
  'Plain Flush Doors',
  'Moulded Doors',
  'Laminate Doors',
  'Laminate Decorative Doors',
  'Veneer Doors',
  'WPC Doors & Frames',
];

const VALUES = [
  {
    icon: Gem,
    title: 'Quality Without Compromise',
    body: 'We continually adopt the latest technology to refine every product, achieving the finest quality at a sustainable cost.',
  },
  {
    icon: Handshake,
    title: 'Relationships That Last',
    body: 'We build long-term partnerships with our customers, channel partners, and suppliers, trust earned across generations.',
  },
  {
    icon: Users,
    title: 'People First',
    body: 'We strive to be the best employer in our industry, respecting the dignity of every member of our team.',
  },
  {
    icon: Leaf,
    title: 'Responsibility & Sustainability',
    body: 'We contribute to the growth of our community and nation while staying committed to environmental sustainability.',
  },
];

/* ------------------------------------------------------------------ */
/*  Reusable eyebrow                                                   */
/* ------------------------------------------------------------------ */

function Eyebrow({
  children,
  tone = 'primary',
}: {
  children: React.ReactNode;
  tone?: 'primary' | 'amber';
}) {
  return (
    <p
      className={`text-xs tracking-[0.3em] uppercase mb-4 font-semibold ${
        tone === 'amber' ? 'text-amber-300/90' : 'text-primary'
      }`}
    >
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  return (
    <>
      <title>About Us | Vima Doors</title>
      <meta
        name="description"
        content="From a humble timber depot in Jyothi Nagar to a trusted name in doors across Hyderabad. Three generations of craftsmanship behind Vima Doors. Learn our story, mission, and values."
      />

      {/* ─── HERO (cinematic) ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 md:py-36">
        {/* Full-bleed backdrop with a slow ken-burns settle */}
        <motion.img
          src="/assets/welcome_door.jpg"
          alt=""
          aria-hidden
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: 'easeOut' }}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Warm cinematic veil, fades into the dark stats band below */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#140a04]/80 via-[#1a0f08]/60 to-[#0f0805]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(15,8,5,0.55)_100%)]" />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[60rem] -translate-x-1/2 rounded-full bg-amber-500/[0.12] blur-3xl" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative container mx-auto px-6 lg:px-10 text-center"
        >
          <motion.div variants={fadeUp}>
            <Eyebrow tone="amber">Our Story</Eyebrow>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="font-heading text-4xl md:text-5xl lg:text-6xl text-white leading-[1.08] tracking-tight"
          >
            Three Generations,<br />One Standard of Craft.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-stone-300 leading-relaxed"
          >
            What began as a small family timber depot in Hyderabad has grown into
            one of the region&rsquo;s most trusted names in doors, yet the
            craftsmanship, honesty, and care that started it all have never
            changed.
          </motion.p>
        </motion.div>
      </section>

      {/* ─── STATS BAND ───────────────────────────────────────────────── */}
      <section className="relative bg-[#0f0805] border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}
                className="flex flex-col items-center justify-center py-10 md:py-14"
              >
                <span className="font-heading text-4xl md:text-5xl text-white leading-none">
                  {stat.value}
                </span>
                <span className="mt-3 text-[11px] tracking-[0.22em] uppercase text-amber-200/80 font-semibold">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OUR HISTORY ──────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 bg-background overflow-hidden">
        <div className="pointer-events-none absolute -top-28 -left-28 h-96 w-96 rounded-full bg-primary/[0.05] blur-3xl" />

        <div className="relative container mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image (the storefront) */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative order-1 lg:order-none"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                <img
                  src="/assets/VimaDoors1.png"
                  alt="The Vima Doors exclusive showroom storefront in Ramachandrapuram, Hyderabad"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              {/* Heritage badge */}
              <div className="absolute -bottom-5 left-5 md:-left-6 flex items-center gap-3 rounded-xl bg-primary px-5 py-3.5 text-primary-foreground shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
                <span className="font-heading text-3xl leading-none">40+</span>
                <span className="text-[11px] tracking-[0.16em] uppercase leading-tight font-semibold">
                  Years of
                  <br />
                  Craftsmanship
                </span>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeUp}>
                <Eyebrow>Our History</Eyebrow>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-6"
              >
                From a Timber Depot
                <br />
                to a Trusted Name
              </motion.h2>
              <motion.div
                variants={fadeUp}
                className="mb-8 h-px w-16 bg-gradient-to-r from-primary/70 to-transparent"
              />

              <motion.p
                variants={fadeUp}
                className="text-foreground/80 leading-relaxed mb-5"
              >
                Our journey began long before the Vima Doors name rose above our
                showroom. It started in Jyothi Nagar, Hyderabad, as{' '}
                <span className="text-foreground font-medium">
                  Shree Shankar Vijay Timber Depot
                </span>
                , a modest timber business built on our founders&rsquo; deep
                knowledge of wood and a simple ambition: to become a trusted name
                in timber and door products across the region.
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="text-muted-foreground leading-relaxed mb-5"
              >
                Over the decades we earned a respected place in the market by
                never compromising on quality, offering designer door panels,
                customized doors, veneer moulded doors, plywood, and PVC/WPC
                products. As the second generation joined the business, they
                carried the same craft forward, growing from timber trading into
                full-scale door manufacturing under the Vima Doors brand.
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="text-muted-foreground leading-relaxed"
              >
                Today, Vima Doors spans{' '}
                <span className="text-foreground font-medium">
                  3 firms and 2 showrooms
                </span>
                , manufacturing and supplying a complete range of doors. Three
                generations on, the values that started it all remain unchanged.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SHOWROOM SHOWCASE ────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="relative h-[340px] md:h-[520px]">
          <img
            src="/assets/VimaDoors.png"
            alt="Vima Doors exclusive doors showroom decorated for its opening in Hyderabad"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          <div className="relative z-10 flex h-full items-end">
            <div className="container mx-auto px-6 lg:px-10 pb-12 md:pb-16">
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                className="max-w-xl"
              >
                <motion.div variants={fadeUp}>
                  <Eyebrow tone="amber">Visit Us</Eyebrow>
                </motion.div>
                <motion.h2
                  variants={fadeUp}
                  className="font-heading text-3xl md:text-4xl text-white leading-tight mb-3"
                >
                  Our Exclusive Doors Showroom
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  className="flex items-center gap-2 text-stone-300"
                >
                  <MapPin size={16} className="text-amber-400 shrink-0" />
                  Ramachandrapuram, Hyderabad, Telangana
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT WE MAKE ─────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-muted overflow-hidden">
        <div className="container mx-auto px-6 lg:px-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl mb-14"
          >
            <motion.div variants={fadeUp}>
              <Eyebrow>What We Make</Eyebrow>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight"
            >
              A Complete Range of Doors
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground leading-relaxed mt-5"
            >
              As manufacturers and traders, we craft and supply doors for every
              home, project, and budget, engineered for durability and finished
              to impress.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRODUCTS.map((product, i) => (
              <motion.div
                key={product}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="group relative flex items-center gap-3 rounded-xl border border-border bg-background p-5 transition-colors hover:border-primary/40"
              >
                <span className="font-heading text-lg text-primary/40 tabular-nums group-hover:text-primary transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm font-medium text-foreground/90 leading-snug">
                  {product}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MISSION & VISION ─────────────────────────────────────────── */}
      <section
        className="relative py-24 md:py-32 overflow-hidden"
        style={{ backgroundColor: '#1a0f08' }}
      >
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-primary/[0.05] blur-3xl" />

        <div className="relative container mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Mission */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300 mb-6">
                <Target size={22} strokeWidth={1.75} />
              </span>
              <h3 className="font-heading text-2xl text-white mb-4">
                Our Mission
              </h3>
              <p className="text-stone-300 leading-relaxed">
                To lead our industry by investing continuously in technology and
                craftsmanship that elevate everyday living. We aim to give
                customers the widest choice of premium doors, built on
                innovation, a genuine understanding of their needs, and service
                that goes beyond the sale, while growing responsibly and in
                harmony with the environment.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300 mb-6">
                <Eye size={22} strokeWidth={1.75} />
              </span>
              <h3 className="font-heading text-2xl text-white mb-4">
                Our Vision
              </h3>
              <p className="text-stone-300 leading-relaxed">
                To be the most trusted name in doors, shaping preferred
                lifestyles through relentless innovation, uncompromising quality,
                and design that stands the test of time. We see a future where
                every Vima door is a mark of craftsmanship a family can rely on
                for generations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── OUR VALUES ───────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-background overflow-hidden">
        <div className="container mx-auto px-6 lg:px-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl mb-14"
          >
            <motion.div variants={fadeUp}>
              <Eyebrow>What We Stand For</Eyebrow>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight"
            >
              Our Values
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}
                  className="group relative rounded-2xl border border-border bg-muted/40 p-7 transition-colors hover:border-primary/40 hover:bg-muted"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6 transition-transform duration-300 group-hover:scale-110">
                    <Icon size={22} strokeWidth={1.75} />
                  </span>
                  <h3 className="font-heading text-lg text-foreground mb-3 leading-snug">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-muted">
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-primary/[0.07] blur-3xl" />

        <div className="relative container mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-xl"
            >
              <motion.div variants={fadeUp}>
                <Eyebrow>Let&rsquo;s Talk</Eyebrow>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="font-heading text-3xl md:text-4xl text-foreground leading-tight"
              >
                Ready to Find Your Perfect Door?
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-muted-foreground mt-4 leading-relaxed"
              >
                Visit our showroom or reach out to our team, we&rsquo;d love to
                help you bring your project to life.
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
                Get in Touch
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
