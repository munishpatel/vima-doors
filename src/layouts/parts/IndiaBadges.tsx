import { motion } from 'motion/react';

const BADGES = [
  { src: '/assets/India/made_in_india.png', alt: '100% Made in India' },
  { src: '/assets/India/Swach-Bharat.png', alt: 'Swachh Bharat' },
  { src: '/assets/India/make-in-india.png', alt: 'Make in India' },
  { src: '/assets/India/igbc.png', alt: 'Indian Green Building Council', className: 'h-20 md:h-28' },
];

export default function IndiaBadges() {
  return (
    <section className="bg-background py-8 md:py-12">
      <div className="container mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-14"
        >
          {BADGES.map((badge, i) => (
            <motion.div
              key={badge.alt}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.08 }}
              className="flex items-center justify-center"
            >
              <img
                src={badge.src}
                alt={badge.alt}
                className={`w-auto object-contain ${badge.className ?? 'h-32 md:h-40'}`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
