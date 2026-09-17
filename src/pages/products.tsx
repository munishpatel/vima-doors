import DoorAnatomyHero from '@/components/products/DoorAnatomyHero';
import ProductCatalog from '@/components/products/ProductCatalog';

export default function ProductsPage() {
  return (
    <>
      <title>Doors &amp; Collections | Vima Doors</title>
      <meta
        name="description"
        content="Explore Vima Doors' collections — Fluted, Gold Pati, Highlighters, Laminate Cut Paste, NOVA V25, Vintage, Teak, Veneer and Pooja doors — and see exactly how each door is built."
      />

      <DoorAnatomyHero />
      <ProductCatalog />
    </>
  );
}
