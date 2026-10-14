import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaUser, 
    FaLock, 
    FaEye, 
    FaEyeSlash, 
    FaSpinner, 
    FaPaperPlane, 
    FaCheckCircle, 
    FaShieldAlt, 
    FaBookOpen, 
    FaCopy, 
    FaCheck,
    FaAt,
    FaCommentAlt,
    FaArrowRight
} from 'react-icons/fa';
import { HiArrowLeft } from 'react-icons/hi';
import { IMaskInput } from 'react-imask';
import axios from 'axios';
import moment from 'moment';
import toast from 'react-hot-toast';
import { getUsers } from '../utils/authService';

export default function AccessRequest() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [course, setCourse] = useState('IELTS 7+');
    const [customCourse, setCustomCourse] = useState('');
    const [note, setNote] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [copied, setCopied] = useState(false);

    const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN_1;
    const ADMIN_CHAT_IDS = ["6383523156", "334572168"];

    const handleCopyCredentials = () => {
        navigator.clipboard.writeText(`Login: ${username}\nParol: ${password}`);
        setCopied(true);
        toast.success("Login va parol nusxalandi!");
        setTimeout(() => setCopied(false), 2500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const cleanName = fullName.trim();
        const digitsOnly = phone.replace(/\D/g, '');
        const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');

        if (!cleanName) {
            setError("Iltimos, ism va familiyangizni to'liq kiriting!");
            return;
        }

        if (digitsOnly.length < 9) {
            setError("Telefon raqamingizni to'liq kiriting (+998...)");
            return;
        }

        if (cleanUsername.length < 3) {
            setError("Login kamida 3 ta belgidan iborat bo'lishi kerak!");
            return;
        }

        if (!/^[a-z0-9_.]+$/.test(cleanUsername)) {
            setError("Login faqat lotin harflari, raqamlar va '_' yoki '.' dan iborat bo'lishi kerak!");
            return;
        }

        if (password.length < 6) {
            setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak!");
            return;
        }

        if (password !== confirmPassword) {
            setError("Kiritilgan parollar mos kelmadi!");
            return;
        }

        setLoading(true);

        try {
            // Check if username is already taken by existing student or admin
            const existingUsers = await getUsers();
            const isTaken = existingUsers.some(u => (u.username || '').toLowerCase() === cleanUsername);
            if (isTaken) {
                setError("Ushbu login allaqachon band! Iltimos, boshqa login tanlang.");
                setLoading(false);
                return;
            }

            const chosenCourse = course === 'Boshqa' ? (customCourse.trim() || 'Boshqa kurs') : course;
            const formattedPhone = `+998 ${digitsOnly}`;
            const requestDate = moment().format('DD.MM.YYYY, HH:mm');

            const newRequest = {
                id: Date.now(),
                isLead: true,
                name: cleanName,
                phone: formattedPhone,
                requestedUsername: cleanUsername,
                requestedPassword: password,
                course: chosenCourse,
                note: note.trim(),
                type: "Kirish so'rovi",
                status: "Kutilmoqda",
                date: requestDate,
                createdAt: new Date().toISOString()
            };

            // 1. Save to Firebase Realtime Database
            try {
                const res = await axios.get(import.meta.env.VITE_FIREBASE_DB_URL, {
                    validateStatus: s => s < 500
                });
                let currentLeads = [];
                if (res.data !== null && res.data) {
                    currentLeads = Array.isArray(res.data) ? res.data : Object.values(res.data);
                }
                const updatedLeads = [newRequest, ...currentLeads];
                await axios.put(import.meta.env.VITE_FIREBASE_DB_URL, updatedLeads);
                localStorage.setItem('admin_leads', JSON.stringify(updatedLeads));
            } catch (fbErr) {
                console.warn("Firebase save warning, saving locally:", fbErr);
                const local = JSON.parse(localStorage.getItem('admin_leads') || '[]');
                localStorage.setItem('admin_leads', JSON.stringify([newRequest, ...local]));
            }

            // 2. Telegram Bot Instant Notification to Admins
            if (BOT_TOKEN) {
                const telegramMsg = `🔑 YANGI KIRISH SO'ROVI (Optimum ELC):\n\n` +
                    `👤 Ism: ${cleanName}\n` +
                    `📱 Tel: ${formattedPhone}\n` +
                    `🏷 Taklif qilingan Login: @${cleanUsername}\n` +
                    `🔐 Parol: ${password}\n` +
                    `📚 Kurs / Taklif: ${chosenCourse}\n` +
                    (note.trim() ? `💬 Izoh/Taklif: ${note.trim()}\n` : '') +
                    `⏰ Vaqt: ${requestDate}\n\n` +
                    `⚡️ Eslatma: Admin panelda ushbu murojaatni qabul qilib, guruh tanlasangiz, o'sha zahoti o'quvchi akkaunti ochiladi!`;

                ADMIN_CHAT_IDS.forEach(chatId => {
                    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ chat_id: chatId, text: telegramMsg })
                    }).catch(e => console.warn('Telegram send notice:', e));
                });
            }

            setSubmitted(true);
            toast.success("So'rovingiz adminga muvaffaqiyatli yuborildi!");
        } catch (err) {
            console.error("Submission error:", err);
            setError("So'rov yuborishda xatolik yuz berdi. Internet aloqangizni tekshirib qayta urinib ko'ring.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 flex items-center justify-center relative select-none overflow-hidden">
            {/* Ambient Background Aura */}
            <div className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-red-600/[0.08] rounded-full blur-[160px] -z-10" />

            <div className="w-full max-w-lg relative z-10">
                {/* Back Link */}
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors shadow-xs backdrop-blur-xl"
                >
                    <HiArrowLeft className="w-3.5 h-3.5" />
                    <span>Kirish sahifasiga qaytish</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="relative rounded-3xl bg-white/95 dark:bg-[#0b0e17]/95 backdrop-blur-3xl border border-black/[0.08] dark:border-white/[0.1] shadow-2xl p-6 sm:p-10 overflow-hidden"
                >
                    {/* Top ambient highlight */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

                    {!submitted ? (
                        <>
                            <div className="text-center space-y-2 mb-8">
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-600/30">
                                    <FaPaperPlane />
                                </div>
                                <div className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                                    OPTIMUM // ADMIN ACCESS REQUEST
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
                                    Kirish so'rovini yuborish
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                    O'zingiz xohlagan login va parolni kiriting. Admin tasdiqlashi bilan tizimga kiritilasiz.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl animate-shake">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                        Ism va Familiyangiz *
                                    </label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none text-xs">
                                            <FaUser />
                                        </span>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Masalan: Sardor Rahimov"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#07090e] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all shadow-xs"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone & Login in 2 cols */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                            Telefon raqami *
                                        </label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 text-xs font-mono font-bold text-slate-500 pointer-events-none">
                                                +998
                                            </span>
                                            <IMaskInput
                                                mask="(00) 000-00-00"
                                                value={phone}
                                                unmask={true}
                                                onAccept={(val) => setPhone(val)}
                                                placeholder="(90) 123-45-67"
                                                className="w-full pl-14 pr-3 py-3 bg-slate-50 dark:bg-[#07090e] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-600/20 font-mono"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                                            <span>Xohlagan Loginingiz *</span>
                                            <span className="text-[10px] text-slate-400 lowercase">username</span>
                                        </label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3 text-slate-400 text-xs font-mono font-bold">@</span>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                                                placeholder="sardor_2026"
                                                className="w-full pl-8 pr-3 py-3 bg-slate-50 dark:bg-[#07090e] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all shadow-xs font-mono"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Password & Confirm Password */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                            O'zingiz tanlagan Parol *
                                        </label>
                                        <div className="relative flex items-center">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Kamida 6 ta belgi"
                                                className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-[#07090e] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                                            >
                                                {showPassword ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                            Parolni tasdiqlang *
                                        </label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Qayta kiriting"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-[#07090e] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Course selection */}
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                                        <FaBookOpen className="text-red-500 text-xs" />
                                        <span>Qiziqayotgan Kurs yoki Yo'nalish</span>
                                    </label>
                                    <select
                                        value={course}
                                        onChange={(e) => setCourse(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-[#07090e] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all shadow-xs"
                                    >
                                        <option value="IELTS 7+">IELTS 7+ (Intensive / Standard)</option>
                                        <option value="General English">General English (Grammar & Speaking)</option>
                                        <option value="Kids English">Kids English (Bolalar uchun)</option>
                                        <option value="CEFR / Attestatsiya">CEFR & Attestatsiya tayyorgarlik</option>
                                        <option value="Boshqa">Boshqa taklif / kurs</option>
                                    </select>
                                    {course === 'Boshqa' && (
                                        <input
                                            type="text"
                                            value={customCourse}
                                            onChange={(e) => setCustomCourse(e.target.value)}
                                            placeholder="Qaysi kurs yoki guruhga qiziqmoqdasiz?"
                                            className="w-full mt-2 px-4 py-2.5 bg-slate-50 dark:bg-[#07090e] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-hidden focus:border-red-600"
                                        />
                                    )}
                                </div>

                                {/* Optional Proposal / Note */}
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                                        <FaCommentAlt className="text-slate-400 text-xs" />
                                        <span>Adminga taklif yoki qo'shimcha xabar (ixtiyoriy)</span>
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Masalan: Dars vaqti soat 14:00 dan keyin bo'lsa yaxshi edi..."
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#07090e] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-hidden focus:border-red-600"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 mt-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 border border-white/20 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="animate-spin text-base" />
                                            <span>So'rov yuborilmoqda...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Adminga so'rov yuborish</span>
                                            <FaPaperPlane className="w-3.5 h-3.5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        /* Submission Success View */
                        <div className="py-4 space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
                            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">
                                <FaCheckCircle />
                            </div>

                            <div className="space-y-2">
                                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                                    SO'ROV YUBORILDI
                                </span>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                                    So'rovingiz adminga muvaffaqiyatli yuborildi!
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                                    Admin arizangizni ko'rib chiqib, guruhga biriktirgach akkauntingiz ishga tushadi.
                                </p>
                            </div>

                            {/* 24-48 Hours Highlight Box as requested */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/10 border-2 border-amber-500/30 text-left space-y-3">
                                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-black text-xs uppercase tracking-wide">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                                    <span>Muhim eslatma (24-48 soat):</span>
                                </div>
                                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                                    Admin sizni <strong>24-48 soat ichida</strong> tegishli guruhga biriktiradi. Shundan so'ng quyidagi login va parolingiz orqali to'g'ridan-to'g'ri tizimga kiring:
                                </p>

                                <div className="p-3 bg-white dark:bg-[#07090e] rounded-xl border border-amber-500/20 font-mono text-xs space-y-1.5 relative">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Login (username):</span>
                                        <span className="font-bold text-slate-900 dark:text-white">@{username}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Parol:</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{password}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Telefon:</span>
                                        <span className="font-bold text-slate-900 dark:text-white">+998 {phone}</span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleCopyCredentials}
                                        className="mt-2 w-full py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-sans font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                        {copied ? <FaCheck className="text-emerald-500" /> : <FaCopy />}
                                        <span>{copied ? "Nusxalandi!" : "Login va parolni nusxalash"}</span>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span>Tizimga kirish sahifasiga o'tish</span>
                                <FaArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/[0.08] text-center space-y-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Profilingiz allaqachon bormi?{' '}
                            <Link to="/login" className="font-bold text-red-600 dark:text-red-400 hover:underline">
                                Tizimga kirish
                            </Link>
                        </p>
                        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                            <FaShieldAlt className="w-3 h-3 text-emerald-500" />
                            <span>Optimum ELC rasmiy xavfsiz tizimi</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
