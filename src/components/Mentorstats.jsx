import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import AOS from 'aos';
import 'aos/dist/aos.css';

const staticMentorsData = [
    {
        id: 1,
        name: "Ruxillo Asrorov",
        role: "Frontend Developer & Mentor",
        experience: "4+ yil tajriba",
        bio: "Frontend yo'nalishi bo'yicha yuqori darajadagi mutaxassis va tajribali ustoz.",
        skills: ["React", "JavaScript", "TypeScript", "Tailwind CSS"],
        image: "/photo_2026-07-23_23-14-12.jpg",
        telegram: "https://t.me/rukhillo",
        birthYear: 2005,
        age: 21,
        certificates: [
            { title: "React Advanced Certificate", year: "2024", issuedBy: "Google Developer" },
            { title: "JavaScript Professional", year: "2023", issuedBy: "Meta" }
        ],
        fullBio: "Frontend yo'nalishi bo'yicha 4 yildan ortiq tajribaga ega. Hozirgacha 50 dan ortiq muvaffaqiyatli veb-ilovalarni yaratgan va yuzlab o'quvchilarga ustozlik qilgan."
    }
];

export default function Mentorstats() {
    const { t } = useTranslation();
    const [modal, setModal] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState("");
    const [toast, setToast] = useState(false);
    const [activeMentorDetail, setActiveMentorDetail] = useState(null);

    const detailTopRef = useRef(null);

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

    const translatedMentors = t('mentorsPage.list', { returnObjects: true }) || [];

    const mentorsData = staticMentorsData.map((staticMentor, index) => {
        const trans = translatedMentors[index] || {};
        return {
            ...staticMentor,
            name: trans.name || staticMentor.name,
            role: trans.role || staticMentor.role,
            experience: trans.experience || staticMentor.experience,
            bio: trans.bio || staticMentor.bio,
            skills: trans.skills || staticMentor.skills,
        };
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setModal(false);
        setToast(true);
        setTimeout(() => {
            setToast(false);
        }, 3000);
    };

    const renderModal = () => (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md relative text-gray-900 dark:text-white shadow-2xl transform transition-all duration-300">
                <button
                    type="button"
                    onClick={() => setModal(false)}
                    className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-xl flex items-center justify-center text-sm font-bold cursor-pointer transition transform hover:rotate-90 duration-300"
                    title="Yopish"
                >
                    ✕
                </button>

                <h3 className="text-xl font-bold mb-1 pr-6">{t('aboutMentors.modalTitle') || "Mentor bilan bog'lanish"}</h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm mb-5">
                    {t('aboutMentors.selectedTeacher') || "Tanlangan ustoz:"} <span className="text-red-600 dark:text-red-400 font-medium">{selectedMentor}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">{t('aboutMentors.nameLabel') || "Ismingiz"}</label>
                        <input
                            type="text"
                            required
                            placeholder={t('aboutMentors.namePlaceholder') || "Ismingizni kiriting"}
                            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-500 transition-all duration-200 focus:ring-2 focus:ring-red-500/20"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">{t('aboutMentors.phoneLabel') || "Telefon raqamingiz"}</label>
                        <input
                            type="tel"
                            required
                            placeholder="+998 90 123 45 67"
                            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-500 transition-all duration-200 focus:ring-2 focus:ring-red-500/20"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-medium py-2.5 rounded-xl transition-all duration-200 text-sm cursor-pointer shadow-lg shadow-red-600/25"
                    >
                        {t('aboutMentors.submitBtn') || "Yuborish"}
                    </button>
                </form>
            </div>
        </div>
    );

    const renderToast = () => (
        <div className="fixed bottom-5 right-5 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl z-50 text-sm font-medium flex items-center gap-3">
            <span className="text-base">✅</span>
            <span>{t('aboutMentors.successToast') || "Muvaffaqiyatli yuborildi!"}</span>
        </div>
    );

    if (activeMentorDetail) {
        return (
            <div ref={detailTopRef} className="bg-white dark:bg-[#090623] min-h-screen py-12 px-4 md:px-8 text-gray-900 dark:text-white transition-colors">
                <div className="max-w-2xl mx-auto">
                    {/* Scroll qilganda ham tepada qotib turishi uchun sticky qilindi */}
                    <div className="sticky top-6 z-20 mb-6">
                        <button
                            onClick={() => setActiveMentorDetail(null)}
                            className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-800 dark:text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
                        >
                            <span className="transition-transform duration-200 hover:-translate-x-1">←</span> {t('aboutMentors.backBtn') || "Orqaga qaytish"}
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-700 shadow-md mb-4 group">
                                <img
                                    src={activeMentorDetail.image}
                                    alt={activeMentorDetail.name}
                                    className="w-44 h-44 sm:w-52 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{activeMentorDetail.name}</h1>
                            <p className="text-red-600 dark:text-red-400 font-medium text-base mb-2">{activeMentorDetail.role}</p>

                            <span className="text-xs bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3.5 py-1.5 rounded-lg font-medium border border-red-100 dark:border-red-500/20 mb-4 shadow-sm">
                                {activeMentorDetail.experience}
                            </span>

                            <a
                                href="https://t.me/rukhillo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-sky-500/25 active:scale-95"
                            >
                                {t('aboutMentors.telegramBtn') || "Telegram orqali bog'lanish"}
                            </a>
                        </div>

                        <div className="border-t border-gray-100 dark:border-slate-800 pt-6 space-y-6">
                            <div className="flex justify-center gap-6 text-sm bg-gray-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-gray-200 dark:border-slate-700/60">
                                <div><span className="text-gray-500">{t('aboutMentors.birthYearLabel') || "Tug'ilgan yil:"}</span> <strong className="text-gray-900 dark:text-white ml-1">{activeMentorDetail.birthYear}</strong></div>
                                <div className="text-gray-300 dark:text-slate-700">•</div>
                                <div><span className="text-gray-500">{t('aboutMentors.ageLabel') || "Yosh:"}</span> <strong className="text-gray-900 dark:text-white ml-1">{activeMentorDetail.age} {t('aboutMentors.yearsOld') || "yosh"}</strong></div>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">{t('aboutMentors.specialtyLabel') || "Haqida"}</h4>
                                <p className="text-gray-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                                    {activeMentorDetail.fullBio}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2 uppercase tracking-wider">{t('aboutMentors.specialtyLabel') || "Mutaxassislik yo'nalishlari:"}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {activeMentorDetail.skills && activeMentorDetail.skills.map((skill, index) => (
                                        <span key={index} className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-xs px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 transition hover:border-red-500/40">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-3 uppercase tracking-wider">{t('aboutMentors.certificatesTitle') || "Olingan sertifikatlar"}</h4>
                                <div className="space-y-4">
                                    {activeMentorDetail.certificates.map((cert, index) => (
                                        <div key={index} className="bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700/60 p-5 rounded-2xl transition-all duration-300 hover:border-red-500/50 hover:shadow-md">
                                            <h5 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-1">{cert.title}</h5>
                                            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{cert.issuedBy} • {cert.year}</p>
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
                                    className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-medium px-8 py-3.5 text-sm rounded-xl transition-all duration-200 w-full sm:w-auto cursor-pointer shadow-lg shadow-red-600/25"
                                >
                                    {t('aboutMentors.contactBtn') || "Bog'lanish"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {modal && renderModal()}
                {toast && renderToast()}
            </div>
        );
    }

    return (
        <div className="pt-10">
            <section className="bg-white dark:bg-[#090623] py-20 px-4 md:px-8 text-gray-900 dark:text-white transition-colors">
                <div className="max-w-4xl mx-auto" data-aos="fade-up">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-2">{t('aboutMentors.sectionTitle') || "Bizning Mentor"}</h2>
                        <p className="text-gray-500 dark:text-slate-400 text-sm md:text-base">
                            {t('aboutMentors.sectionDesc') || "Tajribali mutaxassisdan zamonaviy kasblarni o'rganing."}
                        </p>
                    </div>

                    <div className="max-w-md mx-auto">
                        {mentorsData.map((mentor) => (
                            <div
                                key={mentor.id}
                                data-aos="zoom-in"
                                data-aos-duration="500"
                                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-red-500/30 group"
                            >
                                <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-700 shadow-md mb-4 mx-auto w-44 h-44 sm:w-52 sm:h-52">
                                    <img
                                        src={mentor.image}
                                        alt={mentor.name}
                                        className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                                        onClick={() => setActiveMentorDetail(mentor)}
                                    />
                                </div>

                                <h3
                                    onClick={() => setActiveMentorDetail(mentor)}
                                    className="text-xl sm:text-2xl font-bold cursor-pointer hover:text-red-500 transition-colors duration-200 mb-1"
                                >
                                    {mentor.name}
                                </h3>

                                <p className="text-red-600 dark:text-red-400 text-sm font-medium mb-2">{mentor.role}</p>

                                <span className="inline-block text-xs bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3.5 py-1.5 rounded-lg font-medium border border-red-100 dark:border-red-500/20 mb-3 shadow-sm">
                                    {mentor.experience}
                                </span>

                                <p className="text-gray-500 dark:text-slate-400 text-sm mb-5 line-clamp-2">{mentor.bio}</p>

                                <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                                    {mentor.skills && mentor.skills.map((skill, i) => (
                                        <span key={i} className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-xs px-3 py-1 rounded-xl border border-gray-200 dark:border-slate-700 transition hover:border-red-500/40">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-2.5">
                                    <button
                                        onClick={() => setActiveMentorDetail(mentor)}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-white text-xs font-semibold py-3 rounded-xl transition-all duration-200 cursor-pointer active:scale-95"
                                    >
                                        {t('aboutMentors.detailsBtn') || "Batafsil"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedMentor(mentor.name);
                                            setModal(true);
                                        }}
                                        className="flex-1 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-semibold py-3 rounded-xl transition-all duration-200 cursor-pointer shadow-md shadow-red-600/20"
                                    >
                                        {t('aboutMentors.contactBtn') || "Bog'lanish"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {modal && renderModal()}
                {toast && renderToast()}
            </section>
        </div>
    );
}