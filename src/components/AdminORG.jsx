import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Comments from './Comments'
import AOS from 'aos'
import 'aos/dist/aos.css'
import toast, { Toaster } from 'react-hot-toast'
import { FaUserCheck, FaPhoneAlt, FaCalendarAlt, FaSearch, FaCommentDots, FaInbox, FaSignOutAlt, FaCheck, FaTimes, FaSync, FaFileCsv, FaFilter, FaChartBar, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaUsers, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function AdminORG() {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('leads') // 'leads' or 'comments'
    const [leads, setLeads] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [typeFilter, setTypeFilter] = useState('all')
    const [sortOrder, setSortOrder] = useState('newest')
    const [loadingLeads, setLoadingLeads] = useState(false)
    const [deleteModalLead, setDeleteModalLead] = useState(null)

    const handleDeleteLead = async (id) => {
        const updatedList = leads.filter(item => item.id !== id)
        setLeads(updatedList)
        localStorage.setItem('admin_leads', JSON.stringify(updatedList))

        try {
            await axios.put('https://jsonblob.com/api/jsonBlob/019fdafb-c0ff-7d54-90a5-65c7a5b3b38d', updatedList)
        } catch (e) {
            console.error(e)
        }
        toast.success(t('adminPanel.deleteSuccess', "Murojaat o'chirildi!"))
        setDeleteModalLead(null)
    }

    const loadLeads = async () => {
        setLoadingLeads(true)
        try {
            const res = await axios.get('https://jsonblob.com/api/jsonBlob/019fdafb-c0ff-7d54-90a5-65c7a5b3b38d')
            const remoteLeads = Array.isArray(res.data) ? res.data : []
            setLeads(remoteLeads)
            localStorage.setItem('admin_leads', JSON.stringify(remoteLeads))
        } catch (e) {
            console.error(e)
            const stored = JSON.parse(localStorage.getItem('admin_leads') || '[]')
            setLeads(stored)
        } finally {
            setLoadingLeads(false)
        }
    }

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 80,
        })
        loadLeads()

        // Har 3 soniyada barcha qurilmalar (telefon, PC) orasida murojaatlarni real-vaqtda yangilash
        const interval = setInterval(() => {
            loadLeads()
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    const updateLeadStatus = async (id, newStatus) => {
        const updatedList = leads.map(item => item.id === id ? { ...item, status: newStatus } : item)
        setLeads(updatedList)
        localStorage.setItem('admin_leads', JSON.stringify(updatedList))

        try {
            await axios.put('https://jsonblob.com/api/jsonBlob/019fdafb-c0ff-7d54-90a5-65c7a5b3b38d', updatedList)
        } catch (e) {
            console.error(e)
        }
        
        if (newStatus === 'Qabul qilindi') {
            toast.success("So'rov qabul qilindi!")
        } else if (newStatus === 'Rad etildi') {
            toast.error("So'rov rad etildi!")
        }
    }

    const exportToCSV = () => {
        if (leads.length === 0) {
            toast.error("Yuklab olish uchun murojaatlar mavjud emas!")
            return
        }

        const headers = ["F.I.O", "Telefon raqami", "Murojaat turi", "Kelgan vaqti", "Status"]
        const rows = leads.map(l => [
            `"${(l.name || '').replace(/"/g, '""')}"`,
            `"${(l.phone || '').replace(/"/g, '""')}"`,
            `"${(l.type || '').replace(/"/g, '""')}"`,
            `"${(l.date || '').replace(/"/g, '""')}"`,
            `"${(l.status || 'Kutilmoqda').replace(/"/g, '""')}"`
        ])

        const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n")
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `murojaatlar_optimum_${new Date().toISOString().slice(0, 10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success("Excel (CSV) fayli yuklab olindi!")
    }

    // Analytics calculations
    const totalCount = leads.length
    const acceptedCount = leads.filter(l => l.status === 'Qabul qilindi').length
    const rejectedCount = leads.filter(l => l.status === 'Rad etildi').length
    const pendingCount = leads.filter(l => l.status === 'Kutilmoqda' || !l.status).length

    const getPercent = (count) => totalCount > 0 ? Math.round((count / totalCount) * 100) : 0

    // Filter and Sort logic
    const filteredLeads = leads
        .filter(lead => {
            const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.phone?.includes(searchTerm) ||
                lead.type?.toLowerCase().includes(searchTerm.toLowerCase())
            
            const matchesStatus = statusFilter === 'all' || lead.status === statusFilter || (statusFilter === 'Kutilmoqda' && !lead.status)
            const matchesType = typeFilter === 'all' || lead.type?.toLowerCase().includes(typeFilter.toLowerCase())

            return matchesSearch && matchesStatus && matchesType
        })
        .sort((a, b) => {
            if (sortOrder === 'oldest') {
                return (a.id || 0) - (b.id || 0)
            }
            return (b.id || 0) - (a.id || 0)
        })

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
                                {t('adminPanel.title', "Admin Boshqaruv Paneli")}
                            </h1>
                            <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
                                {t('adminPanel.subtitle', "Telegram bot va sayt orqali tushgan murojaatlarni boshqarish va tahlil qilish")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={loadLeads}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm transition-all border border-gray-200 dark:border-gray-700 cursor-pointer active:scale-95"
                            title={t('adminPanel.refreshBtn', "Yangilash")}
                        >
                            <FaSync className={loadingLeads ? "animate-spin" : ""} />
                            <span className="hidden xs:inline">{t('adminPanel.refreshBtn', "Yangilash")}</span>
                        </button>

                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 font-bold text-xs sm:text-sm transition-all border border-red-500/20 cursor-pointer active:scale-95"
                        >
                            <FaSignOutAlt />
                            <span>{t('adminPanel.exitBtn', "Chiqish")}</span>
                        </Link>
                    </div>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Total Leads Card */}
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                                {t('adminPanel.totalLeads', "Jami Murojaatlar")}
                            </span>
                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg">
                                <FaUsers />
                            </div>
                        </div>
                        <div>
                            <span className="text-3xl font-black text-gray-900 dark:text-white">{totalCount}</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full rounded-full w-full" />
                        </div>
                    </div>

                    {/* Pending Leads Card */}
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-amber-500 tracking-wider">
                                {t('adminPanel.pending', "Kutilmoqda")}
                            </span>
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-lg">
                                <FaHourglassHalf />
                            </div>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-3xl font-black text-gray-900 dark:text-white">{pendingCount}</span>
                            <span className="text-xs font-bold text-amber-500">{getPercent(pendingCount)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${getPercent(pendingCount)}%` }} />
                        </div>
                    </div>

                    {/* Accepted Leads Card */}
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-emerald-500 tracking-wider">
                                {t('adminPanel.accepted', "Qabul Qilindi")}
                            </span>
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-lg">
                                <FaCheckCircle />
                            </div>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-3xl font-black text-gray-900 dark:text-white">{acceptedCount}</span>
                            <span className="text-xs font-bold text-emerald-500">{getPercent(acceptedCount)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${getPercent(acceptedCount)}%` }} />
                        </div>
                    </div>

                    {/* Rejected Leads Card */}
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-rose-500 tracking-wider">
                                {t('adminPanel.rejected', "Rad Etildi")}
                            </span>
                            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-lg">
                                <FaTimesCircle />
                            </div>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-3xl font-black text-gray-900 dark:text-white">{rejectedCount}</span>
                            <span className="text-xs font-bold text-rose-500">{getPercent(rejectedCount)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${getPercent(rejectedCount)}%` }} />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setActiveTab('leads')}
                            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
                                activeTab === 'leads'
                                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                                    : 'bg-white/80 dark:bg-gray-900/80 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-800'
                            }`}
                        >
                            <FaInbox className="text-base" />
                            <span>{t('adminPanel.murojaatlarTab', "Murojaatlar")} ({leads.length})</span>
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
                            <span>{t('adminPanel.commentsTab', "O'quvchilar Izohlari")}</span>
                        </button>
                    </div>

                    {activeTab === 'leads' && (
                        <button
                            onClick={exportToCSV}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
                        >
                            <FaFileCsv className="text-base" />
                            <span className="hidden sm:inline">{t('adminPanel.exportCsvBtn', "Excel (CSV) yuklab olish")}</span>
                        </button>
                    )}
                </div>

                {/* Tab 1: Murojaatlar */}
                {activeTab === 'leads' && (
                    <div className="space-y-6">
                        {/* Search and Filters Bar */}
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-md">
                            
                            {/* Search Input */}
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="text"
                                    placeholder={t('adminPanel.searchPlaceholder', "Ism yoki telefon bo'yicha qidiruv...")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-red-600 text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Status Filter */}
                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
                                    <FaFilter className="text-xs text-red-600" />
                                    <span>{t('adminPanel.statusLabel', "Status:")}</span>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-red-600 cursor-pointer"
                                    >
                                        <option value="all">{t('adminPanel.allOptions', "Barchasi")}</option>
                                        <option value="Kutilmoqda">{t('adminPanel.pending', "Kutilmoqda")}</option>
                                        <option value="Qabul qilindi">{t('adminPanel.accepted', "Qabul qilindi")}</option>
                                        <option value="Rad etildi">{t('adminPanel.rejected', "Rad etildi")}</option>
                                    </select>
                                </div>

                                {/* Type Filter */}
                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
                                    <span>{t('adminPanel.typeLabel', "Turi:")}</span>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-red-600 cursor-pointer"
                                    >
                                        <option value="all">{t('adminPanel.allOptions', "Barchasi")}</option>
                                        <option value="Bepul maslahat">{t('adminPanel.typeFreeConsultation', "Bepul maslahat")}</option>
                                        <option value="Ro'yxatdan o'tish">{t('adminPanel.typeRegister', "Ro'yxatdan o'tish")}</option>
                                        <option value="Konsultatsiya">{t('adminPanel.typeConsultation', "Konsultatsiya")}</option>
                                    </select>
                                </div>

                                {/* Sort Order */}
                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
                                    <span>{t('adminPanel.sortLabel', "Tartib:")}</span>
                                    <select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className="px-3 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-red-600 cursor-pointer"
                                    >
                                        <option value="newest">{t('adminPanel.newest', "Eng yangilari")}</option>
                                        <option value="oldest">{t('adminPanel.oldest', "Eng eskilari")}</option>
                                    </select>
                                </div>
                            </div>

                        </div>

                        {/* Leads Cards */}
                        {filteredLeads.length === 0 ? (
                            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-12 rounded-3xl border border-gray-200 dark:border-gray-800 text-center space-y-3">
                                <FaInbox className="text-5xl text-gray-400 mx-auto" />
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {t('adminPanel.noLeadsTitle', "Mos keladigan murojaat topilmadi")}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                    {t('adminPanel.noLeadsDesc', "Qidiruv so'rovi yoki belgilangan filtrlar bo'yicha ma'lumot yo'q.")}
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

                                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                                                    lead.status === 'Qabul qilindi'
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                        : lead.status === 'Rad etildi'
                                                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                                }`}>
                                                    {lead.status === 'Qabul qilindi' ? t('adminPanel.accepted', "Qabul qilindi") : lead.status === 'Rad etildi' ? t('adminPanel.rejected', "Rad etildi") : t('adminPanel.pending', "Kutilmoqda")}
                                                </span>

                                                <button
                                                    onClick={() => setDeleteModalLead(lead)}
                                                    className="w-7 h-7 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-red-600 hover:text-white flex items-center justify-center text-xs font-bold text-gray-500 transition-all cursor-pointer active:scale-95 ml-1"
                                                    title="O'chirish"
                                                >
                                                    <FaTimes />
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

                                        {/* Action Buttons: Accept and Reject */}
                                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                                            <button
                                                onClick={() => updateLeadStatus(lead.id, 'Qabul qilindi')}
                                                disabled={lead.status === 'Qabul qilindi'}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                                                    lead.status === 'Qabul qilindi'
                                                        ? 'bg-emerald-500/20 text-emerald-600 cursor-not-allowed opacity-60'
                                                        : 'bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-500/20'
                                                }`}
                                            >
                                                <FaCheck />
                                                <span>{t('adminPanel.acceptBtn', "Accept")}</span>
                                            </button>

                                            <button
                                                onClick={() => updateLeadStatus(lead.id, 'Rad etildi')}
                                                disabled={lead.status === 'Rad etildi'}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                                                    lead.status === 'Rad etildi'
                                                        ? 'bg-rose-500/20 text-rose-600 cursor-not-allowed opacity-60'
                                                        : 'bg-rose-600/10 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-500/20'
                                                }`}
                                            >
                                                <FaTimes />
                                                <span>{t('adminPanel.rejectBtn', "Reject")}</span>
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

            {/* Delete Confirmation Modal */}
            {deleteModalLead && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-5">
                        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-2xl mx-auto">
                            <FaTrash />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">
                                {t('adminPanel.deleteConfirmTitle', "Rostdan ham ushbu murojaatni o'chirmoqchimisiz?")}
                            </h3>
                            <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-2">
                                {deleteModalLead.name} {deleteModalLead.phone ? `(${deleteModalLead.phone})` : ''}
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button
                                onClick={() => setDeleteModalLead(null)}
                                className="px-5 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                            >
                                {t('adminPanel.noBtn', "Yo'q, bekor qilish")}
                            </button>
                            <button
                                onClick={() => handleDeleteLead(deleteModalLead.id)}
                                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-lg shadow-red-600/30 hover:scale-105 transition cursor-pointer"
                            >
                                {t('adminPanel.yesBtn', "Ha, o'chirilsin")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Toaster position="top-right" />
        </div>
    )
}