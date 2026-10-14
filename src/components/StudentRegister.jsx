import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FaUser, 
    FaLock, 
    FaUserPlus, 
    FaEye, 
    FaEyeSlash, 
    FaGraduationCap, 
    FaSpinner, 
    FaPhoneAlt, 
    FaCheckCircle, 
    FaShieldAlt 
} from 'react-icons/fa';
import { HiArrowLeft } from 'react-icons/hi';
import { IMaskInput } from 'react-imask';
import { registerStudent } from '../utils/authService';
import { useAuth } from '../utils/AuthContext';
import toast from 'react-hot-toast';

export default function StudentRegister() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { refreshSession } = useAuth();

    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError(t('auth.passwordMismatch', 'Kiritilgan parollar mos kelmadi!'));
            return;
        }

        setLoading(true);

        try {
            const registeredUser = await registerStudent({
                fullName,
                username,
                password,
                confirmPassword,
                phone: `+998 ${phone}`
            });

            refreshSession();
            toast.success(t('auth.registerSuccess', "Tabriklaymiz! Ro'yxatdan muvaffaqiyatli o'tdingiz."));
            navigate('/student/dashboard');
        } catch (err) {
            setError(err.message || t('auth.registerFailed', "Ro'yxatdan o'tishda xatolik"));
            toast.error(err.message || t('auth.registerFailed', "Ro'yxatdan o'tishda xatolik"));
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
                    <span>{t('auth.backToLogin', 'Kirish sahifasiga')}</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="relative rounded-3xl bg-white/95 dark:bg-[#0b0e17]/95 backdrop-blur-3xl border border-black/[0.08] dark:border-white/[0.1] shadow-2xl p-6 sm:p-10 overflow-hidden"
                >
                    {/* Top ambient highlight */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

                    <div className="text-center space-y-2 mb-8">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-red-600/30">
                            <FaUserPlus />
                        </div>
                        <div className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-red-50 dark:bg-white/[0.03] text-red-600 dark:text-red-400 border border-red-500/25">
                            OPTIMUM STUDENT PORTAL
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
                            {t('auth.registerTitle', "O'quvchi kabinetini ochish")}
                        </h1>
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
                                {t('auth.fullNameLabel', "Ism va Familiyangiz")} *
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

                        {/* Username & Phone in 2 cols */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    {t('auth.usernameLabel2', 'Login (username)')} *
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                                    placeholder="sardor_01"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#07090e] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all shadow-xs"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    {t('auth.phoneLabel', 'Telefon')}
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
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password & Confirm Password */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    {t('auth.passwordLabel', 'Parol')} *
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
                                    {t('auth.confirmPasswordLabel', 'Parolni tasdiqlang')} *
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-red-600/30 hover:shadow-red-600/50 border border-white/20 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99]"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin text-base" />
                                    <span>{t('auth.registering', 'Akkaunt yaratilmoqda...')}</span>
                                </>
                            ) : (
                                <>
                                    <span>{t('auth.completeRegister', "Ro'yxatdan o'tishni yakunlash")}</span>
                                    <FaCheckCircle className="w-3.5 h-3.5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/[0.08] text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {t('auth.alreadyHaveAccount', "Profilingiz bormi?")}{' '}
                            <Link to="/login" className="font-bold text-red-600 dark:text-red-400 hover:underline">
                                {t('auth.loginBtn', "Tizimga kirish")}
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
