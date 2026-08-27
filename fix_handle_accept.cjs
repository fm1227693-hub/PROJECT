const fs = require('fs');

const targetFile = 'src/components/AdminORG.jsx';
let content = fs.readFileSync(targetFile, 'utf-8');

const oldFunc = `const handleAcceptLeadToGroup = () => {
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
    };`;

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
        localStorage.setItem('admin_groups', JSON.stringify(updatedGroups));
        axios.put(import.meta.env.VITE_FIREBASE_GROUPS_URL, updatedGroups).catch(()=>{});
        
        updateLeadStatus(leadToAccept.id, 'Qabul qilindi');
        
        setShowAcceptLeadModal(false);
        setLeadToAccept(null);
        setAcceptToGroupId('');
        toast.success("O'quvchi guruhga muvaffaqiyatli qo'shildi!");
    };`;

content = content.replace(oldFunc, newFunc);
fs.writeFileSync(targetFile, content);
console.log("Fixed handleAcceptLeadToGroup bug.");
