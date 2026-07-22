import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const staticMentorsData = [
    {
        id: 1,
        name: "Akmal Rahimov",
        role: "Frontend Developer & Mentor",
        experience: "4+ yil tajriba",
        bio: "Frontend yo'nalishi bo'yicha yuqori darajadagi mutaxassis va tajribali ustoz.",
        skills: ["React", "JavaScript", "TypeScript", "Tailwind CSS"],
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
        telegram: "https://t.me/username",
        birthYear: 2005,
        age: 21,
        certificates: [
            { title: "React Advanced Certificate", year: "2024", issuedBy: "Google Developer" },
            { title: "JavaScript Professional", year: "2023", issuedBy: "Meta" }
        ],
        fullBio: "Frontend yo'nalishi bo'yicha 4 yildan ortiq tajribaga ega. Hozirgacha 50 dan ortiq muvaffaqiyatli veb-ilovalarni yaratgan va yuzlab o'quvchilarga ustozlik qilgan."
    },
    {
        id: 2,
        name: "Jasur Karimov",
        role: "Full-Stack Developer",
        experience: "5+ yil tajriba",
        bio: "Backend va zamonaviy veb texnologiyalar mutaxassisi, arxitektor.",
        skills: ["Node.js", "React", "MongoDB", "Express"],
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
        telegram: "https://t.me/username",
        birthYear: 2004,
        age: 22,
        certificates: [
            { title: "Full-Stack Web Development", year: "2024", issuedBy: "Amazon" },
            { title: "UI/UX Design Master", year: "2023", issuedBy: "Coursera" }
        ],
        fullBio: "Backend va zamonaviy veb texnologiyalar mutaxassisi. Murakkab arxitekturaga ega tizimlarni loyihalashtirish bo'yicha katta tajribaga ega."
    },
    {
        id: 3,
        name: "Timur Sobirov",
        role: "Backend Developer",
        experience: "3+ yil tajriba",
        bio: "Ma'lumotlar bazasi va server xavfsizligi bo'yicha mutaxassis.",
        skills: ["Python", "Django", "PostgreSQL", "Docker"],
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
        telegram: "https://t.me/username",
        birthYear: 2003,
        age: 23,
        certificates: [
            { title: "Python Professional", year: "2024", issuedBy: "EPAM" }
        ],
        fullBio: "Server arxitekturasi va API xizmatlarini yaratish bo'yicha kuchli tajribaga ega."
    },
    {
        id: 4,
        name: "Sardor Alimov",
        role: "UI/UX Designer & Frontend",
        experience: "3+ yil tajriba",
        bio: "Foydalanuvchilarga qulay interfeyslar va zamonaviy veb-dizaynlar yaratadi.",
        skills: ["Figma", "UI/UX", "React", "CSS"],
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop",
        telegram: "https://t.me/username",
        birthYear: 2006,
        age: 20,
        certificates: [
            { title: "UI/UX Expert", year: "2025", issuedBy: "Google" }
        ],
        fullBio: "Dizayn va kod uyg'unligida ajoyib loyihalarni taqdim etuvchi yosh mutaxassis."
    }
];

export default function StaticMentors() {
    const { t } = useTranslation();
    const [modal, setModal] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState("");
    const [toast, setToast] = useState(false);
    const [activeMentorDetail, setActiveMentorDetail] = useState(null);

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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-8 w-full max-w-lg relative text-gray-900 dark:text-white shadow-2xl">
                <button
                    type="button"
                    onClick={() => setModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl font-bold cursor-pointer"
                >
                    ✕
                </button>

                <h3 className="text-2xl font-bold mb-2">{t('aboutMentors.modalTitle') || "Mentor bilan bog'lanish"}</h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-6">
                    {t('aboutMentors.selectedTeacher') || "Tanlangan ustoz:"} <span className="text-red-600 dark:text-red-400 font-medium">{selectedMentor}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm text-gray-700 dark:text-slate-300 mb-1.5">{t('aboutMentors.nameLabel') || "Ismingiz"}</label>
                        <input
                            type="text"
                            required
                            placeholder={t('aboutMentors.namePlaceholder') || "Ismingizni kiriting"}
                            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-red-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 dark:text-slate-300 mb-1.5">{t('aboutMentors.phoneLabel') || "Telefon raqamingiz"}</label>
                        <input
                            type="tel"
                            required
                            placeholder="+998 90 123 45 67"
                            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-red-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition cursor-pointer shadow-md"
                    >
                        {t('aboutMentors.submitBtn') || "Yuborish"}
                    </button>
                </form>
            </div>
        </div>
    );

    const renderToast = () => (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-bounce">
            <span>✅ {t('aboutMentors.successToast') || "Muvaffaqiyatli yuborildi!"}</span>
        </div>
    );

    if (activeMentorDetail) {
        return (
            <div className="bg-white dark:bg-[#090623] min-h-screen py-16 px-4 md:px-12 text-gray-900 dark:text-white transition-colors duration-200">
                <div className="max-w-5xl mx-auto">
                    <button
                        onClick={() => setActiveMentorDetail(null)}
                        className="mb-8 flex items-center gap-2 text-base font-medium text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                    >
                        ← {t('aboutMentors.backBtn') || "Orqaga qaytish"}
                    </button>

                    <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
                        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                            <div className="w-full md:w-1/3 flex flex-col items-center">
                                <img
                                    src={activeMentorDetail.image}
                                    alt={activeMentorDetail.name}
                                    className="w-52 h-52 sm:w-60 sm:h-60 rounded-3xl object-cover border-4 border-red-500/20 shadow-xl mb-6"
                                />
                                <a
                                    href={activeMentorDetail.telegram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full text-center bg-sky-500 hover:bg-sky-600 text-white text-base font-medium py-3 rounded-xl transition shadow-md"
                                >
                                    {t('aboutMentors.telegramBtn') || "Telegram orqali bog'lanish"}
                                </a>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                    <h1 className="text-3xl sm:text-4xl font-bold">{activeMentorDetail.name}</h1>
                                    <span className="text-sm bg-red-500/10 text-red-500 dark:text-red-400 px-4 py-1.5 rounded-full font-medium w-fit mx-auto md:mx-0">
                                        {activeMentorDetail.experience}
                                    </span>
                                </div>

                                <p className="text-red-600 dark:text-red-400 text-lg font-medium mb-5">{activeMentorDetail.role}</p>

                                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6 text-base bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
                                    <div><span className="text-gray-500">{t('aboutMentors.birthYearLabel') || "Tug'ilgan yil:"}</span> <strong className="text-gray-900 dark:text-white">{activeMentorDetail.birthYear}</strong></div>
                                    <div>•</div>
                                    <div><span className="text-gray-500">{t('aboutMentors.ageLabel') || "Yosh:"}</span> <strong className="text-gray-900 dark:text-white">{activeMentorDetail.age} {t('aboutMentors.yearsOld') || "yosh"}</strong></div>
                                </div>

                                <p className="text-gray-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
                                    {activeMentorDetail.fullBio}
                                </p>

                                <div className="mb-6">
                                    <h4 className="text-base font-semibold text-gray-700 dark:text-slate-300 mb-3">{t('aboutMentors.specialtyLabel') || "Mutaxassislik yo'nalishlari:"}</h4>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2.5">
                                        {activeMentorDetail.skills && activeMentorDetail.skills.map((skill, index) => (
                                            <span key={index} className="bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-sm px-4 py-2 rounded-xl">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-10 border-t border-gray-200 dark:border-slate-800">
                            <h3 className="text-2xl font-bold mb-6 text-center md:text-left">{t('aboutMentors.certificatesTitle') || "Sertifikatlar va yutuqlar"}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {activeMentorDetail.certificates.map((cert, index) => (
                                    <div key={index} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-5 rounded-2xl flex items-start gap-4 shadow-sm">
                                        <span className="text-3xl">📜</span>
                                        <div>
                                            <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">{cert.title}</h4>
                                            <p className="text-sm text-gray-500 dark:text-slate-400">{cert.issuedBy} • {cert.year}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-10 text-center">
                            <button
                                onClick={() => {
                                    setSelectedMentor(activeMentorDetail.name);
                                    setModal(true);
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white font-medium px-10 py-4 text-lg rounded-2xl transition w-full sm:w-auto shadow-lg cursor-pointer"
                            >
                                {t('aboutMentors.contactBtn') || "Bog'lanish"}
                            </button>
                        </div>
                    </div>
                </div>

                {modal && renderModal()}
                {toast && renderToast()}
            </div>
        );
    }

    return (
        <section className="bg-white dark:bg-[#090623] py-20 px-4 md:px-12 text-gray-900 dark:text-white relative transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4">{t('aboutMentors.sectionTitle') || "Bizning Mentorlar"}</h2>
                    <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                        {t('aboutMentors.sectionDesc') || "Tajribali mutaxassislardan zamonaviy kasblarni o'rganing."}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {mentorsData.map((mentor) => (
                        <div
                            key={mentor.id}
                            className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col sm:flex-row gap-8 items-center hover:border-gray-300 dark:hover:border-slate-700 transition shadow-md dark:shadow-none"
                        >
                            <img
                                src={mentor.image}
                                alt={mentor.name}
                                className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover border-2 border-red-500/20 cursor-pointer shadow-md"
                                onClick={() => setActiveMentorDetail(mentor)}
                            />

                            <div className="flex-1 text-center sm:text-left">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                    <h3
                                        onClick={() => setActiveMentorDetail(mentor)}
                                        className="text-2xl font-bold cursor-pointer hover:text-red-500 transition"
                                    >
                                        {mentor.name}
                                    </h3>
                                    <span className="text-xs bg-red-500/10 text-red-500 dark:text-red-400 px-3.5 py-1.5 rounded-full font-medium w-fit mx-auto sm:mx-0">
                                        {mentor.experience}
                                    </span>
                                </div>
                                <p className="text-red-600 dark:text-red-400 text-base font-semibold mb-3">{mentor.role} </p>
                                <p className="text-gray-600 dark:text-slate-300 text-base mb-5 line-clamp-2">{mentor.bio}</p>

                                <div className="flex flex-wrap justify-center sm:justify-start gap-2.5 mb-6">
                                    {mentor.skills && mentor.skills.map((skill, index) => (
                                        <span key={index} className="bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-xs px-3 py-1.5 rounded-lg">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => setActiveMentorDetail(mentor)}
                                        className="bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-800 dark:text-white text-sm font-medium px-6 py-3 rounded-xl transition text-center cursor-pointer"
                                    >
                                        {t('aboutMentors.detailsBtn') || "Batafsil"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedMentor(mentor.name);
                                            setModal(true);
                                        }}
                                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-6 py-3 rounded-xl transition text-center cursor-pointer shadow-sm"
                                    >
                                        {t('aboutMentors.contactBtn') || "Bog'lanish"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {modal && renderModal()}
            {toast && renderToast()}
        </section>
    );
}