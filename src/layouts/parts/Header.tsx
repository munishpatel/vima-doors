import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const PHONE_DISPLAY = '+91 8106802929';
const PHONE_TEL = 'tel:+918106802929';
const WA_HREF = 'https://wa.me/918106802929?text=Hi%2C%20I%27m%20interested%20in%20Vima%20Doors';

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2, ease: 'easeIn' as const },
  },
};

export default function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* ── Top info bar (desktop only) ─────────────────────────────────── */}
      <div
        className={`hidden md:block overflow-hidden transition-all duration-300 ${
          scrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'
        }`}
        style={{ background: 'rgba(15,10,6,0.72)', backdropFilter: 'blur(8px)' }}
      >
        <div className="container mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-9 text-[11px] tracking-wide text-stone-300">
            <div className="flex items-center gap-1.5">
              <MapPin size={11} className="text-amber-400 shrink-0" />
              <span>Hyderabad, Telangana</span>
              <span className="mx-2 text-stone-600">|</span>
              <span className="text-stone-400">Mon–Sat 9 AM – 8 PM</span>
            </div>
            <div className="flex items-center gap-5">
              <a
                href={PHONE_TEL}
                className="flex items-center gap-1.5 hover:text-white transition-colors duration-150"
              >
                <Phone size={11} className="text-amber-400" />
                <span>{PHONE_DISPLAY}</span>
              </a>
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors duration-150 font-medium"
              >
                <WhatsAppIcon size={11} />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main header ─────────────────────────────────────────────────── */}
      <header
        className={`transition-all duration-500 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-10">
          <div className="flex h-[72px] items-center justify-between">

            {/* Logo */}
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center shrink-0 group"
            >
              <img
                src="/assets/logo.png"
                alt="Vima Doors"
                className="h-10 w-auto transition-all duration-500"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`relative px-4 py-2 text-[11px] tracking-[0.18em] uppercase font-medium transition-colors duration-200 group ${
                      isActive
                        ? scrolled
                          ? 'text-primary'
                          : 'text-white'
                        : scrolled
                        ? 'text-foreground/60 hover:text-foreground'
                        : 'text-white/75 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {/* Active dot */}
                    {isActive && (
                      <span
                        className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-colors duration-200 ${
                          scrolled ? 'bg-primary' : 'bg-white'
                        }`}
                      />
                    )}
                    {/* Hover underline */}
                    {!isActive && (
                      <span
                        className={`absolute bottom-0.5 left-4 right-4 h-px transition-all duration-300 origin-left scale-x-0 group-hover:scale-x-100 ${
                          scrolled ? 'bg-primary' : 'bg-white/60'
                        }`}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA buttons (desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {/* WhatsApp */}
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase font-medium px-4 py-2 transition-all duration-200 ${
                  scrolled
                    ? 'bg-[#25D366] text-white hover:bg-[#1ebe5d]'
                    : 'bg-[#25D366]/90 text-white hover:bg-[#25D366]'
                }`}
              >
                <WhatsAppIcon size={13} />
                Chat
              </a>
              {/* Get a Quote */}
              <Link
                to="/contact"
                className={`flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase font-medium px-4 py-2 border transition-all duration-200 ${
                  scrolled
                    ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                    : 'border-white/70 text-white hover:bg-white hover:text-foreground'
                }`}
              >
                Get a Quote
                <ArrowRight size={12} />
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className={`md:hidden p-2 -mr-1 transition-colors duration-200 ${
                scrolled ? 'text-foreground' : 'text-white'
              }`}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={22} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu size={22} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── Mobile menu ───────────────────────────────────────────────── */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden overflow-hidden bg-background border-t border-border"
            >
              {/* Contact strip */}
              <div className="flex items-center justify-between px-6 py-3 bg-stone-50 border-b border-border/60">
                <a
                  href={PHONE_TEL}
                  className="flex items-center gap-2 text-xs font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  <Phone size={13} className="text-primary" />
                  {PHONE_DISPLAY}
                </a>
                <a
                  href={WA_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium text-[#25D366] hover:text-[#1ebe5d] transition-colors"
                >
                  <WhatsAppIcon size={13} />
                  WhatsApp
                </a>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col px-2 py-3">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    <Link
                      to={item.href}
                      className={`flex items-center justify-between py-3.5 px-4 text-sm tracking-widest uppercase font-medium rounded-sm transition-colors ${
                        location.pathname === item.href
                          ? 'text-primary bg-primary/5'
                          : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {item.label}
                      {location.pathname === item.href && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom CTA */}
              <div className="px-6 pb-6 pt-2">
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground text-xs tracking-widest uppercase font-medium py-3.5 hover:bg-primary/90 transition-colors duration-200"
                >
                  Request a Free Quote
                  <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
