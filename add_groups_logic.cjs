const fs = require('fs');

const targetFile = 'src/components/AdminORG.jsx';
let content = fs.readFileSync(targetFile, 'utf-8');

// 1. Add states
const statesTarget = `const [editingScheduleId, setEditingScheduleId] = useState(null)`;
const newStates = `const [editingScheduleId, setEditingScheduleId] = useState(null)
    const [groups, setGroups] = useState([])
    const [loadingGroups, setLoadingGroups] = useState(false)
    const [showAddGroupModal, setShowAddGroupModal] = useState(false)
    const [deleteModalGroup, setDeleteModalGroup] = useState(null)
    const [newGroupNameInput, setNewGroupNameInput] = useState('')`;
content = content.replace(statesTarget, newStates);

// 2. Add functions
const functionsTarget = `const handleCreateOrUpdateSchedule = async (e) => {`;
const newFunctions = `    const loadGroups = async () => {
        setLoadingGroups(true)
        try {
            const res = await axios.get(import.meta.env.VITE_FIREBASE_GROUPS_URL, {
                validateStatus: status => status < 500
            })
            if (res.status === 200 && res.data !== null) {
                const dataArray = Array.isArray(res.data) ? res.data : Object.values(res.data)
                setGroups(dataArray)
                localStorage.setItem('admin_groups', JSON.stringify(dataArray))
            } else if (res.data === null) {
                setGroups([])
                localStorage.setItem('admin_groups', '[]')
            } else {
                const stored = JSON.parse(localStorage.getItem('admin_groups') || '[]')
                setGroups(stored)
            }
        } catch (e) {
            const stored = JSON.parse(localStorage.getItem('admin_groups') || '[]')
            setGroups(stored)
        } finally {
            setLoadingGroups(false)
        }
    }

    const handleCreateGroup = async (e) => {
        e.preventDefault()
        if (!newGroupNameInput.trim()) {
            toast.error("Guruh nomini kiriting!")
            return
        }

        const newGroup = {
            id: Date.now(),
            name: newGroupNameInput.trim(),
        }
        const updatedList = [newGroup, ...groups]

        setGroups(updatedList)
        localStorage.setItem('admin_groups', JSON.stringify(updatedList))

        try {
            await axios.put(import.meta.env.VITE_FIREBASE_GROUPS_URL, updatedList)
            toast.success("Guruh qo'shildi!")
        } catch (e) {
            toast.success("Guruh saqlandi (lokal)!")
        }

        setNewGroupNameInput('')
        setShowAddGroupModal(false)
    }

    const handleDeleteGroup = async (id) => {
        const updatedList = groups.filter(item => item.id !== id)
        setGroups(updatedList)
        localStorage.setItem('admin_groups', JSON.stringify(updatedList))

        try {
            await axios.put(import.meta.env.VITE_FIREBASE_GROUPS_URL, updatedList)
        } catch (e) {
        }
        toast.success("Guruh o'chirildi!")
        setDeleteModalGroup(null)
    }

    const handleCreateOrUpdateSchedule = async (e) => {`;
content = content.replace(functionsTarget, newFunctions);

// 3. Update useEffect
const useEffectTarget = `useEffect(() => {
    loadLeads()
    loadSchedules()
    const interval = setInterval(() => {
        loadLeads()
        loadSchedules()
    }, 3000)
    return () => clearInterval(interval)
}, [])`;
const newUseEffect = `useEffect(() => {
    loadLeads()
    loadSchedules()
    loadGroups()
    const interval = setInterval(() => {
        loadLeads()
        loadSchedules()
        loadGroups()
    }, 3000)
    return () => clearInterval(interval)
}, [])`;
content = content.replace(useEffectTarget, newUseEffect);

// Sync button
content = content.replace(
    `<FaSync className={loadingLeads || loadingSchedules ? "animate-spin" : ""} />`,
    `<FaSync className={loadingLeads || loadingSchedules || loadingGroups ? "animate-spin" : ""} />`
);
content = content.replace(
    `onClick={() => { loadLeads(); loadSchedules(); }}`,
    `onClick={() => { loadLeads(); loadSchedules(); loadGroups(); }}`
);

// 4. Update the add schedule modal to use dropdown
const modalInputTarget = `                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Guruh nomi (Masalan: IELTS Beginner)</label>
                            <input type="text" value={newScheduleGroup} onChange={(e) => setNewScheduleGroup(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-red-500 text-gray-900 dark:text-white" required />
                        </div>`;
const newModalInput = `                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Guruh nomi</label>
                            <select value={newScheduleGroup} onChange={(e) => setNewScheduleGroup(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-red-500 text-gray-900 dark:text-white" required>
                                <option value="">Guruhni tanlang</option>
                                {groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                            </select>
                        </div>`;
content = content.replace(modalInputTarget, newModalInput);

// 5. Add Groups UI table
const groupsUITarget = `                        </div>
                    </div>
                )}
                {activeTab === 'CommentsORG'`;
const newGroupsUI = `                        </div>
                        
                        {/* GROUPS TABLE */}
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col relative mt-8">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Guruhlar</h2>
                                <button onClick={() => {
                                    setNewGroupNameInput('')
                                    setShowAddGroupModal(true)
                                }} className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-red-600/20 whitespace-nowrap">
                                    + Guruh qo'shish
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto custom-scrollbar pb-2">
                                <table className="w-full text-left border-collapse min-w-[500px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800 text-xs lg:text-sm font-bold text-gray-500 dark:text-gray-400">
                                            <th className="py-4 px-4 font-medium">Guruh Nomi</th>
                                            <th className="py-4 px-4 font-medium text-right">Amallar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groups.length === 0 ? (
                                            <tr>
                                                <td colSpan="2" className="py-8 text-center text-gray-500">
                                                    Guruhlar topilmadi
                                                </td>
                                            </tr>
                                        ) : (
                                            groups.map(group => (
                                                <tr key={group.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition text-sm">
                                                    <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">{group.name}</td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button onClick={() => setDeleteModalGroup(group)} className="text-rose-500 hover:text-rose-600 transition-colors" title="O'chirish">
                                                                <FaTimesCircle className="text-xl" />
                                                            </button>
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
                {activeTab === 'CommentsORG'`;
content = content.replace(groupsUITarget, newGroupsUI);


// 6. Add Groups Modals
const modalsTarget = `{deleteModalLead && (`;
const newModals = `{deleteModalGroup && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-5 relative">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center text-2xl mx-auto">
                        <FaTrash />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white">Ushbu guruhni o'chirmoqchimisiz?</h3>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-2">{deleteModalGroup.name}</p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2">
                        <button onClick={() => setDeleteModalGroup(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">Bekor qilish</button>
                        <button onClick={() => handleDeleteGroup(deleteModalGroup.id)} className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-500/30 transition">O'chirish</button>
                    </div>
                </div>
            </div>
        )}

        {showAddGroupModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center text-xl font-bold shrink-0">
                            <FaUsers />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">Yangi guruh qo'shish</h3>
                        </div>
                    </div>

                    <form onSubmit={handleCreateGroup} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Guruh nomi (Masalan: IELTS Beginner)</label>
                            <input type="text" value={newGroupNameInput} onChange={(e) => setNewGroupNameInput(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-red-500 text-gray-900 dark:text-white" required />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowAddGroupModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">Bekor qilish</button>
                            <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-sm shadow-md shadow-red-600/20 hover:from-red-500 hover:to-rose-500 transition">Saqlash</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {deleteModalLead && (`;
content = content.replace(modalsTarget, newModals);

fs.writeFileSync(targetFile, content);
console.log("Refactoring complete.");
