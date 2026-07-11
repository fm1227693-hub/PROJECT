import React from 'react'

export default function Sec4() {
    return (
   <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-[96px] mb-24 select-none font-sans transition-colors duration-200">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        <div className="flex flex-col space-y-6 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-xs font-semibold w-fit">
                Biz haqimizda
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                Ingliz tilini zamonaviy va <span className="text-red-600 dark:text-red-400">oson usullar</span> bilan o'rgatamiz.
            </h2>

            <p className="text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                Optimum School of English jamoasi til o'rganish jarayonini zerikarli yod olishlardan xoli qilib, real muloqotga asoslangan qiziqarli muhitni taqdim etadi.
            </p>

            <div className="space-y-4 pt-2">
                <div className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 bg-red-600 text-white flex items-center justify-center rounded-xl font-bold text-sm shadow-sm">
                        🎯
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-gray-950 dark:text-white">Bizning Maqsadimiz</h4>
                        <p className="text-gray-400 dark:text-gray-400 text-xs font-semibold mt-0.5 leading-relaxed">
                            Har bir o'quvchiga sifatli ta'lim berib, ularning kelajakdagi muvaffaqiyatiga poydevor qo'yish.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 bg-red-600 text-white flex items-center justify-center rounded-xl font-bold text-sm shadow-sm">
                        👨‍🏫
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-gray-950 dark:text-white">Malakali Ustozlar</h4>
                        <p className="text-gray-400 dark:text-gray-400 text-xs font-semibold mt-0.5 leading-relaxed">
                            Xalqaro sertifikatlar va ko'p yillik tajribaga ega professional o'qituvchilar jamoasi.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-xl border border-gray-100/50 dark:border-gray-800 relative group">
            <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2340&auto=format&fit=crop"
                alt="Students studying English"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/30 via-transparent to-transparent"></div>

            <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg border border-white/20 dark:border-gray-800 flex items-center gap-3">
                <span className="text-2xl font-black text-red-600 dark:text-red-400">5+</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 leading-tight block">Yillik<br />Tajriba</span>
            </div>
        </div>

    </div>
</div>)
}
