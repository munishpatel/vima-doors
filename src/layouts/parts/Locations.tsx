import { motion } from 'motion/react';
const EMBED_QUERY = 'Vima+Doors+Showroom,+Ramachandrapuram,+Hyderabad,+Telangana,+India';
const EMBED_SRC = `https://maps.google.com/maps?q=${EMBED_QUERY}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

export default function Locations() {
  return (
    <section className="relative bg-background py-8 md:py-14 overflow-hidden">
      {/* Heading */}
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
      </div>

      {/* Map — full-bleed on mobile, contained on desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="px-4 md:px-6 lg:px-10 md:container md:mx-auto"
      >
        <div className="relative h-[240px] sm:h-[300px] md:h-[440px] overflow-hidden md:border md:border-stone-200 md:shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:max-w-5xl md:mx-auto">
          <iframe
            title="Vima Doors location map"
            src={EMBED_SRC}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
