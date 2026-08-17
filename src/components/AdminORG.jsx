import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import CommentsORG from './TikTokComments'
import toast, { Toaster } from 'react-hot-toast'
import { 
    FaUserCheck, FaPhoneAlt, FaCalendarAlt, FaSearch, FaCommentDots, 
    FaSignOutAlt, FaSync, FaFileCsv, FaFilter, FaChartBar, 
    FaCheckCircle, FaTimesCircle, FaUsers, FaTrash, FaHeadset, 
    FaChevronDown, FaUserShield, FaClipboardList, FaProjectDiagram, 
    FaGlobe, FaShieldAlt, FaExclamationTriangle, FaRegEye, FaEnvelope
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function AdminORG() {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('leads') // 'leads' or 'CommentsORG'
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
            await axios.put(import.meta.env.VITE_FIREBASE_DB_URL, updatedList)
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
            await axios.put(import.meta.env.VITE_FIREBASE_DB_URL, updatedList)
        } catch (e) {
            // silent catch
        }
        toast.success(t('adminPanel.deleteSuccess', "Murojaat o'chirildi!"))
        setDeleteModalLead(null)
    }

    const loadLeads = async () => {
        setLoadingLeads(true)
        try {
            const res = await axios.get(import.meta.env.VITE_FIREBASE_DB_URL, {
                validateStatus: status => status < 500
            })
            if (res.status === 200 && res.data !== null) {
                const dataArray = Array.isArray(res.data) ? res.data : Object.values(res.data)
                setLeads(dataArray)
                localStorage.setItem('admin_leads', JSON.stringify(dataArray))
            } else if (res.data === null) {
                setLeads([])
localStorage.setItem('admin_leads', '[]')
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
        await axios.put(import.meta.env.VITE_FIREBASE_DB_URL, updatedList)
    } catch (e) {
        // silent
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

const totalCount = leads.length
const acceptedCount = leads.filter(l => l.status === 'Qabul qilindi').length
const rejectedCount = leads.filter(l => l.status === 'Rad etildi').length
const pendingCount = leads.filter(l => l.status === 'Kutilmoqda' || !l.status).length

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

const SidebarItem = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-bold ${isActive
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
            }`}
    >
        <span className="text-lg shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
    </button>
)

const StatCard = ({ value, label }) => (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col justify-center space-y-2 hover:border-red-500/30 transition-colors">
        <span className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">{value}</span>
        <span className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</span>
    </div>
)

return (
    <div className="flex min-h-screen pt-20 lg:pt-[76px] bg-gray-50/50 dark:bg-[#070b14] font-['Plus_Jakarta_Sans',sans-serif] text-gray-900 dark:text-gray-100 relative">
        <Toaster position="top-center" />
        {/* Sidebar Wrapper */}
        <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 hidden lg:block shrink-0 relative">
            {/* Sticky Inner Container */}
            <div className="sticky top-[76px] flex flex-col h-[calc(100vh-76px)]">
                <div className="p-6 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white flex items-center justify-center text-lg shadow-lg shadow-red-600/30">
                        <FaUserShield />
                    </div>
                    <span className="font-black text-xl tracking-tight text-gray-900 dark:text-white">OPTIMUM</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
                    <SidebarItem icon={<FaChartBar />} label={t('adminPanel.murojaatlarTab', "Murojaatlar")} isActive={activeTab === 'leads'} onClick={() => setActiveTab('leads')} />
                    <SidebarItem icon={<FaCommentDots />} label={t('adminPanel.CommentsORGTab', "O'quvchilar Izohlari")} isActive={activeTab === 'CommentsORG'} onClick={() => setActiveTab('CommentsORG')} />
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors font-bold text-sm">
                            <FaSignOutAlt />
                            <span>{t('adminPanel.exitBtn', "Chiqish")}</span>
                        </Link>
                    </div>
                </nav>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <header className="px-4 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shrink-0">
                <div className="flex items-center gap-3">
                    {/* Mobile menu button could go here */}
                    <h1 className="text-xl lg:text-3xl font-black uppercase text-gray-900 dark:text-white tracking-wide">
                        {activeTab === 'leads' ? t('adminPanel.murojaatlarTab', 'Murojaatlar').toUpperCase() : t('adminPanel.CommentsORGTab', "O'quvchilar Izohlari").toUpperCase()}
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={loadLeads} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-gray-700">
                        <FaSync className={loadingLeads ? "animate-spin" : ""} />
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 p-4 lg:p-8">
                {activeTab === 'leads' && (
                    <div className="space-y-8 max-w-[1400px] mx-auto">
                        {/* 4 Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                            <StatCard value={pendingCount} label={t('adminPanel.pending', "Kutilmoqda")} />
                            <StatCard value={totalCount} label={t('adminPanel.totalLeads', "Jami Murojaatlar")} />
                            <StatCard value={acceptedCount} label={t('adminPanel.accepted', "Qabul Qilindi")} />
                            <StatCard value={rejectedCount} label={t('adminPanel.rejected', "Rad Etildi")} />
                        </div>

                        {/* Table Section */}
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col relative">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('adminPanel.latestRequests', "So'nggi murojaatlar")}</h2>
                                <div className="flex items-center gap-3 w-full lg:w-auto">
                                    <button onClick={() => setShowAddLeadModal(true)} className="flex-1 lg:flex-none px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-red-600/20 whitespace-nowrap">
                                        {t('adminPanel.addLeadBtn', "+ Qo'shish")}
                                    </button>
                                    <button onClick={exportToCSV} className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-500/20" title="Yuklab olish">
                                        <FaFileCsv className="text-lg" />
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto custom-scrollbar pb-2">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800 text-xs lg:text-sm font-bold text-gray-500 dark:text-gray-400">
                                            <th className="py-4 px-4 font-medium">{t('adminPanel.nameLabel', "F.I.O")}</th>
                                            <th className="py-4 px-4 font-medium">{t('adminPanel.typeLabel', "Turi")}</th>
                                            <th className="py-4 px-4 font-medium">{t('adminPanel.phoneLabel', "Telefon")}</th>
                                            <th className="py-4 px-4 font-medium">{t('adminPanel.dateLabel', "Sana")}</th>
                                            <th className="py-4 px-4 font-medium">{t('adminPanel.statusLabel', "Status")}</th>
                                            <th className="py-4 px-4 font-medium text-right">{t('adminPanel.actionsLabel', "Amallar")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLeads.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="py-8 text-center text-gray-500">
                                                    Murojaatlar topilmadi
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredLeads.map(lead => (
                                                <tr key={lead.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition text-sm">
                                                    <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">{lead.name}</td>
                                                    <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{lead.type || "Murojaat"}</td>
                                                    <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{lead.phone}</td>
                                                    <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{lead.date}</td>
                                                    <td className="py-4 px-4">
                                                        <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${lead.status === 'Qabul qilindi' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                                                lead.status === 'Rad etildi' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' :
                                                                    'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                                                            }`}>
                                                            {lead.status === 'Qabul qilindi' ? t('adminPanel.accepted', "Qabul qilindi") : lead.status === 'Rad etildi' ? t('adminPanel.rejected', "Rad etildi") : t('adminPanel.pending', "Kutilmoqda")}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button onClick={() => setDeleteModalLead(lead)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" title="Ko'rish / O'chirish">
                                                                <FaRegEye className="text-lg" />
                                                            </button>
                                                            {lead.status !== 'Qabul qilindi' ? (
                                                                <button onClick={() => updateLeadStatus(lead.id, 'Qabul qilindi')} className="text-emerald-500 hover:text-emerald-600 transition-colors" title="Tasdiqlash">
                                                                    <FaCheckCircle className="text-xl" />
                                                                </button>
                                                            ) : (
                                                                <FaCheckCircle className="text-xl text-gray-300 dark:text-gray-700" />
                                                            )}
                                                            {lead.status !== 'Rad etildi' ? (
                                                                <button onClick={() => updateLeadStatus(lead.id, 'Rad etildi')} className="text-rose-500 hover:text-rose-600 transition-colors" title="Rad etish">
                                                                    <FaTimesCircle className="text-xl" />
                                                                </button>
                                                            ) : (
                                                                <FaTimesCircle className="text-xl text-gray-300 dark:text-gray-700" />
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'CommentsORG' && (
                    <div className="max-w-[1400px] mx-auto bg-white dark:bg-gray-900 rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                        <CommentsORG isAdmin={true} />
                    </div>
                )}
            </div>
        </main>

        {/* Modals are kept similar */}
        {deleteModalLead && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-5 relative">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center text-2xl mx-auto">
                        <FaTrash />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white">Ushbu murojaatni o'chirmoqchimisiz?</h3>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-2">{deleteModalLead.name}</p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2">
                        <button onClick={() => setDeleteModalLead(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">{t('adminPanel.noBtn', "Bekor qilish")}</button>
                        <button onClick={() => handleDeleteLead(deleteModalLead.id)} className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-500/30 transition">{t('adminPanel.yesBtn', "O'chirish")}</button>
                    </div>
                </div>
            </div>
        )}

        {showAddLeadModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center text-xl font-bold shrink-0">
                            <FaUserCheck />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">{t('adminPanel.addLeadTitle', "Yangi qo'shish")}</h3>
                        </div>
                    </div>

                    <form onSubmit={handleCreateLead} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('adminPanel.nameLabel', "F.I.O")}</label>
                            <input type="text" value={newLeadName} onChange={(e) => setNewLeadName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-red-500 text-gray-900 dark:text-white" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('adminPanel.phoneLabel', "Telefon")}</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 font-bold text-sm text-gray-400 pointer-events-none">+998</span>
                                <input type="text" maxLength={9} value={newLeadPhone} onChange={(e) => setNewLeadPhone(e.target.value.replace(/\D/g, '').slice(0, 9))} className="w-full pl-14 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold tracking-wider focus:outline-none focus:border-red-500 text-gray-900 dark:text-white" required />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowAddLeadModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">{t('adminPanel.noBtn', "Bekor qilish")}</button>
                            <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-sm shadow-md shadow-red-600/20 hover:from-red-500 hover:to-rose-500 transition">{t('adminPanel.saveBtn', "Saqlash")}</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
)
}