import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaPhoneAlt, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import AOS from 'aos';
import 'aos/dist/aos.css';

const staticMentorsData = [
    {
        id: 1,
        name: "Ruxillo Asrorov",
        role: "English Teacher & IELTS Expert",
        experience: "4+ yil tajriba",
        bio: "Ingliz tili va IELTS imtihoniga tayyorlash bo'yicha yuqori darajadagi malakali mutaxassis.",
        skills: ["IELTS 8.0+", "CEFR C1", "Grammar & Speaking", "Business English"],
        image: "/photo_2026-07-23_23-14-12.jpg",
        telegram: "https://t.me/rukhillo",
        birthYear: 2005,
        age: 21,
        certificates: [
            { title: "IELTS Indicator / General Certificate - 8.0", year: "2024", issuedBy: "British Council" },
            { title: "TESOL / TEFL Professional Certificate", year: "2023", issuedBy: "International Open Academy" }
        ],
        fullBio: "Ingliz tili va IELTS yo'nalishi bo'yicha 4 yildan ortiq tajribaga ega. Hozirgacha yuzlab o'quvchilarga ingliz tilini mukammal o'rganishda va xalqaro sertifikatlarni qo'lga kiritishda yaqindan ko'maklashgan."
    }
];

export default function Mentorstats() {
    const { t } = useTranslation();
    const [modal, setModal] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState("");
    const [activeMentorDetail, setActiveMentorDetail] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const detailTopRef = useRef(null);

    // Yangi Bot Tokeni (rasmdan olindi)
    const BOT_TOKEN = "8746561523:AAFkkkdkPw1t4JyRJDGkr1QTfKQKnwUcef4";

    // Admin Chat ID (rasmdan olindi: 6383523156)
    const ADMIN_CHAT_IDS = ["6383523156", "334572168"];

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 100,
        });
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (detailTopRef.current) {
            detailTopRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeMentorDetail]);

    const mentorsData = staticMentorsData;

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 3500);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const numbers = value.replace(/\D/g, '').slice(0, 9);
            setFormData({ ...formData, phone: numbers });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.phone.length < 9) {
            showToast("Iltimos, telefon raqamni to'liq kiriting!", "error");
            return;
        }

        setLoading(true);

        const message = `
🔔 @OPTIMUM_teacher_bot orqali yangi murojaat!

👨‍🏫 Ustoz: ${selectedMentor}
👤 F.I.O: ${formData.fullName}
📞 Telefon: +998 ${formData.phone}
        `;

        try {
            const promises = ADMIN_CHAT_IDS.map(chatId =>
                fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: message,
                        parse_mode: 'Markdown'
                    }),
                })
            );

            const responses = await Promise.all(promises);
            const allSuccess = responses.every(res => res.ok);

            if (allSuccess) {
                showToast("Muvaffaqiyatli yuborildi!", "success");
                setFormData({ fullName: '', phone: '' });
                setModal(false);
            } else {
                showToast("Xatolik yuz berdi. Qaytadan urinib ko'ring.", "error");
            }
        } catch (error) {
            console.error("Xatolik:", error);
            showToast("Tarmoqda xatolik yuz berdi.", "error");
        } finally {
            setLoading(false);
        }
    };

    const renderModal = () => (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white/90 dark:bg-[#070b14]/90 backdrop-blur-2xl border border-gray-200/80 dark:border-white/10 rounded-[28px] p-6 sm:p-8 w-full max-w-md relative text-gray-900 dark:text-white shadow-2xl"
            >
                <button
                    type="button"
                    onClick={() => setModal(false)}
                    className="absolute top-4 right-4 w-9 h-9 bg-gray-100/85 hover:bg-gray-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-gray-600 dark:text-slate-300 rounded-2xl flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-300 hover:rotate-90"
                    title="Yopish"
                >
                    ✕
                </button>

                <h3 className="text-xl font-extrabold mb-1 pr-6 tracking-tight">Ustoz bilan bog'lanish</h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
                    Tanlangan ustoz: <span className="text-[#c41e30] font-semibold">{selectedMentor}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">Ismingiz</label>
                        <div className="relative flex items-center">
                            <FaUser className="absolute left-4 text-gray-400" />
                            <input
                                type="text"
                                name="fullName"
                                required
                                placeholder="Ismingizni kiriting"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50/80 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#c41e30] transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">Telefon raqamingiz</label>
                        <div className="relative flex items-center">
                            <FaPhoneAlt className="absolute left-4 text-gray-400 z-10" />
                            <div className="absolute left-11 flex items-center pointer-events-none text-sm font-semibold text-gray-500 dark:text-gray-400">
                                +998
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                required
                                placeholder="901234567"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-24 pr-4 py-3.5 rounded-2xl bg-gray-50/80 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#c41e30] transition-all"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-4 rounded-2xl bg-[#c41e30] hover:bg-[#a51827] text-white font-bold text-sm shadow-lg shadow-[#c41e30]/25 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70 transition-all"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Yuborish</span>
                                <FaPaperPlane className="w-3.5 h-3.5" />
                            </>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );

    const renderToast = () => (
        <AnimatePresence>
            {toast && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl shadow-2xl border border-gray-200/80 dark:border-white/10 text-gray-900 dark:text-white"
                >
                    {toast.type === 'success' ? (
                        <FaCheckCircle className="text-emerald-500 text-xl shrink-0" />
                    ) : (
                        <FaExclamationCircle className="text-red-500 text-xl shrink-0" />
                    )}
                    <p className="text-sm font-semibold">{toast.message}</p>
                </motion.div>
            )}
        </AnimatePresence>
    );

    if (activeMentorDetail) {
        return (
            <div ref={detailTopRef} className="font-['Plus_Jakarta_Sans',sans-serif] bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-[#060417] dark:via-[#090623] dark:to-[#050314] min-h-screen py-12 px-4 md:px-8 text-gray-900 dark:text-white transition-colors">
                <div className="max-w-2xl mx-auto">
                    <div className="sticky top-6 z-20 mb-6">
                        <button
                            onClick={() => setActiveMentorDetail(null)}
                            className="inline-flex items-center gap-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-gray-200/80 dark:border-slate-800/80 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-800 dark:text-slate-200 px-4.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-black/5 active:scale-95 group"
                        >
                            <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span> Orqaga qaytish
                        </button>
                    </div>

                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-slate-800/80 rounded-[32px] p-6 sm:p-10 shadow-2xl shadow-black/5 transition-all duration-300">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="relative group mb-5">
                                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-[28px] blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
                                <div className="relative overflow-hidden rounded-[24px] border border-gray-200 dark:border-slate-700 shadow-xl">
                                    <img
                                        src={activeMentorDetail.image}
                                        alt={activeMentorDetail.name}
                                        className="w-44 h-44 sm:w-52 sm:h-52 object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">{activeMentorDetail.name}</h1>
                            <p className="text-red-600 dark:text-red-400 font-semibold text-base mb-3">{activeMentorDetail.role}</p>

                            <span className="text-xs bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-1.5 rounded-xl font-bold border border-red-100 dark:border-red-500/20 mb-4 shadow-sm">
                                {activeMentorDetail.experience}
                            </span>

                            <a
                                href={activeMentorDetail.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-sky-500/20 active:scale-95"
                            >
                                <span>💬</span> {t('mentorsPage.connectBtn', "Telegram orqali bog'lanish")}
                            </a>
                        </div>

                        <div className="border-t border-gray-100 dark:border-slate-800/80 pt-8 space-y-8">
                            <div className="flex justify-center gap-8 text-sm bg-gray-50/60 dark:bg-slate-800/40 p-4 rounded-2xl border border-gray-200/60 dark:border-slate-700/50">
                                <div><span className="text-gray-400 font-medium">Tug'ilgan yil:</span> <strong className="text-gray-900 dark:text-white font-bold ml-1">{activeMentorDetail.birthYear}</strong></div>
                                <div className="text-gray-300 dark:text-slate-700">•</div>
                                <div><span className="text-gray-400 font-medium">Yosh:</span> <strong className="text-gray-900 dark:text-white font-bold ml-1">{activeMentorDetail.age} yosh</strong></div>
                            </div>

                            <div>
                                <h4 className="text-xs font-extrabold text-gray-400 dark:text-slate-500 mb-2 uppercase tracking-widest">Haqida</h4>
                                <p className="text-gray-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
                                    {activeMentorDetail.fullBio}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xs font-extrabold text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest">Mutaxassislik yo'nalishlari</h4>
                                <div className="flex flex-wrap gap-2">
                                    {activeMentorDetail.skills && activeMentorDetail.skills.map((skill, index) => (
                                        <span key={index} className="bg-gray-100/80 dark:bg-slate-800/80 text-gray-700 dark:text-slate-300 text-xs px-4 py-2 rounded-xl font-semibold border border-gray-200 dark:border-slate-700/80 transition-all hover:border-red-500/40 hover:shadow-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-extrabold text-gray-400 dark:text-slate-500 mb-4 uppercase tracking-widest">Olingan sertifikatlar</h4>
                                <div className="space-y-3.5">
                                    {activeMentorDetail.certificates.map((cert, index) => (
                                        <div key={index} className="bg-gray-50/50 dark:bg-slate-800/40 border border-gray-200/80 dark:border-slate-700/60 p-5 rounded-2xl transition-all duration-300 hover:border-red-500/50 hover:shadow-lg hover:bg-white dark:hover:bg-slate-800">
                                            <h5 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white mb-1">{cert.title}</h5>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 font-semibold">{cert.issuedBy} • {cert.year}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 text-center">
                                <button
                                    onClick={() => {
                                        setSelectedMentor(activeMentorDetail.name);
                                        setModal(true);
                                    }}
                                    className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-95 text-white font-semibold px-10 py-4 text-sm rounded-2xl transition-all duration-200 w-full sm:w-auto cursor-pointer shadow-xl shadow-red-600/25"
                                >
                                    {t('mentors.contactBtn', 'Bog\'lanish')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {modal && renderModal()}
                {renderToast()}
            </div>
        );
    }

    return (
        <div className="font-['Plus_Jakarta_Sans',sans-serif] pt-10">
            <section className="bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-[#060417] dark:via-[#090623] dark:to-[#050314] py-20 px-4 md:px-8 text-gray-900 dark:text-white transition-colors">
                <div className="max-w-4xl mx-auto" data-aos="fade-up">
                    <div className="text-center mb-14">
                        <span className="text-xs font-extrabold text-red-600 dark:text-red-400 uppercase tracking-widest bg-red-50 dark:bg-red-500/10 px-4 py-1.5 rounded-full border border-red-100 dark:border-red-500/20 inline-block mb-3 shadow-sm">
                            Mentorlar
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Bizning Mentor</h2>
                        <p className="text-gray-500 dark:text-slate-400 text-sm md:text-base max-w-lg mx-auto font-medium">
                            Tajribali ingliz tili mutaxassisidan xalqaro darajadagi bilimlarni o'rganing.
                        </p>
                    </div>

                    <div className="max-w-md mx-auto">
                        {mentorsData.map((mentor) => (
                            <div
                                key={mentor.id}
                                data-aos="zoom-in"
                                data-aos-duration="500"
                                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200/80 dark:border-slate-800/80 rounded-[32px] p-6 sm:p-8 text-center shadow-2xl shadow-black/5 transition-all duration-300 hover:shadow-3xl hover:border-red-500/40 group"
                            >
                                <div className="relative mb-5 mx-auto w-44 h-44 sm:w-52 sm:h-52">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-[28px] blur opacity-25 group-hover:opacity-60 transition duration-500"></div>
                                    <div className="relative overflow-hidden rounded-[24px] border border-gray-200 dark:border-slate-700 shadow-md w-full h-full">
                                        <img
                                            src={mentor.image}
                                            alt={mentor.name}
                                            className="w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-105"
                                            onClick={() => setActiveMentorDetail(mentor)}
                                        />
                                    </div>
                                </div>

                                <h3
                                    onClick={() => setActiveMentorDetail(mentor)}
                                    className="text-xl sm:text-2xl font-extrabold cursor-pointer hover:text-red-500 transition-colors duration-200 mb-1 tracking-tight"
                                >
                                    {mentor.name}
                                </h3>

                                <p className="text-red-600 dark:text-red-400 text-sm font-semibold mb-2.5">{mentor.role}</p>

                                <span className="inline-block text-xs bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3.5 py-1.5 rounded-xl font-bold border border-red-100 dark:border-red-500/20 mb-4 shadow-sm">
                                    {mentor.experience}
                                </span>

                                <p className="text-gray-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 font-medium">{mentor.bio}</p>

                                <div className="flex flex-wrap justify-center gap-2 mb-8">
                                    {mentor.skills && mentor.skills.map((skill, i) => (
                                        <span key={i} className="bg-gray-100/80 dark:bg-slate-800/80 text-gray-700 dark:text-slate-300 text-xs px-3.5 py-1.5 rounded-xl font-semibold border border-gray-200 dark:border-slate-700/80 transition hover:border-red-500/40">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setActiveMentorDetail(mentor)}
                                        className="flex-1 bg-gray-100/80 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-white text-xs font-bold py-3.5 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 border border-gray-200/50 dark:border-slate-700/50"
                                    >
                                        Batafsil
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedMentor(mentor.name);
                                            setModal(true);
                                        }}
                                        className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-95 text-white text-xs font-bold py-3.5 rounded-2xl transition-all duration-200 cursor-pointer shadow-lg shadow-red-600/25"
                                    >
                                        Bog'lanish
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {modal && renderModal()}
                {renderToast()}
            </section>
        </div>
    );
}