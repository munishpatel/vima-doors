import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const LOCATIONS = [
  {
    number: '01',
    label: 'Ramachandrapuram',
    address: 'Ramachandrapuram, Hyderabad, Telangana',
    directionsUrl: 'https://www.google.com/maps/search/Vima+Doors+Showroom,+Ramachandrapuram,+Hyderabad,+Telangana',
    embedSrc: `https://maps.google.com/maps?q=Vima+Doors+Showroom,+Ramachandrapuram,+Hyderabad,+Telangana,+India&t=&z=15&ie=UTF8&iwloc=&output=embed`,
  },
  {
    number: '02',
    label: 'Shree Shankar Vijay Trading',
    address: 'Hyderabad, Telangana',
    directionsUrl: 'https://maps.app.goo.gl/SS5ysxjWVGbQWQZB7',
    embedSrc: `https://maps.google.com/maps?q=Shree+Shankar+Vijay+Trading+-+Vima+Doors,+Hyderabad,+Telangana,+India&t=&z=15&ie=UTF8&iwloc=&output=embed`,
  },
];

export default function Locations() {
  return (
    <section className="relative bg-background py-8 md:py-14 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-5 md:mb-8"
        >
          <h2 className="font-heading text-2xl md:text-4xl text-foreground leading-tight">
            Our Locations
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
          {LOCATIONS.map((loc, i) => (
            <motion.div
              key={loc.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.1 }}
              className="group relative h-[240px] sm:h-[280px] md:h-[330px] overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
            >
              {/* Map */}
              <iframe
                title={loc.label}
                src={loc.embedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 h-full w-full scale-100 transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Bottom gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

              {/* Number badge */}
              <div className="absolute top-3.5 right-3.5 bg-white/90 backdrop-blur-sm text-stone-700 text-[11px] font-semibold tracking-widest px-2.5 py-1 rounded-full">
                {loc.number}
              </div>

              {/* Directions button */}
              <div className="absolute bottom-4 right-4 md:bottom-5 md:right-5">
                <a
                  href={loc.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-stone-900 transition-colors hover:bg-stone-100"
                >
                  Directions
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
