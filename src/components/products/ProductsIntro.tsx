import { motion } from 'motion/react';

/** Brand statement between the banner and the catalogue. */
export default function ProductsIntro() {
  return (
    <section aria-labelledby="products-intro-heading" className="bg-muted">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="container mx-auto max-w-5xl px-6 py-14 text-center md:py-20 lg:px-10"
      >
        <h2
          id="products-intro-heading"
          className="font-heading text-[1.9rem] leading-tight text-foreground md:text-[2.5rem]"
        >
          Vima Doors — Premium Door Manufacturer in India
        </h2>
        <div aria-hidden className="mx-auto mt-4 h-px w-14 bg-primary/40" />
        <p className="mx-auto mt-6 max-w-4xl text-[15px] leading-[1.9] text-foreground/60 md:text-base">
          At Vima Doors, we take pride in being one of the leading{' '}
          <strong className="font-semibold text-foreground/80">door manufacturers</strong> in the
          industry, bringing three generations of craftsmanship to homes and projects across the
          country. Whether you are building a new home, renovating the one you love or fitting out a
          commercial space, our range of teak, veneer, laminate, fluted and pooja doors means you
          will find the door that suits your taste — and if you cannot, we will build it to your
          design. Our commitment to seasoned timber, precise joinery and an honest finish is what
          makes us a trusted name among homeowners, architects and builders alike.
        </p>
      </motion.div>
    </section>
  );
}
