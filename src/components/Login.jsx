import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaUser, 
    FaLock, 
    FaSignInAlt, 
    FaEye, 
    FaEyeSlash, 
    FaGraduationCap, 
    FaSpinner, 
    FaArrowRight, 
    FaShieldAlt 
} from 'react-icons/fa';
import { HiArrowLeft } from 'react-icons/hi';
import { useAuth } from '../utils/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login, currentUser } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // If already logged in, redirect appropriately
    React.useEffect(() => {
        if (currentUser) {
            if (currentUser.role === 'admin') {
                navigate('/enter');
            } else {
                navigate('/student/dashboard');
            }
        }
    }, [currentUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(username, password);
            toast.success(t('auth.loginSuccess', `Xush kelibsiz, ${user.name}!`));
            if (user.role === 'admin') {
                navigate('/enter');
            } else {
                navigate('/student/dashboard');
            }
        } catch (err) {
            setError(err.message || t('auth.loginFailed', "Kirishda xatolik yuz berdi"));
            toast.error(err.message || t('auth.loginFailed', "Kirishda xatolik yuz berdi"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 flex items-center justify-center relative select-none overflow-hidden">
            {/* Ambient Background Aura */}
            <div className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-red-600/[0.08] rounded-full blur-[160px] -z-10" />

            <div className="w-full max-w-md relative z-10">
                {/* Back to Home */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors shadow-xs backdrop-blur-xl"
                >
                    <HiArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('common.backToHome', 'Bosh sahifaga')}</span>
                </Link>

                {/* Main Pro Card */}
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
                            <FaGraduationCap />
                        </div>
                        <div className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-red-50 dark:bg-white/[0.03] text-red-600 dark:text-red-400 border border-red-500/25">
                            OPTIMUM // STUDENT & STAFF
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
                            {t('auth.loginTitle', 'Tizimga kirish')}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            {t('auth.loginSubtitle', 'Dars jadvali va materiallaringizni kuzatib boring')}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                {t('auth.usernameLabel', 'Login yoki Telefon')}
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none text-xs">
                                    <FaUser />
                                </span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder={t('auth.usernamePlaceholder', 'masalan: azizbek_2026')}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#07090e] border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all shadow-xs"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                {t('auth.passwordLabel', 'Parol')}
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none text-xs">
                                    <FaLock />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-11 py-3.5 bg-slate-50 dark:bg-[#07090e] border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all shadow-xs"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                                >
                                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-red-600/30 hover:shadow-red-600/50 border border-white/20 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99]"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin text-base" />
                                    <span>{t('auth.loggingIn', 'Tekshirilmoqda...')}</span>
                                </>
                            ) : (
                                <>
                                    <span>{t('auth.loginBtn', 'Tizimga kirish')}</span>
                                    <FaSignInAlt className="w-3.5 h-3.5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/[0.08] text-center space-y-3.5">
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center gap-1.5">
                            <span>{t('auth.noAccountPrompt', "Hali shaxsiy hisobingiz yo'qmi?")}</span>
                            <Link 
                                to="/access-request" 
                                className="font-bold text-red-600 dark:text-red-400 hover:underline hover:text-red-500 transition-colors"
                            >
                                {t('auth.requestAccess', "Kirish so'rovini yuborish")}
                            </Link>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                            <FaShieldAlt className="w-3 h-3 text-emerald-500" />
                            <span>Optimum ELC rasmiy xavfsiz tizimi</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
