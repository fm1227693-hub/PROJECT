const fs = require('fs');

const targetFile = 'src/components/AdminORG.jsx';
let content = fs.readFileSync(targetFile, 'utf-8');

// 1. Add state variable
const stateTarget = "const [newLeadStatus, setNewLeadStatus] = useState(\"Qabul qilindi\")";
if (!content.includes('const [newLeadGroup')) {
    content = content.replace(stateTarget, `${stateTarget}\n    const [newLeadGroup, setNewLeadGroup] = useState('')`);
}

// 2. Update handleCreateLead
const oldHandleCreateLead = `    const handleCreateLead = async (e) => {
        e.preventDefault()

        if (!newLeadName.trim()) {
            toast.error(t('adminPanel.fillNameError', "Iltimos, F.I.O ni kiriting!"))
            return
        }

        const cleanDigits = newLeadPhone.replace(/\\D/g, '')
        if (cleanDigits.length !== 9) {
            toast.error(t('adminPanel.phoneError9Digits', "Telefon raqami ro'ppa-rosa 9 ta raqamdan iborat bo'lishi kerak! (Masalan: 901234567)"))
            return
        }

        const formattedPhone = \`+998 \${cleanDigits}\`

        const now = new Date()
        const formattedDate = \`\${now.getFullYear()}-\${String(now.getMonth() + 1).padStart(2, '0')}-\${String(now.getDate()).padStart(2, '0')} \${String(now.getHours()).padStart(2, '0')}:\${String(now.getMinutes()).padStart(2, '0')}:\${String(now.getSeconds()).padStart(2, '0')}\`

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
    }`;

const newHandleCreateLead = `    const handleCreateLead = async (e) => {
        e.preventDefault()

        if (!newLeadName.trim()) {
            toast.error(t('adminPanel.fillNameError', "Iltimos, F.I.O ni kiriting!"))
            return
        }
        
        if (newLeadStatus === "Qabul qilindi" && !newLeadGroup) {
            toast.error("Iltimos, guruhni tanlang!");
            return;
        }

        const cleanDigits = newLeadPhone.replace(/\\D/g, '')
        if (cleanDigits.length !== 9) {
            toast.error(t('adminPanel.phoneError9Digits', "Telefon raqami ro'ppa-rosa 9 ta raqamdan iborat bo'lishi kerak! (Masalan: 901234567)"))
            return
        }

        const formattedPhone = \`+998 \${cleanDigits}\`

        const now = new Date()
        const formattedDate = \`\${now.getFullYear()}-\${String(now.getMonth() + 1).padStart(2, '0')}-\${String(now.getDate()).padStart(2, '0')} \${String(now.getHours()).padStart(2, '0')}:\${String(now.getMinutes()).padStart(2, '0')}:\${String(now.getSeconds()).padStart(2, '0')}\`
        
        const leadId = Date.now();

        const newLead = {
            id: leadId,
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
        
        // Add to group if a group is selected
        if (newLeadGroup) {
            const newStudent = {
                id: leadId + 1, // slightly different id to avoid collision
                name: newLeadName.trim(),
                phone: formattedPhone,
                image: null,
                gender: 'erkak'
            };
            const updatedGroups = groups.map(g => {
                if (g.id === parseInt(newLeadGroup)) {
                    return {
                        ...g,
                        students: [...(g.students || []), newStudent]
                    };
                }
                return g;
            });
            setGroups(updatedGroups);
            localStorage.setItem('admin_groups', JSON.stringify(updatedGroups));
            axios.put(import.meta.env.VITE_FIREBASE_GROUPS_URL, updatedGroups).catch(()=>{});
        }

        setNewLeadName('')
        setNewLeadPhone('')
        setNewLeadGroup('')
        setShowAddLeadModal(false)
    }`;

if (content.includes('const newLead = {')) {
    content = content.replace(oldHandleCreateLead, newHandleCreateLead);
}

// 3. Add Group selection to Modal
const oldPhoneInput = `<input type="text" maxLength={9} value={newLeadPhone} onChange={(e) => setNewLeadPhone(e.target.value.replace(/\\D/g, '').slice(0, 9))} className="w-full pl-14 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold tracking-wider focus:outline-none focus:border-red-500 text-gray-900 dark:text-white" required />
                            </div>
                        </div>`;
const newPhoneInputWithGroup = `<input type="text" maxLength={9} value={newLeadPhone} onChange={(e) => setNewLeadPhone(e.target.value.replace(/\\D/g, '').slice(0, 9))} className="w-full pl-14 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold tracking-wider focus:outline-none focus:border-red-500 text-gray-900 dark:text-white" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Guruhni tanlang</label>
                            <select value={newLeadGroup} onChange={(e) => setNewLeadGroup(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-red-500 text-gray-900 dark:text-white transition-colors" required>
                                <option value="">Tanlang...</option>
                                {groups.map(g => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </select>
                        </div>`;

if (!content.includes('Guruhni tanlang</label>')) {
    // Wait, the "Accept Lead" modal also has 'Guruhni tanlang</label>'!
    // But we are searching for the specific phone input to append after.
    content = content.replace(oldPhoneInput, newPhoneInputWithGroup);
}

fs.writeFileSync(targetFile, content);
console.log("Add Lead group selection implemented.");
