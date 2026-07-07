import React from 'react'

export default function Sec2() {
  return (
<div className="max-w-7xl mx-auto px-6 lg:px-8 mt-24 mb-24 select-none font-sans transition-colors duration-200">
            
            {/* Sarlavha qismi */}
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full">
                    Application Flow
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-black mt-4 tracking-tight">
                    Get started in 3 simple steps
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium text-sm md:text-base">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid error fugiat, nostrum modi cum in?
                </p>
            </div>

            {/* Qadamlar gridi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Oradagi nuqtali chiziq */}
                <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-gray-200 dark:border-gray-800 pointer-events-none z-0"></div>
                
                {/* 1-qadam */}
                <div className="flex flex-col items-center text-center relative z-10 group">
                    <div className="w-16 h-16 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center font-black text-xl text-gray-900 dark:text-white shadow-md group-hover:border-blue-500 group-hover:text-blue-500 transition-all duration-300 mb-6 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50">
                        01
                    </div>
                    <h3 className="text-xl font-bold text-gray-950 dark:text-white mb-2">Create Account</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
                        Sign up easily with your email or social accounts and set up your personal secure workspace.
                    </p>
                </div>

                {/* 2-qadam */}
                <div className="flex flex-col items-center text-center relative z-10 group">
                    <div className="w-16 h-16 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl flex items-center justify-center font-black text-xl text-gray-900 dark:text-white shadow-md group-hover:border-blue-500 group-hover:text-blue-500 transition-all duration-300 mb-6 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50">
                        02
                    </div>
                    <h3 className="text-xl font-bold text-gray-950 dark:text-white mb-2">Connect Data</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
                        Integrate your website, online store, or mobile app with our smart API tracking code in one click.
                    </p>
                </div>

                {/* 3-qadam */}
                <div className="flex flex-col items-center text-center relative z-10 group">
                    <div className="w-16 h-16 bg-gray-950 dark:bg-white text-white dark:text-gray-950 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-gray-950/10 group-hover:bg-blue-500 transition-all duration-300 mb-6">
                        03
                    </div>
                    <h3 className="text-xl font-bold text-gray-950 dark:text-white mb-2">Get Analytics</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
                        Monitor live visits, conversions, and unlock deep insights through your new powerful admin dashboard.
                    </p>
                </div>

            </div>
        </div> )
}
