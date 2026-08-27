const fs = require('fs');

const targetFile = 'src/components/AdminORG.jsx';
let content = fs.readFileSync(targetFile, 'utf-8');

// 1. Add state variables
const stateRegex = /const \[showAddLeadModal, setShowAddLeadModal\] = useState\(false\);/;
const newStateVars = `const [showAddLeadModal, setShowAddLeadModal] = useState(false);
    const [showAcceptLeadModal, setShowAcceptLeadModal] = useState(false);
    const [leadToAccept, setLeadToAccept] = useState(null);
    const [acceptToGroupId, setAcceptToGroupId] = useState('');`;

content = content.replace(stateRegex, newStateVars);

// 2. Update the green check button
// Old: <button onClick={() => updateLeadStatus(lead.id, 'Qabul qilindi')} className="text-emerald-500 hover:text-emerald-600 transition-colors" title="Tasdiqlash">
// New: <button onClick={() => { setLeadToAccept(lead); setShowAcceptLeadModal(true); }} className="text-emerald-500 hover:text-emerald-600 transition-colors" title="Tasdiqlash">
const oldAcceptBtn = `<button onClick={() => updateLeadStatus(lead.id, 'Qabul qilindi')} className="text-emerald-500 hover:text-emerald-600 transition-colors" title="Tasdiqlash">`;
const newAcceptBtn = `<button onClick={() => { setLeadToAccept(lead); setShowAcceptLeadModal(true); }} className="text-emerald-500 hover:text-emerald-600 transition-colors" title="Tasdiqlash">`;

content = content.replace(oldAcceptBtn, newAcceptBtn);

// 3. Add handler function
// Find where to insert, e.g. after updateLeadStatus
const updateLeadStatusFunc = `const updateLeadStatus = (id, newStatus) => {`;
const handleAcceptLeadFunc = `
    const handleAcceptLeadToGroup = () => {
        if (!acceptToGroupId) {
            toast.error("Iltimos, guruhni tanlang!");
            return;
        }
        
        // Add student to the selected group
        const newStudent = {
            id: Date.now(),
            name: leadToAccept.name,
            phone: leadToAccept.phone,
            image: null,
            gender: 'erkak' // default
        };
        
        const updatedGroups = groups.map(g => {
            if (g.id === parseInt(acceptToGroupId)) {
                return {
                    ...g,
                    students: [...(g.students || []), newStudent]
                };
            }
            return g;
        });
        
        setGroups(updatedGroups);
        localStorage.setItem('adminGroups', JSON.stringify(updatedGroups));
        
        // Update lead status
        updateLeadStatus(leadToAccept.id, 'Qabul qilindi');
        
        setShowAcceptLeadModal(false);
        setLeadToAccept(null);
        setAcceptToGroupId('');
        toast.success("O'quvchi guruhga muvaffaqiyatli qo'shildi!");
    };
    
    const updateLeadStatus = (id, newStatus) => {`;

content = content.replace(updateLeadStatusFunc, handleAcceptLeadFunc);

// 4. Add the Modal JSX at the end of the modals list, near Delete Modal for Leads
const modalsEnd = `{/* === Delete Lead Modal === */}`;
const acceptModalJSX = `
            {/* === Accept Lead to Group Modal === */}
            <AnimatePresence>
                {showAcceptLeadModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowAcceptLeadModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">O'quvchini guruhga qabul qilish</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">O'quvchi F.I.O</label>
                                    <input type="text" value={leadToAccept?.name || ''} disabled className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Mavjud Guruhlar</label>
                                    <div className="relative">
                                        <select value={acceptToGroupId} onChange={(e) => setAcceptToGroupId(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 text-gray-900 dark:text-white transition-colors appearance-none">
                                            <option value="">Guruhni tanlang...</option>
                                            {groups.map(g => (
                                                <option key={g.id} value={g.id}>{g.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            ▼
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button onClick={() => setShowAcceptLeadModal(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-colors">
                                    Bekor qilish
                                </button>
                                <button onClick={handleAcceptLeadToGroup} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors shadow-md shadow-emerald-500/20">
                                    Qabul qilish
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* === Delete Lead Modal === */}`;

content = content.replace(modalsEnd, acceptModalJSX);

fs.writeFileSync(targetFile, content);
console.log("Accept Lead to Group Modal added.");
