const fs = require('fs');

const targetFile = 'src/components/AdminORG.jsx';
let content = fs.readFileSync(targetFile, 'utf-8');

// 1. Add Icons
const iconsTarget = `FaGlobe, FaShieldAlt, FaExclamationTriangle, FaRegEye, FaEnvelope`;
const newIcons = `FaGlobe, FaShieldAlt, FaExclamationTriangle, FaRegEye, FaEnvelope, FaUserEdit, FaUserPlus, FaCamera, FaPen, FaUserCircle`;
content = content.replace(iconsTarget, newIcons);

// 2. Add States
const statesTarget = `const [newGroupNameInput, setNewGroupNameInput] = useState('')`;
const newStates = `const [newGroupNameInput, setNewGroupNameInput] = useState('')
    const [selectedGroupDetails, setSelectedGroupDetails] = useState(null)
    const [showAddStudentModal, setShowAddStudentModal] = useState(false)
    const [editingStudentId, setEditingStudentId] = useState(null)
    const [newStudentName, setNewStudentName] = useState('')
    const [newStudentPhone, setNewStudentPhone] = useState('')
    const [newStudentPhoto, setNewStudentPhoto] = useState(null)
    const [deleteModalStudent, setDeleteModalStudent] = useState(null)`;
content = content.replace(statesTarget, newStates);

// 3. Add Student Functions
const functionsTarget = `const handleCreateGroup = async (e) => {`;
const newFunctions = `const compressImage = (file) => {
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
    };

    const handleCreateOrUpdateStudent = async (e) => {
        e.preventDefault();
        if (!newStudentName.trim() || !newStudentPhone.trim()) {
            toast.error("Iltimos, ism va telefon raqamni kiriting!");
            return;
        }

        const currentGroup = groups.find(g => g.id === selectedGroupDetails.id);
        let students = currentGroup.students || [];

        let updatedStudents;
        if (editingStudentId) {
            updatedStudents = students.map(st => st.id === editingStudentId ? {
                ...st,
                name: newStudentName.trim(),
                phone: newStudentPhone.trim(),
                photo: newStudentPhoto
            } : st);
        } else {
            const newStudent = {
                id: Date.now(),
                name: newStudentName.trim(),
                phone: newStudentPhone.trim(),
                photo: newStudentPhoto
            };
            updatedStudents = [newStudent, ...students];
        }

        const updatedGroups = groups.map(g => g.id === currentGroup.id ? { ...g, students: updatedStudents } : g);
        setGroups(updatedGroups);
        setSelectedGroupDetails({ ...currentGroup, students: updatedStudents });
        localStorage.setItem('admin_groups', JSON.stringify(updatedGroups));

        try {
            await axios.put(import.meta.env.VITE_FIREBASE_GROUPS_URL, updatedGroups);
            toast.success(editingStudentId ? "O'quvchi yangilandi!" : "O'quvchi qo'shildi!");
        } catch (err) {
            toast.success("O'quvchi saqlandi (lokal)!");
        }

        setShowAddStudentModal(false);
        setEditingStudentId(null);
        setNewStudentName('');
        setNewStudentPhone('');
        setNewStudentPhoto(null);
    };

    const handleDeleteStudent = async (studentId) => {
        const currentGroup = groups.find(g => g.id === selectedGroupDetails.id);
        const updatedStudents = (currentGroup.students || []).filter(st => st.id !== studentId);
        
        const updatedGroups = groups.map(g => g.id === currentGroup.id ? { ...g, students: updatedStudents } : g);
        setGroups(updatedGroups);
        setSelectedGroupDetails({ ...currentGroup, students: updatedStudents });
        localStorage.setItem('admin_groups', JSON.stringify(updatedGroups));

        try {
            await axios.put(import.meta.env.VITE_FIREBASE_GROUPS_URL, updatedGroups);
            toast.success("O'quvchi o'chirildi!");
        } catch (err) {
        }
        setDeleteModalStudent(null);
    };

    const handleEditStudentClick = (student) => {
        setEditingStudentId(student.id);
        setNewStudentName(student.name);
        setNewStudentPhone(student.phone);
        setNewStudentPhoto(student.photo || null);
        setShowAddStudentModal(true);
    };

    const handleCreateGroup = async (e) => {`;
content = content.replace(functionsTarget, newFunctions);

// 4. Update Groups Table to add View button
const groupsTableTarget = `<button onClick={() => setDeleteModalGroup(group)} className="text-rose-500 hover:text-rose-600 transition-colors" title="O'chirish">
                                                                <FaTimesCircle className="text-xl" />
                                                            </button>`;
const newGroupsTable = `<button onClick={() => setSelectedGroupDetails(group)} className="text-blue-500 hover:text-blue-600 transition-colors" title="O'quvchilarni ko'rish">
                                                                <FaRegEye className="text-xl" />
                                                            </button>
                                                            <button onClick={() => setDeleteModalGroup(group)} className="text-rose-500 hover:text-rose-600 transition-colors" title="O'chirish">
                                                                <FaTimesCircle className="text-xl" />
                                                            </button>`;
content = content.replace(groupsTableTarget, newGroupsTable);

// 5. Add Modals for Students
const modalsTarget = `{deleteModalLead && (`;
const newModals = `{selectedGroupDetails && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[50] p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
                    {/* Modal Header */}
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/20">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center text-xl shadow-sm">
                                <FaUsers />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white">{selectedGroupDetails.name}</h3>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">O'quvchilar ro'yxati</p>
                            </div>
                        </div>
                        <button onClick={() => setSelectedGroupDetails(null)} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center justify-center transition-colors">
                            <FaTimesCircle className="text-xl" />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <div className="flex justify-end mb-6">
                            <button onClick={() => {
                                setEditingStudentId(null)
                                setNewStudentName('')
                                setNewStudentPhone('')
                                setNewStudentPhoto(null)
                                setShowAddStudentModal(true)
                            }} className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2">
                                <FaUserPlus /> O'quvchi qo'shish
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(!selectedGroupDetails.students || selectedGroupDetails.students.length === 0) ? (
                                <div className="col-span-full py-12 text-center">
                                    <div className="w-20 h-20 mx-auto bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                                        <FaUserCircle className="text-4xl text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <p className="text-gray-500 font-semibold">Bu guruhda hali o'quvchilar yo'q.</p>
                                </div>
                            ) : (
                                selectedGroupDetails.students.map(student => (
                                    <div key={student.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow group">
                                        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700 border-2 border-gray-50 dark:border-gray-600 flex items-center justify-center">
                                            {student.photo ? (
                                                <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <FaUserCircle className="text-3xl text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 dark:text-white truncate" title={student.name}>{student.name}</h4>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate mt-0.5">{student.phone}</p>
                                        </div>
                                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditStudentClick(student)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 flex items-center justify-center transition-colors">
                                                <FaPen className="text-xs" />
                                            </button>
                                            <button onClick={() => setDeleteModalStudent(student)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 flex items-center justify-center transition-colors">
                                                <FaTrash className="text-xs" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {showAddStudentModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center text-xl font-bold shrink-0">
                            {editingStudentId ? <FaUserEdit /> : <FaUserPlus />}
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">{editingStudentId ? "O'quvchini tahrirlash" : "Yangi o'quvchi qo'shish"}</h3>
                        </div>
                    </div>

                    <form onSubmit={handleCreateOrUpdateStudent} className="space-y-4">
                        <div className="flex justify-center">
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
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">F.I.O</label>
                            <input type="text" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} placeholder="Masalan: Alisherov Ali" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 text-gray-900 dark:text-white transition-colors" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Telefon raqami</label>
                            <input type="text" value={newStudentPhone} onChange={(e) => setNewStudentPhone(e.target.value)} placeholder="+998 90 123 45 67" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 text-gray-900 dark:text-white transition-colors" required />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => setShowAddStudentModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">Bekor qilish</button>
                            <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-md transition-all">Saqlash</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        
        {deleteModalStudent && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-5 relative">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center text-2xl mx-auto">
                        <FaTrash />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white">O'quvchini o'chirmoqchimisiz?</h3>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-2">{deleteModalStudent.name}</p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2">
                        <button onClick={() => setDeleteModalStudent(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">Bekor qilish</button>
                        <button onClick={() => handleDeleteStudent(deleteModalStudent.id)} className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-500/30 transition">O'chirish</button>
                    </div>
                </div>
            </div>
        )}

        {deleteModalLead && (`;
content = content.replace(modalsTarget, newModals);


fs.writeFileSync(targetFile, content);
console.log("Students feature refactoring complete.");
