const fs = require('fs');

const targetFile = 'src/components/AdminORG.jsx';
let content = fs.readFileSync(targetFile, 'utf-8');

// 1. Remove photo state and add gender state, add editingGroupId
const statesTarget = `const [newStudentPhoto, setNewStudentPhoto] = useState(null)
    const [deleteModalStudent, setDeleteModalStudent] = useState(null)`;
const newStates = `const [newStudentGender, setNewStudentGender] = useState('erkak')
    const [deleteModalStudent, setDeleteModalStudent] = useState(null)
    const [editingGroupId, setEditingGroupId] = useState(null)`;
content = content.replace(statesTarget, newStates);

// 2. Remove compressImage and handlePhotoUpload
const compressTarget = `const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 150;
                    const MAX_HEIGHT = 150;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
            };
        });
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Rasm hajmi 2MB dan oshmasligi kerak!");
                return;
            }
            const compressedBase64 = await compressImage(file);
            setNewStudentPhoto(compressedBase64);
        }
    };`;
content = content.replace(compressTarget, '');

// 3. Update handleCreateOrUpdateStudent
const oldHandleCreateStudent = `photo: newStudentPhoto`;
content = content.replaceAll(oldHandleCreateStudent, `gender: newStudentGender`);
const resetPhoto = `setNewStudentPhoto(null);`;
content = content.replaceAll(resetPhoto, `setNewStudentGender('erkak');`);

// 4. Update EditStudentClick
const editStudentClickTarget = `setNewStudentPhoto(student.photo || null);`;
content = content.replace(editStudentClickTarget, `setNewStudentGender(student.gender || 'erkak');`);

// 5. Update handleCreateGroup to handle editing and updating schedules
const oldHandleCreateGroup = `const handleCreateGroup = async (e) => {
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
    }`;

const newHandleCreateGroup = `const handleCreateGroup = async (e) => {
        e.preventDefault()
        const newName = newGroupNameInput.trim()
        if (!newName) {
            toast.error("Guruh nomini kiriting!")
            return
        }

        let updatedList = [];
        let updatedSchedulesList = schedules;

        if (editingGroupId) {
            const oldGroup = groups.find(g => g.id === editingGroupId);
            const oldName = oldGroup.name;
            updatedList = groups.map(g => g.id === editingGroupId ? { ...g, name: newName } : g);
            
            // Update schedules with new group name
            updatedSchedulesList = schedules.map(s => s.group === oldName ? { ...s, group: newName } : s);
            setSchedules(updatedSchedulesList);
            localStorage.setItem('admin_schedules', JSON.stringify(updatedSchedulesList));
            axios.put(import.meta.env.VITE_FIREBASE_SCHEDULES_URL, updatedSchedulesList).catch(()=>{});
        } else {
            const newGroup = {
                id: Date.now(),
                name: newName,
            }
            updatedList = [newGroup, ...groups]
        }

        setGroups(updatedList)
        localStorage.setItem('admin_groups', JSON.stringify(updatedList))

        try {
            await axios.put(import.meta.env.VITE_FIREBASE_GROUPS_URL, updatedList)
            toast.success(editingGroupId ? "Guruh yangilandi!" : "Guruh qo'shildi!")
        } catch (e) {
            toast.success("Guruh saqlandi (lokal)!")
        }

        setNewGroupNameInput('')
        setEditingGroupId(null)
        setShowAddGroupModal(false)
    }`;
content = content.replace(oldHandleCreateGroup, newHandleCreateGroup);

// 6. Update Groups Table to add Edit button
const groupsTableActions = `<button onClick={() => setSelectedGroupDetails(group)} className="text-blue-500 hover:text-blue-600 transition-colors" title="O'quvchilarni ko'rish">
                                                                <FaRegEye className="text-xl" />
                                                            </button>
                                                            <button onClick={() => setDeleteModalGroup(group)} className="text-rose-500 hover:text-rose-600 transition-colors" title="O'chirish">
                                                                <FaTimesCircle className="text-xl" />
                                                            </button>`;
const newGroupsTableActions = `<button onClick={() => {
                                                                setEditingGroupId(group.id)
                                                                setNewGroupNameInput(group.name)
                                                                setShowAddGroupModal(true)
                                                            }} className="text-indigo-500 hover:text-indigo-600 transition-colors" title="Tahrirlash">
                                                                <FaPen className="text-lg" />
                                                            </button>
                                                            <button onClick={() => setSelectedGroupDetails(group)} className="text-blue-500 hover:text-blue-600 transition-colors" title="O'quvchilarni ko'rish">
                                                                <FaRegEye className="text-xl" />
                                                            </button>
                                                            <button onClick={() => setDeleteModalGroup(group)} className="text-rose-500 hover:text-rose-600 transition-colors" title="O'chirish">
                                                                <FaTimesCircle className="text-xl" />
                                                            </button>`;
content = content.replace(groupsTableActions, newGroupsTableActions);

// 7. Change Student List rendering in Modal to use Emojis
const oldStudentImageRender = `<div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700 border-2 border-gray-50 dark:border-gray-600 flex items-center justify-center">
                                            {student.photo ? (
                                                <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <FaUserCircle className="text-3xl text-gray-400" />
                                            )}
                                        </div>`;
const newStudentImageRender = `<div className="w-16 h-16 rounded-full shrink-0 bg-gray-50 dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 flex items-center justify-center text-4xl shadow-sm">
                                            {student.gender === 'ayol' ? '👩‍🎓' : '👨‍🎓'}
                                        </div>`;
content = content.replace(oldStudentImageRender, newStudentImageRender);

// 8. Change Student Add Modal to use Gender Selector
const oldStudentPhotoUpload = `<div className="flex justify-center">
                            <label className="relative cursor-pointer group">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 group-hover:border-indigo-500 transition-colors flex items-center justify-center">
                                    {newStudentPhoto ? (
                                        <img src={newStudentPhoto} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <FaCamera className="text-2xl text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                    )}
                                </div>
                                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                            </label>
                        </div>`;
const newStudentGenderSelector = `<div className="flex justify-center gap-6">
                            <label className={\`cursor-pointer group flex flex-col items-center gap-2 \${newStudentGender === 'erkak' ? 'scale-110' : 'opacity-50 hover:opacity-100'} transition-all\`}>
                                <div className={\`w-20 h-20 rounded-full flex items-center justify-center text-5xl bg-blue-50 dark:bg-blue-900/20 border-2 \${newStudentGender === 'erkak' ? 'border-blue-500 shadow-md' : 'border-transparent'}\`}>
                                    👨‍🎓
                                </div>
                                <span className="text-xs font-bold text-gray-500">O'g'il bola</span>
                                <input type="radio" name="gender" value="erkak" checked={newStudentGender === 'erkak'} onChange={(e) => setNewStudentGender(e.target.value)} className="hidden" />
                            </label>
                            
                            <label className={\`cursor-pointer group flex flex-col items-center gap-2 \${newStudentGender === 'ayol' ? 'scale-110' : 'opacity-50 hover:opacity-100'} transition-all\`}>
                                <div className={\`w-20 h-20 rounded-full flex items-center justify-center text-5xl bg-pink-50 dark:bg-pink-900/20 border-2 \${newStudentGender === 'ayol' ? 'border-pink-500 shadow-md' : 'border-transparent'}\`}>
                                    👩‍🎓
                                </div>
                                <span className="text-xs font-bold text-gray-500">Qiz bola</span>
                                <input type="radio" name="gender" value="ayol" checked={newStudentGender === 'ayol'} onChange={(e) => setNewStudentGender(e.target.value)} className="hidden" />
                            </label>
                        </div>`;
content = content.replace(oldStudentPhotoUpload, newStudentGenderSelector);

// 9. Update Group Add Modal Title
const addGroupTitle = `<h3 className="text-lg font-black text-gray-900 dark:text-white">Yangi guruh qo'shish</h3>`;
const newAddGroupTitle = `<h3 className="text-lg font-black text-gray-900 dark:text-white">{editingGroupId ? "Guruh nomini tahrirlash" : "Yangi guruh qo'shish"}</h3>`;
content = content.replace(addGroupTitle, newAddGroupTitle);


// Fix duplicate groups replacement issue: replace all instances of Groups Table Actions
while(content.includes(groupsTableActions)) {
   content = content.replace(groupsTableActions, newGroupsTableActions);
}

fs.writeFileSync(targetFile, content);
console.log("Refactoring complete.");
