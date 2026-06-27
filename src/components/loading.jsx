import React from "react";
export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">

            <div className="absolute w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full animate-ping" />

            <div className="relative flex flex-col items-center gap-6 px-10 py-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl shadow-2xl">

                <div className="relative w-16 h-16">
                    
                    <div className="absolute inset-0 rounded-full border-2 border-zinc-700"></div>

                    <div className="absolute inset-0 rounded-full border-2 border-green-500 border-t-transparent animate-spin"></div>

                    <div className="absolute inset-3 rounded-full bg-green-500/10 blur-md"></div>
                </div>

                <div className="text-center">
                    <h1 className="text-green-400 font-semibold text-lg tracking-widest">
                        Loading
                    </h1>

                    <p className="text-zinc-400 text-sm mt-1 animate-pulse">
                        Please wait a moment...
                    </p>
                </div>

                <div className="flex gap-1 mt-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-300"></span>
                </div>
            </div>
        </div>
    );
}