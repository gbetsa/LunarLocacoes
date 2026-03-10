import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import { Suspense } from 'react';
import { productService } from "@/lib/services/ProductService";
import { categoryService } from "@/lib/services/CategoryService";

export const metadata: Metadata = {
  title: {
    absolute: "Lunar Locações | Equipamentos e Soluções para Locação",
  },
  description:
    "Equipamentos, mobiliários e itens diversos para locação com qualidade, rapidez e praticidade. Visite o nosso catálogo e faça seu pedido pelo WhatsApp!",
};


export default async function Home() {
  // Busca os dados iniciais no servidor para SEO e performance
  const products = await productService.getAllProducts();
  const categories = await categoryService.getCategoriesWithProducts();

  return (
    <main>
      <Hero />
      <Suspense fallback={<div className="py-20 text-center text-gray-500">Carregando catálogo...</div>}>
        <ProductsSection
          initialProducts={JSON.parse(JSON.stringify(products))}
          categories={JSON.parse(JSON.stringify(categories))}
        />
      </Suspense>
    </main>
  );
}
