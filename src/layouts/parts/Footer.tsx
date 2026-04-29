import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#1a0f08' }} className="text-stone-300">
      <div className="container mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <img
              src="/airo-assets/images/logo/horizontal?variant=solid"
              alt="Vima Doors"
              className="h-8 w-auto mb-5"
              style={{ filter: 'brightness(1.4) contrast(0.9)' }}
            />
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              Three generations of craftsmanship. Prefinished interior and exterior doors
              built to the highest standards of quality, performance, and security.
            </p>
            <p className="mt-6 text-xs tracking-widest uppercase text-stone-500">
              Est. 1970 &mdash; Family Owned
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-stone-400 mb-5 font-medium">
              Navigate
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'Products' },
                { href: '/about', label: 'About Us' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/contact', label: 'Contact' },
              ].map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-sm text-stone-400 hover:text-stone-100 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-widest uppercase text-stone-400 mb-5 font-medium">
              Contact
            </h4>
            <div className="flex flex-col gap-3 text-sm text-stone-400">
              <p>vimadoors@gmail.com</p>
              <p>+91 8106802929</p>
              <p className="leading-relaxed">
                23-29, Jyothi Nagar, Ramachandra<br />
                Puram, Hyderabad,<br />
                Telangana 502032
              </p>
              <Link
                to="/contact"
                className="mt-2 inline-block text-xs tracking-widest uppercase border border-stone-600 text-stone-300 px-4 py-2.5 hover:border-stone-300 hover:text-stone-100 transition-all duration-200 w-fit"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-600">
            &copy; {currentYear} Vima Doors. All rights reserved.
          </p>
          <nav className="flex gap-6">
            <Link to="/privacy" className="text-xs text-stone-600 hover:text-stone-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-stone-600 hover:text-stone-400 transition-colors">
              Terms of Use
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
