export default function ProductDetailLoading() {
    return (
        <main className="min-h-screen pt-24 sm:pt-32 pb-12 sm:pb-20 bg-[#f4f6fb] animate-pulse">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
                {/* Botão Voltar Placeholder */}
                <div className="mb-6 sm:mb-8 w-40 h-10 bg-gray-200 rounded-lg" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                    {/* Galeria Placeholder */}
                    <div className="lg:col-span-7">
                        <div className="aspect-[4/3] w-full bg-gray-200 rounded-3xl" />
                        <div className="grid grid-cols-4 gap-4 mt-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-gray-200 rounded-xl" />
                            ))}
                        </div>
                    </div>

                    {/* Info Placeholder */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-6">
                            <div className="w-24 h-6 bg-gray-200 rounded-md" />
                            <div className="w-full h-10 bg-gray-200 rounded-lg" />
                            
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-200" />
                                <div className="w-32 h-4 bg-gray-200 rounded-md" />
                            </div>

                            <div className="w-full h-14 bg-gray-100 rounded-xl" />

                            <div className="space-y-3">
                                <div className="w-20 h-6 bg-gray-200 rounded-md" />
                                <div className="w-full h-24 bg-gray-50 rounded-lg" />
                            </div>

                            <div className="w-full h-16 bg-gray-200 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
