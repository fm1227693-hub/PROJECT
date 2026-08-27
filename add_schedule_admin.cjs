const fs = require('fs');
const path = require('path');

const targetFile = 'src/components/AdminORG.jsx';
let content = fs.readFileSync(targetFile, 'utf-8');

// 1. Add states
const stateTarget = `const [newLeadStatus, setNewLeadStatus] = useState("Qabul qilindi")`;
const statesToAdd = `
    const [schedules, setSchedules] = useState([])
    const [loadingSchedules, setLoadingSchedules] = useState(false)
    const [showAddScheduleModal, setShowAddScheduleModal] = useState(false)
    const [deleteModalSchedule, setDeleteModalSchedule] = useState(null)
    const [newScheduleGroup, setNewScheduleGroup] = useState('')
    const [newScheduleDays, setNewScheduleDays] = useState('')
    const [newScheduleTime, setNewScheduleTime] = useState('')
    const [editingScheduleId, setEditingScheduleId] = useState(null)
`;
content = content.replace(stateTarget, stateTarget + '\n' + statesToAdd);

// 2. Add functions
const functionsTarget = `const updateLeadStatus = async (id, newStatus) => {`;
const functionsToAdd = `
    const loadSchedules = async () => {
        setLoadingSchedules(true)
        try {
            const res = await axios.get(import.meta.env.VITE_FIREBASE_SCHEDULES_URL, {
                validateStatus: status => status < 500
            })
            if (res.status === 200 && res.data !== null) {
                const dataArray = Array.isArray(res.data) ? res.data : Object.values(res.data)
                setSchedules(dataArray)
                localStorage.setItem('admin_schedules', JSON.stringify(dataArray))
            } else if (res.data === null) {
                setSchedules([])
                localStorage.setItem('admin_schedules', '[]')
            } else {
                const stored = JSON.parse(localStorage.getItem('admin_schedules') || '[]')
                setSchedules(stored)
            }
        } catch (e) {
            const stored = JSON.parse(localStorage.getItem('admin_schedules') || '[]')
            setSchedules(stored)
        } finally {
            setLoadingSchedules(false)
        }
    }

    const handleCreateOrUpdateSchedule = async (e) => {
        e.preventDefault()
        if (!newScheduleGroup.trim() || !newScheduleDays.trim() || !newScheduleTime.trim()) {
            toast.error("Barcha maydonlarni to'ldiring!")
            return
        }

        let updatedList;
        if (editingScheduleId) {
            updatedList = schedules.map(s => s.id === editingScheduleId ? {
                ...s,
                group: newScheduleGroup.trim(),
                days: newScheduleDays.trim(),
                time: newScheduleTime.trim()
            } : s)
        } else {
            const newSchedule = {
                id: Date.now(),
                group: newScheduleGroup.trim(),
                days: newScheduleDays.trim(),
                time: newScheduleTime.trim()
            }
            updatedList = [newSchedule, ...schedules]
        }

        setSchedules(updatedList)
        localStorage.setItem('admin_schedules', JSON.stringify(updatedList))

        try {
            await axios.put(import.meta.env.VITE_FIREBASE_SCHEDULES_URL, updatedList)
            toast.success(editingScheduleId ? "Jadval yangilandi!" : "Jadval qo'shildi!")
        } catch (e) {
            toast.success("Jadval saqlandi (lokal)!")
        }

        setNewScheduleGroup('')
        setNewScheduleDays('')
        setNewScheduleTime('')
        setEditingScheduleId(null)
        setShowAddScheduleModal(false)
    }

    const handleDeleteSchedule = async (id) => {
        const updatedList = schedules.filter(item => item.id !== id)
        setSchedules(updatedList)
        localStorage.setItem('admin_schedules', JSON.stringify(updatedList))

        try {
            await axios.put(import.meta.env.VITE_FIREBASE_SCHEDULES_URL, updatedList)
        } catch (e) {
            // silent catch
        }
        toast.success("Jadval o'chirildi!")
        setDeleteModalSchedule(null)
    }

    const handleEditScheduleClick = (schedule) => {
        setEditingScheduleId(schedule.id)
        setNewScheduleGroup(schedule.group)
        setNewScheduleDays(schedule.days)
        setNewScheduleTime(schedule.time)
        setShowAddScheduleModal(true)
    }
`;
content = content.replace(functionsTarget, functionsToAdd + '\n\n' + functionsTarget);

// 3. Update useEffect
const useEffectTarget = `
useEffect(() => {
    loadLeads()
    const interval = setInterval(() => {
        loadLeads()
    }, 3000)
    return () => clearInterval(interval)
}, [])
`.trim();
const useEffectReplacement = `
useEffect(() => {
    loadLeads()
    loadSchedules()
    const interval = setInterval(() => {
        loadLeads()
        loadSchedules()
    }, 3000)
    return () => clearInterval(interval)
}, [])
`.trim();
content = content.replace(useEffectTarget, useEffectReplacement);

// 4. Update Header Tabs
const h1Target = `{activeTab === 'leads' ? t('adminPanel.murojaatlarTab', 'Murojaatlar').toUpperCase() : t('adminPanel.CommentsORGTab', "O'quvchilar Izohlari").toUpperCase()}`;
const h1Replacement = `{activeTab === 'leads' ? t('adminPanel.murojaatlarTab', 'Murojaatlar').toUpperCase() : activeTab === 'schedules' ? "DARS JADVALI" : t('adminPanel.CommentsORGTab', "O'quvchilar Izohlari").toUpperCase()}`;
content = content.replace(h1Target, h1Replacement);

// Update Header sync button
const syncBtnTarget = `<FaSync className={loadingLeads ? "animate-spin" : ""} />`;
const syncBtnReplacement = `<FaSync className={loadingLeads || loadingSchedules ? "animate-spin" : ""} />`;
content = content.replace(syncBtnTarget, syncBtnReplacement);

const loadBtnTarget = `onClick={loadLeads}`;
const loadBtnReplacement = `onClick={() => { loadLeads(); loadSchedules(); }}`;
content = content.replace(loadBtnTarget, loadBtnReplacement);

// 5. Add Sidebar item
const sidebarItemTarget = `<SidebarItem icon={<FaCommentDots />} label={t('adminPanel.CommentsORGTab', "O'quvchilar Izohlari")} isActive={activeTab === 'CommentsORG'} onClick={() => setActiveTab('CommentsORG')} />`;
const sidebarItemReplacement = sidebarItemTarget + `\n                    <SidebarItem icon={<FaCalendarAlt />} label="Dars jadvali" isActive={activeTab === 'schedules'} onClick={() => setActiveTab('schedules')} />`;
content = content.replace(sidebarItemTarget, sidebarItemReplacement);

// 6. Add UI Tab Content
const commentTabTarget = `{activeTab === 'CommentsORG' && (`;
const scheduleTabContent = `
                {activeTab === 'schedules' && (
                    <div className="space-y-8 max-w-[1400px] mx-auto">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col relative">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dars jadvallari</h2>
                                <button onClick={() => {
                                    setEditingScheduleId(null)
                                    setNewScheduleGroup('')
                                    setNewScheduleDays('')
                                    setNewScheduleTime('')
                                    setShowAddScheduleModal(true)
                                }} className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-red-600/20 whitespace-nowrap">
                                    + Guruh qo'shish
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {schedules.length === 0 ? (
                                    <div className="col-span-full py-8 text-center text-gray-500 font-bold">
                                        Jadvallar topilmadi
                                    </div>
                                ) : (
                                    schedules.map(schedule => (
                                        <div key={schedule.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 flex flex-col space-y-4 hover:border-red-500/30 transition-colors">
                                            <div>
                                                <h3 className="text-lg font-black text-gray-900 dark:text-white">{schedule.group}</h3>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                <FaCalendarAlt className="text-red-500 text-lg" />
                                                <span className="font-bold">{schedule.days}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                <FaCalendarAlt className="text-transparent" /> {/* Spacer */}
                                                <span className="absolute -ml-8 text-lg">⏰</span>
                                                <span className="font-bold">{schedule.time}</span>
                                            </div>
                                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
                                                <button onClick={() => handleEditScheduleClick(schedule)} className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 rounded-xl text-sm font-bold transition-colors">Tahrirlash</button>
                                                <button onClick={() => setDeleteModalSchedule(schedule)} className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:hover:bg-rose-900/30 dark:text-rose-400 rounded-xl text-sm font-bold transition-colors">O'chirish</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
`;
content = content.replace(commentTabTarget, scheduleTabContent + '\n                ' + commentTabTarget);

// 7. Add Modals
const addLeadModalTarget = `{showAddLeadModal && (`;
const scheduleModals = \`
        {deleteModalSchedule && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-5 relative">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center text-2xl mx-auto">
                        <FaTrash />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white">Ushbu jadvalni o'chirmoqchimisiz?</h3>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-2">{deleteModalSchedule.group}</p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2">
                        <button onClick={() => setDeleteModalSchedule(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">Bekor qilish</button>
                        <button onClick={() => handleDeleteSchedule(deleteModalSchedule.id)} className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-500/30 transition">O'chirish</button>
                    </div>
                </div>
            </div>
        )}

        {showAddScheduleModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center text-xl font-bold shrink-0">
                            <FaCalendarAlt />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">{editingScheduleId ? "Jadvalni tahrirlash" : "Yangi jadval qo'shish"}</h3>
                        </div>
                    </div>

                    <form onSubmit={handleCreateOrUpdateSchedule} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Guruh nomi (Masalan: IELTS Beginner)</label>
                            <input type="text" value={newScheduleGroup} onChange={(e) => setNewScheduleGroup(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-red-500 text-gray-900 dark:text-white" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Kunlar (Masalan: Du-Chor-Juma)</label>
                            <input type="text" value={newScheduleDays} onChange={(e) => setNewScheduleDays(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-red-500 text-gray-900 dark:text-white" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Vaqti (Masalan: 14:00 - 15:30)</label>
                            <input type="text" value={newScheduleTime} onChange={(e) => setNewScheduleTime(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-red-500 text-gray-900 dark:text-white" required />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowAddScheduleModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">Bekor qilish</button>
                            <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-sm shadow-md shadow-red-600/20 hover:from-red-500 hover:to-rose-500 transition">Saqlash</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
\`;
content = content.replace(addLeadModalTarget, scheduleModals + '\n        ' + addLeadModalTarget);

fs.writeFileSync(targetFile, content);
console.log('Successfully refactored AdminORG.jsx');
