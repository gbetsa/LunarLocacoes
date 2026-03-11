'use client';

import ProductSkeleton from "@/components/skeletons/ProductSkeleton";
import CategorySkeleton from "@/components/skeletons/CategorySkeleton";

export default function HomeSkeleton() {
    return (
        <section style={{ background: '#f4f6fb', paddingTop: '5rem', paddingBottom: '4rem' }}>
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                {/* Cabeçalho Placeholder */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div className="space-y-3">
                        <div className="h-8 bg-gray-200 rounded-lg w-64 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded-md w-96 animate-pulse" />
                    </div>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-10">
                    {/* Sidebar Placeholder */}
                    <aside className="lg:col-span-3 mb-8 lg:mb-0">
                        <div className="flex lg:flex-col gap-2.5 overflow-x-auto pb-4 lg:pb-0">
                            <div className="hidden lg:block h-3 bg-gray-100 rounded w-20 mb-4 ml-1" />
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <CategorySkeleton key={i} />
                            ))}
                        </div>
                    </aside>

                    {/* Grid Placeholder */}
                    <main className="lg:col-span-9">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <ProductSkeleton key={i} />
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </section>
    );
}
