'use client';

export default function ProductSkeleton() {
    return (
        <div className="flex flex-col rounded-2xl overflow-hidden h-full border border-gray-200 bg-white animate-pulse shadow-sm">
            {/* Imagem Placeholder */}
            <div className="w-full h-[180px] bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>

            {/* Conteúdo Placeholder */}
            <div className="flex flex-col gap-3 p-5 flex-1">
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                    <div className="h-4 bg-gray-200 rounded-md w-1/2" />
                </div>

                <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                    <div className="h-3 bg-gray-200 rounded-full w-24" />
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="h-3 bg-gray-100 rounded-md w-12" />
                    <div className="h-4 bg-gray-200 rounded-md w-16" />
                </div>

                <div className="flex gap-2 mt-auto pt-4">
                    <div className="flex-[0.8] h-10 bg-gray-200 rounded-xl" />
                    <div className="flex-1 h-10 bg-gray-200 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
