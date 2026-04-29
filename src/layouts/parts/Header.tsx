import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex h-20 items-center justify-between">
          {/* Logo — always scrolls to top of homepage */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center shrink-0"
          >
            <img
              src="/airo-assets/images/logo/horizontal"
              alt="Vima Doors"
              className="h-9 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative text-sm tracking-widest uppercase font-medium transition-colors duration-200 group px-3 py-1.5 ${
                    isActive
                      ? 'text-primary-foreground'
                      : scrolled
                      ? 'text-foreground/70 hover:text-foreground'
                      : 'text-background/80 hover:text-background'
                  }`}
                  style={isActive ? { backgroundColor: '#6B3F2A' } : {}}
                >
                  {item.label}
                  {!isActive && (
                    <span
                      className="absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 w-0 group-hover:w-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              to="/contact"
              className={`text-xs tracking-widest uppercase font-medium px-5 py-2.5 border transition-all duration-200 ${
                scrolled
                  ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                  : 'border-background/60 text-background hover:bg-background hover:text-foreground'
              }`}
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition-colors ${
              scrolled ? 'text-foreground' : 'text-background'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border py-6">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm tracking-widest uppercase font-medium py-3 px-2 transition-colors border-b border-border/40 ${
                    location.pathname === item.href
                      ? 'text-primary'
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/contact"
                className="mt-4 text-xs tracking-widest uppercase font-medium px-5 py-3 border border-primary text-primary text-center hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get a Quote
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
