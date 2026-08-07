import React, { useEffect, useState } from 'react'
import Comments from './Comments'
import AOS from 'aos'
import 'aos/dist/aos.css'
import toast, { Toaster } from 'react-hot-toast'
import { FaUserCheck, FaTrash, FaPhoneAlt, FaCalendarAlt, FaSearch, FaCommentDots, FaInbox, FaSignOutAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function AdminORG() {
    const [activeTab, setActiveTab] = useState('leads') // 'leads' or 'comments'
    const [leads, setLeads] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 80,
        })
        loadLeads()
    }, [])

    const loadLeads = () => {
        const stored = JSON.parse(localStorage.getItem('admin_leads') || '[]')
        setLeads(stored)
    }

    const handleDeleteLead = (id) => {
        const updated = leads.filter(item => item.id !== id)
        setLeads(updated)
        localStorage.setItem('admin_leads', JSON.stringify(updated))
        toast.success("Murojaat muvaffaqiyatli o'chirildi!")
    }

    const handleClearAll = () => {
        setLeads([])
        localStorage.setItem('admin_leads', JSON.stringify([]))
        toast.success("Barcha murojaatlar tozalandi!")
    }

    const toggleStatus = (id) => {
        const updated = leads.map(item => {
            if (item.id === id) {
                const nextStatus = item.status === 'Bog\'lanildi' ? 'Yangi' : 'Bog\'lanildi'
                return { ...item, status: nextStatus }
            }
            return item
        })
        setLeads(updated)
        localStorage.setItem('admin_leads', JSON.stringify(updated))
        toast.success("Status yangilandi!")
    }

    const filteredLeads = leads.filter(lead => 
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm) ||
        lead.type?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-gray-900 dark:text-gray-100 font-['Plus_Jakarta_Sans',sans-serif] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Admin Header Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white text-xl shadow-lg shadow-red-600/30">
                            <FaUserCheck />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                                Admin Boshqaruv Paneli
                            </h1>
                            <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
                                Telegram bot va sayt orqali tushgan murojaatlarni boshqarish
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 font-bold text-xs sm:text-sm transition-all border border-red-500/20 cursor-pointer active:scale-95"
                    >
                        <FaSignOutAlt />
                        <span>Chiqish</span>
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
                    <button
                        onClick={() => setActiveTab('leads')}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
                            activeTab === 'leads'
                                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                                : 'bg-white/80 dark:bg-gray-900/80 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-800'
                        }`}
                    >
                        <FaInbox className="text-base" />
                        <span>Murojaatlar ({leads.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('comments')}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
                            activeTab === 'comments'
                                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                                : 'bg-white/80 dark:bg-gray-900/80 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-800'
                        }`}
                    >
                        <FaCommentDots className="text-base" />
                        <span>Izohlar va Mahsulotlar</span>
                    </button>
                </div>

                {/* Tab 1: Murojaatlar */}
                {activeTab === 'leads' && (
                    <div className="space-y-6">
                        {/* Search & Actions Bar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="relative w-full sm:w-80">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="text"
                                    placeholder="Ism yoki telefon bo'yicha qidiruv..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-red-600 text-gray-900 dark:text-white"
                                />
                            </div>

                            {leads.length > 0 && (
                                <button
                                    onClick={handleClearAll}
                                    className="w-full sm:w-auto px-4 py-3 bg-rose-600/10 hover:bg-rose-600/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-2xl font-bold text-xs transition-all cursor-pointer active:scale-95"
                                >
                                    Barcha murojaatlarni tozalash
                                </button>
                            )}
                        </div>

                        {/* Leads Cards / Table */}
                        {filteredLeads.length === 0 ? (
                            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-12 rounded-3xl border border-gray-200 dark:border-gray-800 text-center space-y-3">
                                <FaInbox className="text-5xl text-gray-400 mx-auto" />
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Hozircha hech qanday murojaat yo'q
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                    Sayt va Telegram bot orqali foydalanuvchilar qoldirgan ism va telefon raqamlari shu yerda ko'rinadi.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filteredLeads.map((lead) => (
                                    <div
                                        key={lead.id}
                                        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg flex flex-col justify-between gap-4 hover:border-red-500/30 transition-all group"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="px-3 py-1 bg-red-600/10 text-red-600 dark:text-red-400 rounded-full text-[11px] font-black uppercase tracking-wider border border-red-500/20">
                                                    {lead.type || "Murojaat"}
                                                </span>

                                                <button
                                                    onClick={() => toggleStatus(lead.id)}
                                                    className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                                                        lead.status === 'Bog\'lanildi'
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                                    }`}
                                                >
                                                    {lead.status === 'Bog\'lanildi' ? '✓ Bog\'lanildi' : '● Yangi'}
                                                </button>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                                                    {lead.name}
                                                </h3>
                                                <a
                                                    href={`tel:${lead.phone}`}
                                                    className="inline-flex items-center gap-2 mt-1 text-sm font-bold text-red-600 dark:text-red-400 hover:underline"
                                                >
                                                    <FaPhoneAlt className="text-xs" />
                                                    <span>{lead.phone}</span>
                                                </a>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                                                <FaCalendarAlt className="text-xs opacity-70" />
                                                <span>{lead.date}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end pt-3 border-t border-gray-100 dark:border-gray-800">
                                            <button
                                                onClick={() => handleDeleteLead(lead.id)}
                                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95"
                                            >
                                                <FaTrash />
                                                <span>O'chirish</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 2: Izohlar va Mahsulotlar */}
                {activeTab === 'comments' && (
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                        <Comments />
                    </div>
                )}

            </div>
            <Toaster position="top-right" />
        </div>
    )
}