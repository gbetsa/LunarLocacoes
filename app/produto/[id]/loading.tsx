export default function ProductDetailLoading() {
    const shimmer = "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* Galeria Placeholder */}
            <div className="lg:col-span-7">
                <div className={`aspect-[4/3] w-full bg-slate-200 rounded-3xl relative overflow-hidden ${shimmer}`} />
                <div className="grid grid-cols-4 gap-4 mt-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`aspect-square bg-slate-200 rounded-xl relative overflow-hidden ${shimmer}`} />
                    ))}
                </div>
            </div>

            {/* Info Placeholder */}
            <div className="lg:col-span-5">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-6">
                    <div className={`w-24 h-6 bg-slate-100 rounded-md relative overflow-hidden ${shimmer}`} />
                    <div className={`w-full h-10 bg-slate-200 rounded-lg relative overflow-hidden ${shimmer}`} />
                    
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-200" />
                        <div className={`w-32 h-4 bg-slate-100 rounded-md relative overflow-hidden ${shimmer}`} />
                    </div>

                    <div className={`w-full h-14 bg-slate-50 rounded-xl relative overflow-hidden ${shimmer}`} />

                    <div className="space-y-4 pt-4">
                        <div className={`w-20 h-6 bg-slate-100 rounded-md relative overflow-hidden ${shimmer}`} />
                        <div className="space-y-2">
                           <div className={`w-full h-4 bg-slate-50 rounded relative overflow-hidden ${shimmer}`} />
                           <div className={`w-full h-4 bg-slate-50 rounded relative overflow-hidden ${shimmer}`} />
                           <div className={`w-3/4 h-4 bg-slate-50 rounded relative overflow-hidden ${shimmer}`} />
                        </div>
                    </div>

                    <div className={`w-full h-16 bg-slate-200 rounded-xl relative overflow-hidden ${shimmer} mt-8`} />
                </div>
            </div>
        </div>
    );
}
