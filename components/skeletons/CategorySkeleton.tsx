'use client';

export default function CategorySkeleton() {
    return (
        <div className="flex items-center justify-between gap-2 px-5 py-3 rounded-xl border border-gray-100 bg-white animate-pulse lg:w-full">
            <div className="flex items-center gap-2.5">
                <div className="w-4.5 h-4.5 rounded-md bg-gray-200" />
                <div className="h-4 bg-gray-200 rounded-md w-24" />
            </div>
            <div className="w-6 h-4 rounded-full bg-gray-100" />
        </div>
    );
}
