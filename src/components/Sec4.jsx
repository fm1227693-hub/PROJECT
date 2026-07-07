import React from 'react'

export default function Sec4() {
    return (
     <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-24 mb-24 select-none font-sans transition-colors duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Chap matn qismi */}
                <div className="flex flex-col space-y-6 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold w-fit">
                        Our Story
                    </div>

                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-black leading-tight">
                        We help businesses scale using <span className="text-blue-500 dark:text-blue-400">smart data analytics</span>.
                    </h2>

                    <p className="text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid error fugiat, nostrum modi cum in rerum distinctio unde error. We believe that tracking data shouldn't be complicated.
                    </p>

                    <div className="space-y-4 pt-2">
                        {/* Mission */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 shrink-0 bg-gray-950 dark:bg-white text-white dark:text-gray-950 flex items-center justify-center rounded-xl font-bold text-sm shadow-sm">
                                🚀
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-gray-950 dark:text-white">Our Mission</h4>
                                <p className="text-gray-400 dark:text-gray-400 text-xs font-semibold mt-0.5 leading-relaxed">
                                    To provide fast, reliable, and secure infrastructure for modern web applications globally.
                                </p>
                            </div>
                        </div>

                        {/* Professional Team */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 shrink-0 bg-gray-950 dark:bg-white text-white dark:text-gray-950 flex items-center justify-center rounded-xl font-bold text-sm shadow-sm">
                                👥
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-gray-950 dark:text-white">Professional Team</h4>
                                <p className="text-gray-400 dark:text-gray-400 text-xs font-semibold mt-0.5 leading-relaxed">
                                    A dedicated global team of software engineers, UI/UX designers, and data analysts.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* O'ng rasm va tajriba badge qismi */}
                <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-xl border border-gray-100/50 dark:border-gray-800 relative group">
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2340&auto=format&fit=crop"
                        alt="Our Team Working"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 via-transparent to-transparent"></div>

                    <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg border border-white/20 dark:border-gray-800 flex items-center gap-3">
                        <span className="text-2xl font-black text-gray-900 dark:text-white">5+</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 leading-tight block">Years of<br />Experience</span>
                    </div>
                </div>

            </div>
        </div>)
}
