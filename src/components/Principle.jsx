import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiLightningBolt, HiCheckCircle, HiStar, HiArrowLeft, HiOutlineCheck } from 'react-icons/hi';

export default function Principle() {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const principleId = parseInt(id) || 1;

    // Default configs for the 3 principles
    const configs = {
        1: {
            icon: <HiLightningBolt className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />,
            bgGradient: "from-red-500/20 to-transparent",
            iconBg: "bg-red-100 dark:bg-red-500/20",
        },
        2: {
            icon: <HiCheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-rose-500" />,
            bgGradient: "from-rose-500/20 to-transparent",
            iconBg: "bg-rose-100 dark:bg-rose-500/20",
        },
        3: {
            icon: <HiStar className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />,
            bgGradient: "from-orange-500/20 to-transparent",
            iconBg: "bg-orange-100 dark:bg-orange-500/20",
        }
    };

    const config = configs[principleId] || configs[1];

    return (
        <div className="pb-10 min-h-screen font-['Plus_Jakarta_Sans',sans-serif] pt-[100px]  px-4 sm:px-6 relative overflow-hidden transition-colors duration-300 flex items-center">
            {/* Background elements */}
            <div className={`absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-bl ${config.bgGradient} rounded-full blur-[80px] sm:blur-[120px] -z-10`} />
            <div className={`absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-tr ${config.bgGradient} rounded-full blur-[80px] sm:blur-[120px] -z-10`} />
            
            <div className="max-w-4xl mx-auto w-full">


                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative group p-6 sm:p-10 md:p-12"
                >
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-red-500/10 transition-colors duration-700" />
                    
                    {/* Header Section */}
                    <div className="flex flex-col items-start border-b border-slate-200 dark:border-slate-800 pb-8 mb-8">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 ${config.iconBg} shadow-inner border border-white/50 dark:border-slate-700/50`}
                        >
                            {config.icon}
                        </motion.div>

                        <motion.h4 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-red-600 dark:text-red-400 font-bold uppercase tracking-widest text-xs sm:text-sm mb-2 sm:mb-3"
                        >
                            {t(`principles.p${principleId}_subtitle`)}
                        </motion.h4>
                        
                        <motion.h1 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6 leading-tight sm:leading-[1.1]"
                        >
                            {t(`principles.p${principleId}_title`)}
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.7 }}
                            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-3xl"
                        >
                            {t(`principles.p${principleId}_desc`)}
                        </motion.p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12 relative z-10">
                        {[1, 2, 3].map((num, idx) => (
                            <motion.div 
                                key={num}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + (idx * 0.1), duration: 0.5 }}
                                className="flex flex-col gap-3"
                            >
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold bg-gradient-to-br from-red-500 to-rose-600 shadow-md">
                                    <HiOutlineCheck className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {t(`principles.p${principleId}_f${num}_title`)}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {t(`principles.p${principleId}_f${num}_desc`)}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Extra Highlight Box */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700/50 mb-10 sm:mb-12 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-red-500 to-rose-600" />
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                            {t(`principles.p${principleId}_extra_title`)}
                        </h3>
                        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                            {t(`principles.p${principleId}_extra_desc`)}
                        </p>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative z-10"
                    >
                        <Link 
                            to="/level-test"
                            className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-600/30 transition-all transform hover:-translate-y-1 text-center"
                        >
                            {t('principles.cta')}
                        </Link>
                        <Link 
                            to="/about"
                            className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl transition-all text-center"
                        >
                            {t('navbar.about', 'Biz haqimizda')}
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
