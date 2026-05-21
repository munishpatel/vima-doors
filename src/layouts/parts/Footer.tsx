import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, ArrowUp } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About Us' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

const SHOWROOM = {
  label: 'Exclusive Doors Showroom',
  name: 'Shree Shankar Vijay Traders',
  address: ['23-29, Jyothi Nagar, Ramachandra', 'Puram, Hyderabad,', 'Telangana 502032'],
  phones: [
    { display: '+91 99490 92929', tel: '+919949092929' },
    { display: '+91 63043 70290', tel: '+916304370290' },
  ],
  emails: ['vimadoors@gmail.com', 'info@vimadoors.in'],
};

const WORKSHOP = {
  label: 'Workshop',
  name: 'Manufacturing Unit',
  address: ['Plot 14, Industrial Estate,', 'Patancheru, Sangareddy,', 'Telangana 502319'],
  phones: [
    { display: '+91 97010 92929', tel: '+919701092929' },
    { display: '+91 86399 63823', tel: '+918639963823' },
  ],
};

const SOCIALS = [
  { label: 'Facebook',  href: 'https://facebook.com/vimadoors',  img: '/assets/socials/facebook.png' },
  { label: 'WhatsApp',  href: 'https://wa.me/918106802929',       img: '/assets/socials/whatsapp.png' },
  { label: 'Twitter',   href: 'https://twitter.com/vimadoors',    img: '/assets/socials/twitter.png' },
  { label: 'Instagram', href: 'https://instagram.com/vimadoors',  img: '/assets/socials/instagram.png' },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-px w-6 bg-amber-400/60" />
      <h4 className="text-[10px] tracking-[0.22em] uppercase text-amber-200/90 font-semibold">
        {children}
      </h4>
    </div>
  );
}

function ContactBlock({
  data,
  showEmails = false,
  showSocials = false,
}: {
  data: typeof SHOWROOM | typeof WORKSHOP;
  showEmails?: boolean;
  showSocials?: boolean;
}) {
  return (
    <div>
      <ColumnHeading>{data.label}</ColumnHeading>
      <p className="font-heading text-lg text-stone-100 mb-4 leading-snug">
        {data.name}
      </p>

      <ul className="space-y-3.5 text-base">
        {/* Address */}
        <li className="flex items-start gap-3 text-stone-400">
          <MapPin
            size={15}
            className="mt-0.5 shrink-0 text-amber-400/80"
            strokeWidth={1.75}
          />
          <span className="leading-relaxed">
            {data.address.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </span>
        </li>

        {/* Phones */}
        <li className="flex items-start gap-3">
          <Phone
            size={15}
            className="mt-0.5 shrink-0 text-amber-400/80"
            strokeWidth={1.75}
          />
          <div className="flex flex-col gap-1">
            {data.phones.map((p) => (
              <a
                key={p.tel}
                href={`tel:${p.tel}`}
                className="text-stone-400 hover:text-stone-100 transition-colors duration-200 tracking-wide"
              >
                {p.display}
              </a>
            ))}
          </div>
        </li>

        {/* Emails (showroom only) */}
        {showEmails && 'emails' in data && data.emails && (
          <li className="flex items-start gap-3">
            <Mail
              size={15}
              className="mt-0.5 shrink-0 text-amber-400/80"
              strokeWidth={1.75}
            />
            <div className="flex flex-col gap-1">
              {data.emails.map((e) => (
                <a
                  key={e}
                  href={`mailto:${e}`}
                  className="text-stone-400 hover:text-stone-100 transition-colors duration-200"
                >
                  {e}
                </a>
              ))}
            </div>
          </li>
        )}
      </ul>

      {/* Social icons */}
      {showSocials && (
        <div className="flex items-center gap-3 mt-5">
          {SOCIALS.map(({ label, href, img }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ y: -2, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="h-10 w-10 flex items-center justify-center"
            >
              <img src={img} alt={label} className="h-9 w-9 object-contain" />
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer
      className="relative text-stone-300 overflow-hidden"
      style={{
        background:
          'radial-gradient(120% 80% at 50% 0%, #2a1810 0%, #1a0f08 55%, #0f0805 100%)',
      }}
    >
      {/* Decorative top hairline + subtle amber glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[60rem] -translate-x-1/2 rounded-full bg-amber-500/[0.06] blur-3xl" />

      {/* ── Main grid ───────────────────────────────────────────────── */}
      <div className="relative container mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10 lg:items-center">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4 flex flex-col items-start">
            <Link to="/" onClick={scrollToTop} className="inline-flex items-end gap-0">
              <img
                src="/assets/title-logo.png"
                alt=""
                aria-hidden="true"
                className="h-32 w-auto object-contain"
                style={{ filter: 'brightness(1.6) saturate(0.85)' }}
              />
              <img
                src="/assets/logo.png"
                alt="Vima Doors"
                className="h-32 w-auto object-contain"
                style={{ filter: 'brightness(1.5) saturate(0.9)' }}
              />
            </Link>

            {/* Heritage badge */}
            <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 border border-stone-50/10 bg-stone-50/[0.02]">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              <span className="text-[10px] tracking-[0.24em] uppercase text-stone-300 font-medium">
                Est. 1983 &middot; Family Owned
              </span>
            </div>
          </div>

          {/* Showroom */}
          <div className="lg:col-span-3">
            <ContactBlock data={SHOWROOM} showEmails />
          </div>

          {/* Workshop */}
          <div className="lg:col-span-3">
            <ContactBlock data={WORKSHOP} showSocials />
          </div>

          {/* Navigate */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] tracking-[0.22em] uppercase text-amber-200/90 font-semibold mb-5">
              Navigate
            </h4>
            <nav className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={scrollToTop}
                  className="group inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-50 transition-colors duration-200 w-fit"
                >
                  <span className="h-px w-0 bg-amber-300 transition-all duration-300 group-hover:w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────── */}
      <div className="relative border-t border-stone-100/[0.06]">
        <div className="container mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500 order-2 md:order-1">
            &copy; {currentYear} Vima Doors. All rights reserved.
          </p>

          <nav className="flex items-center gap-6 order-1 md:order-2">
            <Link
              to="/privacy"
              className="text-xs text-stone-500 hover:text-stone-200 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="h-3 w-px bg-stone-700" />
            <Link
              to="/terms"
              className="text-xs text-stone-500 hover:text-stone-200 transition-colors"
            >
              Terms of Use
            </Link>
            <span className="h-3 w-px bg-stone-700 hidden md:block" />
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="hidden md:inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-stone-500 hover:text-amber-200 transition-colors group"
            >
              <span>Back to Top</span>
              <ArrowUp
                size={12}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
