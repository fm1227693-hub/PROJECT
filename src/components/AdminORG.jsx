import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Comments from './Comments'
import toast, { Toaster } from 'react-hot-toast'
import { FaUserCheck, FaPhoneAlt, FaCalendarAlt, FaSearch, FaCommentDots, FaInbox, FaSignOutAlt, FaCheck, FaTimes, FaSync, FaFileCsv, FaFilter, FaChartBar, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaUsers, FaTrash, FaHeadset, FaChevronDown, FaUserShield } from 'react-icons/fa'
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
    const [showAddLeadModal, setShowAddLeadModal] = useState(false)
    const [newLeadName, setNewLeadName] = useState('')
    const [newLeadPhone, setNewLeadPhone] = useState('')
    const [newLeadType, setNewLeadType] = useState("Ro'yxatdan o'tish")
    const [newLeadStatus, setNewLeadStatus] = useState("Qabul qilindi")

    const handleCreateLead = async (e) => {
        e.preventDefault()

        if (!newLeadName.trim()) {
            toast.error(t('adminPanel.fillNameError', "Iltimos, F.I.O ni kiriting!"))
            return
        }

        const cleanDigits = newLeadPhone.replace(/\D/g, '')
        if (cleanDigits.length !== 9) {
            toast.error(t('adminPanel.phoneError9Digits', "Telefon raqami ro'ppa-rosa 9 ta raqamdan iborat bo'lishi kerak! (Masalan: 901234567)"))
            return
        }

        const formattedPhone = `+998 ${cleanDigits}`

        const now = new Date()
        const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

        const newLead = {
            id: Date.now(),
            name: newLeadName.trim(),
            phone: formattedPhone,
            type: newLeadType || "Ro'yxatdan o'tish",
            status: newLeadStatus || "Qabul qilindi",
            date: formattedDate
        }

        const updatedList = [newLead, ...leads]
        setLeads(updatedList)
        localStorage.setItem('admin_leads', JSON.stringify(updatedList))

        try {
            await axios.put('https://jsonblob.com/api/jsonBlob/019fe9ca-e729-761e-a88a-c68b3bd21d71', updatedList)
            toast.success(t('adminPanel.leadRegisteredSuccess', "Murojaat muvaffaqiyatli ro'yxatga olindi!"))
        } catch (e) {
            toast.success(t('adminPanel.leadSavedSuccess', "Murojaat saqlandi!"))
        }

        setNewLeadName('')
        setNewLeadPhone('')
        setShowAddLeadModal(false)
    }

    const handleDeleteLead = async (id) => {
        const updatedList = leads.filter(item => item.id !== id)
        setLeads(updatedList)
        localStorage.setItem('admin_leads', JSON.stringify(updatedList))

        try {
            await axios.put('https://jsonblob.com/api/jsonBlob/019fe9ca-e729-761e-a88a-c68b3bd21d71', updatedList)
        } catch (e) {
            // silent catch for local storage fallback
        }
        toast.success(t('adminPanel.deleteSuccess', "Murojaat o'chirildi!"))
        setDeleteModalLead(null)
    }

    const loadLeads = async () => {
        setLoadingLeads(true)
        try {
            const res = await axios.get('https://jsonblob.com/api/jsonBlob/019fe9ca-e729-761e-a88a-c68b3bd21d71', {
                validateStatus: status => status < 500
            })
            if (res.status === 200 && Array.isArray(res.data)) {
                setLeads(res.data)
                localStorage.setItem('admin_leads', JSON.stringify(res.data))
            } else {
                const stored = JSON.parse(localStorage.getItem('admin_leads') || '[]')
                setLeads(stored)
            }
        } catch (e) {
            const stored = JSON.parse(localStorage.getItem('admin_leads') || '[]')
            setLeads(stored)
        } finally {
            setLoadingLeads(false)
        }
    }

    useEffect(() => {
        
        loadLeads()

        // Har 3 soniyada barcha qurilmalar (telefon, PC) orasida murojaatlarni real-vaqtda yangilash
        const interval = setInterval(() => {
            loadLeads()
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    const updateLeadStatus = async (id, newStatus) => {
        const updatedList = leads.map(l => {
            if (l.id === id) {
                return { ...l, status: newStatus }
            }
            return l
        })

        setLeads(updatedList)
        localStorage.setItem('admin_leads', JSON.stringify(updatedList))

        try {
            await axios.put('https://jsonblob.com/api/jsonBlob/019fe9ca-e729-761e-a88a-c68b3bd21d71', updatedList)
        } catch (e) {
            // silent catch
        }
        
        if (newStatus === 'Qabul qilindi') {
            toast.success(t('adminPanel.requestAccepted', "So'rov qabul qilindi!"))
        } else if (newStatus === 'Rad etildi') {
            toast.error(t('adminPanel.requestRejected', "So'rov rad etildi!"))
        }
    }

    const exportToCSV = () => {
        if (leads.length === 0) {
            toast.error(t('adminPanel.noDataToExport', "Yuklab olish uchun murojaatlar mavjud emas!"))
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
        toast.success(t('adminPanel.csvExportSuccess', "Excel (CSV) fayli yuklab olindi!"))
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

    const CustomSelect = ({ value, onChange, options, labelIcon, labelText }) => {
        const [open, setOpen] = useState(false)
        const ref = useRef(null)

        useEffect(() => {
            const handleClickOutside = (e) => {
                if (ref.current && !ref.current.contains(e.target)) {
                    setOpen(false)
                }
            }
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }, [])

        const selectedOption = options.find(o => o.value === value) || options[0]

        return (
            <div className={`relative inline-block text-left ${open ? 'z-50' : 'z-10'}`} ref={ref}>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
                    {labelIcon}
                    {labelText && <span>{labelText}</span>}
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="flex items-center justify-between gap-2 px-3.5 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 hover:border-red-500/50 rounded-xl text-xs font-extrabold text-gray-900 dark:text-white transition-all cursor-pointer shadow-sm active:scale-95 min-w-[130px]"
                    >
                        <span className="truncate">{selectedOption.label}</span>
                        <FaChevronDown className={`w-2.5 h-2.5 text-red-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {open && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 dark:bg-[#070b14]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200/80 dark:border-white/10 p-1.5 z-[100] flex flex-col gap-1 animate-fade-in">
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    onChange(opt.value)
                                    setOpen(false)
                                }}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    value === opt.value
                                        ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                                }`}
                            >
                                <span>{opt.label}</span>
                                {value === opt.value && <FaCheck className="text-xs shrink-0" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-transparent text-gray-900 dark:text-gray-100 font-['Plus_Jakarta_Sans',sans-serif] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Admin Header Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white flex items-center justify-center text-xl shadow-lg shadow-red-600/30">
                            <FaUserShield />
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

                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            onClick={loadLeads}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm transition-all border border-gray-200 dark:border-gray-700 cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
                            title={t('adminPanel.refreshBtn', "Yangilash")}
                        >
                            <FaSync className={loadingLeads ? "animate-spin" : ""} />
                            <span className="hidden xs:inline whitespace-nowrap">{t('adminPanel.refreshBtn', "Yangilash")}</span>
                        </button>

                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 font-bold text-xs sm:text-sm transition-all border border-red-500/20 cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
                        >
                            <FaSignOutAlt />
                            <span className="whitespace-nowrap">{t('adminPanel.exitBtn', "Chiqish")}</span>
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
                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg shrink-0 aspect-square">
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
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-lg shrink-0 aspect-square">
                                <FaHourglassHalf />
                            </div>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-3xl font-black text-gray-900 dark:text-white">{pendingCount}</span>
                            <span className="text-xs font-extrabold text-amber-500">{getPercent(pendingCount)}%</span>
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
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-lg shrink-0 aspect-square">
                                <FaCheckCircle />
                            </div>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-3xl font-black text-gray-900 dark:text-white">{acceptedCount}</span>
                            <span className="text-xs font-extrabold text-emerald-500">{getPercent(acceptedCount)}%</span>
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
                            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-lg shrink-0 aspect-square">
                                <FaTimesCircle />
                            </div>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-3xl font-black text-gray-900 dark:text-white">{rejectedCount}</span>
                            <span className="text-xs font-extrabold text-rose-500">{getPercent(rejectedCount)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${getPercent(rejectedCount)}%` }} />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-4 overflow-x-auto min-w-0 no-scrollbar">
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <button
                            onClick={() => setActiveTab('leads')}
                            className={`flex items-center gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                                activeTab === 'leads'
                                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                                    : 'bg-white/80 dark:bg-gray-900/80 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-800'
                            }`}
                        >
                            <FaInbox className="text-base shrink-0" />
                            <span className="whitespace-nowrap">{t('adminPanel.murojaatlarTab', "Murojaatlar")} ({leads.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('comments')}
                            className={`flex items-center gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                                activeTab === 'comments'
                                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
                                    : 'bg-white/80 dark:bg-gray-900/80 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-800'
                            }`}
                        >
                            <FaCommentDots className="text-base shrink-0" />
                            <span className="whitespace-nowrap">{t('adminPanel.commentsTab', "O'quvchilar Izohlari")}</span>
                        </button>
                    </div>

                    {activeTab === 'leads' && (
                        <div className="flex items-center gap-2.5 shrink-0 ml-auto sm:ml-0 flex-wrap">
                            <button
                                onClick={() => setShowAddLeadModal(true)}
                                className="inline-flex shrink-0 items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-red-600/30 cursor-pointer active:scale-95 whitespace-nowrap"
                            >
                                <FaUserCheck className="text-base shrink-0" />
                                <span>{t('adminPanel.addLeadBtn', "+ Ro'yxatdan o'tkazish")}</span>
                            </button>

                            <button
                                onClick={exportToCSV}
                                className="inline-flex shrink-0 items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95 whitespace-nowrap"
                            >
                                <FaFileCsv className="text-base shrink-0" />
                                <span className="hidden sm:inline whitespace-nowrap">{t('adminPanel.exportCsvBtn', "Excel (CSV) yuklab olish")}</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Tab 1: Murojaatlar */}
                {activeTab === 'leads' && (
                    <div className="space-y-6">
                        {/* Search and Filters Bar */}
                        <div className="relative z-30 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-md">
                            
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
                                <CustomSelect
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    labelIcon={<FaFilter className="text-xs text-red-600" />}
                                    labelText={t('adminPanel.statusLabel', "Status:")}
                                    options={[
                                        { value: 'all', label: t('adminPanel.allOptions', "Barchasi") },
                                        { value: 'Kutilmoqda', label: t('adminPanel.pending', "Kutilmoqda") },
                                        { value: 'Qabul qilindi', label: t('adminPanel.accepted', "Qabul Qilindi") },
                                        { value: 'Rad etildi', label: t('adminPanel.rejected', "Rad Etildi") }
                                    ]}
                                />

                                {/* Type Filter */}
                                <CustomSelect
                                    value={typeFilter}
                                    onChange={setTypeFilter}
                                    labelText={t('adminPanel.typeLabel', "Turi:")}
                                    options={[
                                        { value: 'all', label: t('adminPanel.allOptions', "Barchasi") },
                                        { value: "Bepul maslahat", label: t('adminPanel.typeFreeConsult', "Bepul maslahat") },
                                        { value: "Ro'yxatdan o'tish", label: t('adminPanel.typeRegister', "Ro'yxatdan o'tish") },
                                        { value: "Konsultatsiya", label: t('adminPanel.typeConsult', "Konsultatsiya") }
                                    ]}
                                />

                                {/* Sort Order */}
                                <CustomSelect
                                    value={sortOrder}
                                    onChange={setSortOrder}
                                    labelText={t('adminPanel.sortLabel', "Tartib:")}
                                    options={[
                                        { value: 'newest', label: t('adminPanel.newest', "Eng yangilari") },
                                        { value: 'oldest', label: t('adminPanel.oldest', "Eng eskilari") }
                                    ]}
                                />
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
                                            <div className="flex items-start justify-between gap-2 min-w-0">
                                                <div className="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
                                                    <span className="px-2.5 py-1 bg-red-600/10 text-red-600 dark:text-red-400 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider border border-red-500/20 whitespace-nowrap shrink-0 max-w-full truncate" title={lead.type || "Murojaat"}>
                                                        {lead.type || "Murojaat"}
                                                    </span>

                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold whitespace-nowrap shrink-0 ${
                                                        lead.status === 'Qabul qilindi'
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                            : lead.status === 'Rad etildi'
                                                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                                    }`}>
                                                        {lead.status === 'Qabul qilindi' ? t('adminPanel.accepted', "Qabul qilindi") : lead.status === 'Rad etildi' ? t('adminPanel.rejected', "Rad etildi") : t('adminPanel.pending', "Kutilmoqda")}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => setDeleteModalLead(lead)}
                                                    className="w-7 h-7 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-red-600 hover:text-white flex items-center justify-center text-xs font-bold text-gray-500 transition-all cursor-pointer active:scale-95 shrink-0 aspect-square mt-0.5"
                                                    title="O'chirish"
                                                >
                                                    <FaTimes className="shrink-0" />
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
                                            {lead.status !== 'Rad etildi' && (
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
                                            )}

                                            {lead.status !== 'Qabul qilindi' && (
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
                                            )}
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

            {/* Add New Lead / Student Registration Modal */}
            {showAddLeadModal && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 relative">
                        <button
                            onClick={() => setShowAddLeadModal(false)}
                            className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
                        >
                            &times;
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-red-600/10 text-red-600 flex items-center justify-center text-xl font-bold shrink-0">
                                <FaUserCheck />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                                    {t('adminPanel.addLeadTitle', "Ro'yxatdan o'tkazish")}
                                </h3>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    {t('adminPanel.addLeadSubtitle', "Yangi murojaat yoki o'quvchi ma'lumotlarini kiriting")}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleCreateLead} className="space-y-4 pt-2">
                            <div>
                                <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5">
                                    {t('adminPanel.nameLabel', "F.I.O (Ismi va Familiyasi)")}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t('adminPanel.namePlaceholder', "Masalan: Azizbek Karimov")}
                                    value={newLeadName}
                                    onChange={(e) => setNewLeadName(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-red-600 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1.5">
                                    {t('adminPanel.phoneLabel', "Telefon raqami")}
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 font-extrabold text-xs sm:text-sm text-gray-500 dark:text-gray-400 select-none pointer-events-none">
                                        +998
                                    </span>
                                    <input
                                        type="text"
                                        maxLength={9}
                                        placeholder="901234567"
                                        value={newLeadPhone}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                                            setNewLeadPhone(val);
                                        }}
                                        className="w-full pl-16 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl text-xs sm:text-sm font-extrabold tracking-wider focus:outline-none focus:border-red-600 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('adminPanel.leadTypeLabel', "Murojaat turi")}
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    {[
                                        { value: "Ro'yxatdan o'tish", label: t('adminPanel.typeRegister', "Ro'yxatdan o'tish"), icon: FaUserCheck },
                                        { value: "Bepul maslahat", label: t('adminPanel.typeFreeConsult', "Bepul maslahat"), icon: FaHeadset },
                                        { value: "Konsultatsiya", label: t('adminPanel.typeConsult', "Konsultatsiya"), icon: FaCalendarAlt }
                                    ].map((item) => {
                                        const isSelected = newLeadType === item.value;
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={item.value}
                                                type="button"
                                                onClick={() => setNewLeadType(item.value)}
                                                className={`relative p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between gap-2.5 ${
                                                    isSelected
                                                        ? 'bg-gradient-to-br from-red-600/20 via-rose-600/10 to-red-600/5 border-red-500 text-white shadow-lg shadow-red-600/25 scale-[1.02]'
                                                        : 'bg-gray-50 dark:bg-gray-950/80 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-red-500/40 hover:text-white'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs transition-colors ${
                                                        isSelected ? 'bg-red-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                                                    }`}>
                                                        <Icon />
                                                    </div>
                                                    {isSelected && (
                                                        <FaCheckCircle className="text-red-500 text-xs shrink-0" />
                                                    )}
                                                </div>
                                                <span className="text-xs font-black leading-tight">
                                                    {item.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddLeadModal(false)}
                                    className="px-5 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                                >
                                    {t('addComment.cancelBtn', "Bekor qilish")}
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-lg shadow-red-600/30 hover:scale-105 transition cursor-pointer"
                                >
                                    {t('addComment.saveBtn', "Saqlash")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Toaster position="top-right" />
        </div>
    )
}