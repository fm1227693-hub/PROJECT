const fs = require('fs');

const targetFile = 'src/components/AdminORG.jsx';
let content = fs.readFileSync(targetFile, 'utf-8');

// 1. Update state initialization
content = content.replace(
    `const [newScheduleDays, setNewScheduleDays] = useState('')`,
    `const [newScheduleDays, setNewScheduleDays] = useState([])`
);

// 2. Add daysList and timesList right after imports
content = content.replace(
    `export default function AdminORG() {`,
    `export default function AdminORG() {\n    const daysList = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'];\n    const timesList = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];`
);

// 3. Update handleCreateOrUpdateSchedule logic
const oldHandleCreate = `    const handleCreateOrUpdateSchedule = async (e) => {
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
        }`;

const newHandleCreate = `    const handleCreateOrUpdateSchedule = async (e) => {
        e.preventDefault()
        if (!newScheduleGroup.trim() || newScheduleDays.length === 0 || !newScheduleTime.trim()) {
            toast.error("Barcha maydonlarni to'ldiring!")
            return
        }

        const isOverlap = schedules.some(s => {
            if (editingScheduleId && s.id === editingScheduleId) return false;
            if (s.time === newScheduleTime) {
                const sDays = Array.isArray(s.days) ? s.days : [s.days];
                return newScheduleDays.some(d => sDays.includes(d));
            }
            return false;
        });

        if (isOverlap) {
            toast.error("Xatolik! Bu vaqt va kunda boshqa guruhga dars belgilangan.");
            return;
        }

        let updatedList;
        if (editingScheduleId) {
            updatedList = schedules.map(s => s.id === editingScheduleId ? {
                ...s,
                group: newScheduleGroup.trim(),
                days: newScheduleDays,
                time: newScheduleTime.trim()
            } : s)
        } else {
            const newSchedule = {
                id: Date.now(),
                group: newScheduleGroup.trim(),
                days: newScheduleDays,
                time: newScheduleTime.trim()
            }
            updatedList = [newSchedule, ...schedules]
        }`;

content = content.replace(oldHandleCreate, newHandleCreate);

// 4. Update the Schedule grid to Table
const oldGrid = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                                <FaCalendarAlt className="text-transparent" />
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
                            </div>`;

const newTable = `<div className="overflow-x-auto custom-scrollbar pb-2">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800 text-xs lg:text-sm font-bold text-gray-500 dark:text-gray-400">
                                            <th className="py-4 px-4 font-medium">Guruh Nomi</th>
                                            <th className="py-4 px-4 font-medium">Kunlar</th>
                                            <th className="py-4 px-4 font-medium">Vaqti</th>
                                            <th className="py-4 px-4 font-medium text-right">Amallar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedules.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="py-8 text-center text-gray-500">
                                                    Jadvallar topilmadi
                                                </td>
                                            </tr>
                                        ) : (
                                            schedules.map(schedule => (
                                                <tr key={schedule.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition text-sm">
                                                    <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">{schedule.group}</td>
                                                    <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{Array.isArray(schedule.days) ? schedule.days.join(', ') : schedule.days}</td>
                                                    <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                                                        <span className="inline-block px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                                                            {schedule.time}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button onClick={() => handleEditScheduleClick(schedule)} className="text-gray-400 hover:text-blue-500 transition-colors" title="Tahrirlash">
                                                                <FaRegEye className="text-lg" />
                                                            </button>
                                                            <button onClick={() => setDeleteModalSchedule(schedule)} className="text-rose-500 hover:text-rose-600 transition-colors" title="O'chirish">
                                                                <FaTimesCircle className="text-xl" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>`;

content = content.replace(oldGrid, newTable);

// 5. Update Schedule Modal Forms
const oldModalInputs = `                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Kunlar (Masalan: Du-Chor-Juma)</label>
                            <input type="text" value={newScheduleDays} onChange={(e) => setNewScheduleDays(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-red-500 text-gray-900 dark:text-white" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Vaqti (Masalan: 14:00 - 15:30)</label>
                            <input type="text" value={newScheduleTime} onChange={(e) => setNewScheduleTime(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-red-500 text-gray-900 dark:text-white" required />
                        </div>`;

const newModalInputs = `                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Kunlar</label>
                            <div className="flex flex-wrap gap-2">
                                {daysList.map(d => (
                                    <label key={d} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <input type="checkbox" checked={newScheduleDays.includes(d)} onChange={(e) => {
                                            if (e.target.checked) setNewScheduleDays([...newScheduleDays, d])
                                            else setNewScheduleDays(newScheduleDays.filter(day => day !== d))
                                        }} className="w-4 h-4 text-red-600 rounded focus:ring-red-500" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{d}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Vaqti</label>
                            <select value={newScheduleTime} onChange={(e) => setNewScheduleTime(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-red-500 text-gray-900 dark:text-white" required>
                                <option value="">Vaqtni tanlang</option>
                                {timesList.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>`;

content = content.replace(oldModalInputs, newModalInputs);

// Update editing handling to parse array
const editClickOld = `    const handleEditScheduleClick = (schedule) => {
        setEditingScheduleId(schedule.id)
        setNewScheduleGroup(schedule.group)
        setNewScheduleDays(schedule.days)
        setNewScheduleTime(schedule.time)
        setShowAddScheduleModal(true)
    }`;

const editClickNew = `    const handleEditScheduleClick = (schedule) => {
        setEditingScheduleId(schedule.id)
        setNewScheduleGroup(schedule.group)
        setNewScheduleDays(Array.isArray(schedule.days) ? schedule.days : [schedule.days])
        setNewScheduleTime(schedule.time)
        setShowAddScheduleModal(true)
    }`;

content = content.replace(editClickOld, editClickNew);

fs.writeFileSync(targetFile, content);
console.log("Refactoring complete.");
