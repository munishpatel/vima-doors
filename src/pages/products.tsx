import ProductCollections from '@/components/products/ProductCollections';
import ProductsHero from '@/components/products/ProductsHero';
import ProductsIntro from '@/components/products/ProductsIntro';

export default function ProductsPage() {
  return (
    <>
      <title>Doors &amp; Collections | Vima Doors</title>
      <meta
        name="description"
        content="Explore Vima Doors' collections — Fluted, Gold Pati, Highlighters, Laminate Cut Paste, NOVA V25, Vintage, Teak, Veneer and Pooja doors — plus WPC doors and frames — or bring us your own design and we will build it."
      />

      <ProductsHero />
      <ProductsIntro />
      <ProductCollections />
    </>
  );
}
