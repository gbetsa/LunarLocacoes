import Hero from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import Footer from "@/components/Footer";
import { Suspense } from 'react';

export default function Home() {
  return (
    <main>
      <Hero />
      <Suspense fallback={<div>Carregando produtos...</div>}>
        <ProductsSection />
      </Suspense>
      <Footer />
    </main>
  );
}
