import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import { Suspense } from 'react';
import { productService } from "@/lib/services/ProductService";
import { categoryService } from "@/lib/services/CategoryService";
import HomeSkeleton from "@/components/skeletons/HomeSkeleton";

export const metadata: Metadata = {
  title: {
    absolute: "Lunar Locações | Equipamentos e Soluções para Locação",
  },
  description:
    "Equipamentos, mobiliários e itens diversos para locação com qualidade, rapidez e praticidade. Visite o nosso catálogo e faça seu pedido pelo WhatsApp!",
};

// Componente separado para buscar os dados, permitindo que o Hero apareça imediatamente
async function ProductListContainer() {
  const [products, categories] = await Promise.all([
    productService.getAllProducts(),
    categoryService.getCategoriesWithProducts()
  ]);

  return (
    <ProductsSection
      initialProducts={JSON.parse(JSON.stringify(products))}
      categories={JSON.parse(JSON.stringify(categories))}
    />
  );
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Suspense fallback={<HomeSkeleton />}>
        <ProductListContainer />
      </Suspense>
    </main>
  );
}
