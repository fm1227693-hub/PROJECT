import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminORG from './AdminORG'
import toast, { Toaster } from 'react-hot-toast'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export default function Admin() {
    const { t } = useTranslation()
    const [cod, setCod] = useState('')
    const [kirish, setKirish] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const alo = () => {
        if (cod === '88888888') {
            setKirish(true)
        } else if (cod === '') {
            toast.error(t('admin.emptyError', "Parolni kiriting!"), {
                style: {
                    background: '#1f2937',
                    color: '#fff',
                    borderRadius: '12px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                }
            })
        } else {
            toast.error(t('admin.wrongPassword', "Noto'g'ri parol!"), {
                style: {
                    background: '#1f2937',
                    color: '#fff',
                    borderRadius: '12px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                }
            })
        }
    }

    if (kirish) {
        return <AdminORG />
    }

    return (
        <div 
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-[#030712] overflow-hidden"
        >
            {/* Ambient Background Layers */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] [animation-delay:2s] animate-pulse" />
                <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] [animation-delay:1s] animate-pulse" />
            </div>

            {/* Matrix overlay for texture */}
            <div 
                className="absolute inset-0 opacity-[0.15]" 
                style={{
                    backgroundImage: "radial-gradient(circle, rgba(225,29,72,0.4) 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                }}
            />

            <div
                data-aos="zoom-in"
                data-aos-duration="800"
                className="w-full max-w-[420px] mx-auto relative z-10"
            >
                {/* Glowing border effect wrapper */}
                <div className="absolute -inset-[1px] bg-gradient-to-b from-red-500/50 via-rose-500/20 to-transparent rounded-[32px] blur-[2px] opacity-70" />
                
                <div className="relative flex flex-col gap-8 p-8 sm:p-10 bg-[#0a0f1c]/90 backdrop-blur-xl rounded-[32px] shadow-[0_0_80px_rgba(225,29,72,0.15)] border border-white/5 overflow-hidden">
                    
                    {/* Top highlight line */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/5 border border-red-500/20 mb-4 shadow-[0_0_30px_rgba(225,29,72,0.2)]">
                            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            {t('admin.title', "Admin Panel")}
                        </h2>
                    </div>

                    <div className="space-y-5">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-red-400 text-gray-500">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={cod}
                                onChange={(e) => setCod(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && alo()}
                                className="w-full pl-11 pr-12 py-4 bg-[#030712]/50 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10 transition-all text-white placeholder-gray-500 text-sm font-medium tracking-widest shadow-inner shadow-black/20"
                                placeholder="••••••••"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-red-400 transition-colors focus:outline-none cursor-pointer"
                            >
                                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                            </button>
                        </div>

                        <button
                            onClick={alo}
                            className="w-full relative group overflow-hidden rounded-2xl cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 transition-transform duration-300 group-hover:scale-105" />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
                            <div className="relative px-4 py-4 flex items-center justify-center gap-2">
                                <span className="font-black text-white text-sm sm:text-base tracking-wide uppercase">
                                    {t('admin.enterBtn', "Kirish")}
                                </span>
                                <svg className="w-5 h-5 text-white transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <Toaster position="top-center" />
        </div>
    )
}