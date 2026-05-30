import React from "react";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen w-1000 bg-black">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>

                <p className="text-green-500 font-semibold animate-pulse">
                    Loading...
                </p>
            </div>
        </div>
    );
}