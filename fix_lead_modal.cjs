const fs = require('fs');

const targetFile = 'src/components/AdminORG.jsx';
let content = fs.readFileSync(targetFile, 'utf-8');

// Check if we already inserted the modal and handle func (just in case)
if (!content.includes('handleAcceptLeadToGroup')) {
    // 1. Insert handleAcceptLeadToGroup
    const oldFunc = `const updateLeadStatus = async (id, newStatus) => {`;
    const newFunc = `const handleAcceptLeadToGroup = () => {
        if (!acceptToGroupId) {
            toast.error("Iltimos, guruhni tanlang!");
            return;
        }
        
        const newStudent = {
            id: Date.now(),
            name: leadToAccept.name,
            phone: leadToAccept.phone,
            image: null,
            gender: 'erkak'
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
        
        updateLeadStatus(leadToAccept.id, 'Qabul qilindi');
        
        setShowAcceptLeadModal(false);
        setLeadToAccept(null);
        setAcceptToGroupId('');
        toast.success("O'quvchi guruhga muvaffaqiyatli qo'shildi!");
    };
    
    const updateLeadStatus = async (id, newStatus) => {`;
    
    content = content.replace(oldFunc, newFunc);
}

if (!content.includes("O'quvchini guruhga qabul qilish")) {
    // 2. Insert Modal JSX
    const oldModalJSX = `{deleteModalLead && (`;
    const newModalJSX = `{showAcceptLeadModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-5 relative">
                    <div className="flex flex-col gap-2 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center text-xl font-bold shrink-0 mb-2">
                            <FaCheckCircle />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white">O'quvchini qabul qilish</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Murojaatchi</label>
                            <input type="text" value={leadToAccept?.name || ''} disabled className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Guruhni tanlang</label>
                            <select value={acceptToGroupId} onChange={(e) => setAcceptToGroupId(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 text-gray-900 dark:text-white transition-colors">
                                <option value="">Tanlang...</option>
                                {groups.map(g => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                        <button onClick={() => setShowAcceptLeadModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">Bekor qilish</button>
                        <button onClick={handleAcceptLeadToGroup} className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition">Qabul qilish</button>
                    </div>
                </div>
            </div>
        )}

        {deleteModalLead && (`;

    content = content.replace(oldModalJSX, newModalJSX);
}

fs.writeFileSync(targetFile, content);
console.log("Fixed accept modal injection.");
