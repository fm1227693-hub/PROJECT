import React from 'react'

export default function AboutUs() {
    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 mb-24 select-none font-sans transition-colors duration-200">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
                <div className="lg:col-span-5">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-full">
                        Biz haqimizda
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-950 dark:text-white mt-4 tracking-tight leading-[1.15]">
                        Kelajak avlod ta'lim platformasini birgalikda quramiz.
                    </h2>
                </div>
                <div className="lg:col-span-7 flex flex-col space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 font-medium text-base md:text-lg leading-relaxed">
                        Oddiy kuzatuvdan boshladik: ko'pchilik til o'rganish markazlari va platformalari yoki zerikarli, yoki so'zlashuv amaliyoti uchun juda cheklangan. Biz bu bo'shliqni butunlay yo'q qilish uchun markazimizni barpo etdik.
                    </p>
                    <p className="text-gray-400 dark:text-gray-400 font-semibold text-sm leading-relaxed">
                        Bizning yondashuvimiz ilg'or dars metodikasini o'quvchiga yo'naltirilgan qulay muhit bilan birlashtirib, zerikarli yodlashlarga emas, balki real vaqtda ravon muloqot qilishga imkon beradi.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">

                <div className="bg-gray-50/60 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl flex flex-col justify-between hover:bg-white dark:hover:bg-gray-900 hover:shadow-xl dark:hover:shadow-2xl hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300">
                    <div>
                        <div className="w-12 h-12 bg-gray-950 dark:bg-gray-800 text-white flex items-center justify-center rounded-2xl text-lg font-bold mb-6 shadow-sm">
                            ⚡
                        </div>
                        <h3 className="text-xl font-black text-gray-950 dark:text-white mb-2">Tezkor natija</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                            Maxsus ishlab chiqilgan intensiv dasturlar qisqa fursatda sezilarli til ko'rsatkichlariga erishishni ta'minlaydi.
                        </p>
                    </div>
                    <span className="text-xs font-bold text-red-600 dark:text-red-400 mt-6 block uppercase tracking-wider">Asosiy tamoyil I</span>
                </div>

                <div className="bg-gray-950 dark:bg-gray-900 text-white p-8 rounded-3xl flex flex-col justify-between shadow-xl relative overflow-hidden border border-gray-800 dark:border-gray-800">
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>
                    <div>
                        <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center rounded-2xl text-lg font-bold mb-6 shadow-md shadow-red-500/20">
                            🎯
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">Amaliy yondashuv</h3>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            Darslarning asosiy qismi jonli muloqot va so'zlashuvga qaratilgan bo'lib, til to'sig'ini qisqa vaqtda yengishga yordam beradi.
                        </p>
                    </div>
                    <span className="text-xs font-bold text-red-400 mt-6 block uppercase tracking-wider">Asosiy tamoyil II</span>
                </div>

                <div className="bg-gray-50/60 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl flex flex-col justify-between hover:bg-white dark:hover:bg-gray-900 hover:shadow-xl dark:hover:shadow-2xl hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300">
                    <div>
                        <div className="w-12 h-12 bg-gray-950 dark:bg-gray-800 text-white flex items-center justify-center rounded-2xl text-lg font-bold mb-6 shadow-sm">
                            ✨
                        </div>
                        <h3 className="text-xl font-black text-gray-950 dark:text-white mb-2">Mukammallik sari</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                            Har bir o'quvchining shaxsiy xatolari va kamchiliklari ustida alohida ishlanib, yuqori natijalarga olib chiqiladi.
                        </p>
                    </div>
                    <span className="text-xs font-bold text-red-600 dark:text-red-400 mt-6 block uppercase tracking-wider">Asosiy tamoyil III</span>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 bg-gray-50/60 dark:bg-gray-950/50 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl">
                <div className="space-y-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-full">
                        Bizning Manzil
                    </span>
                    <h3 className="text-3xl font-black text-gray-950 dark:text-white tracking-tight">
                        Bizni shu yerda topasiz
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium text-base leading-relaxed">
                        O'zbekiston, Buxoro shahri, "Buxoro davlat tibbiyot bilim yurti" majmuasi yaqinida joylashganmiz. Bizning zamonaviy va shinam o'quv markazimiz siz uchun har doim ochiq. Kelib, o'quv jarayonlarimiz bilan yaqindan tanishing!
                    </p>
                    <div className="space-y-4 mt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm">
                                📍
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                                Buxoro, O'zbekiston
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm">
                                📞
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                                +998 90 082 99 79
                            </span>
                        </div>
                    </div>
                </div>
                <div className="relative w-full h-72 md:h-80 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 group">
                    <img 
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop" 
                        alt="Bizning ofisimiz va o'quv markazimiz" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-red-50/40 via-gray-50/50 to-red-50/30 dark:from-red-950/20 dark:via-gray-950 dark:to-red-950/20 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2 max-w-xl text-center md:text-left">
                    <h4 className="text-2xl font-black text-gray-950 dark:text-white">Maqsad sari birgalikda, ishonch bilan.</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                        Bizning tajribali ustozlar jamoamiz o'quvchilarga doimiy ko'mak berib, yuqori sertifikatlar va erkin muloqot darajasiga erishishlarini ta'minlaydi.
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-8 shrink-0">
                    <div className="text-center">
                        <span className="block text-3xl md:text-4xl font-black text-gray-950 dark:text-white">100%</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Murosasiz sifat</span>
                    </div>
                    <div className="w-px h-10 bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>
                    <div className="text-center">
                        <span className="block text-3xl md:text-4xl font-black text-red-600 dark:text-red-400">7/24</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Qo'llab-quvvatlash</span>
                    </div>
                </div>
            </div>

        </div>
    )
}