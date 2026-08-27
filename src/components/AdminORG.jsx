import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import CommentsORG from './TikTokComments'
import toast, { Toaster } from 'react-hot-toast'
import { 
    FaUserCheck, FaPhoneAlt, FaCalendarAlt, FaSearch, FaCommentDots, 
    FaSignOutAlt, FaSync, FaFileCsv, FaFilter, FaChartBar, 
    FaCheckCircle, FaTimesCircle, FaUsers, FaTrash, FaHeadset, 
    FaChevronDown, FaUserShield, FaClipboardList, FaProjectDiagram, 
    FaGlobe, FaShieldAlt, FaExclamationTriangle, FaRegEye, FaEnvelope, FaUserEdit, FaUserPlus, FaCamera, FaPen, FaUserCircle, FaUser, FaUserGraduate, FaRegMoon, FaRegSun, FaTimes
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function AdminORG() {
    const daysList = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'];
    const timesList = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    const { t, i18n } = useTranslation()
    const [dark, isDark] = useState(() => {
        const saved = localStorage.getItem('theme')
        return saved === null ? true : saved === 'true'
    })

    useEffect(() => {
        const saved = localStorage.getItem('theme')
        const shouldBeDark = saved === null ? true : saved === 'true'
        if (shouldBeDark) document.documentElement.classList.add('dark')
        else document.documentElement.classList.remove('dark')
    }, [])

    const Theme = () => {
        window.dispatchEvent(new CustomEvent('trigger-theme-transition'));
        setTimeout(() => {
            const nextState = !dark;
            isDark(nextState);
            localStorage.setItem('theme', nextState);
            if (nextState) document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
        }, 180);
    }

    const [activeTab, setActiveTab] = useState('leads') // 'leads' or 'CommentsORG'
    const [leads, setLeads] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [typeFilter, setTypeFilter] = useState('all')
    const [sortOrder, setSortOrder] = useState('newest')
    const [loadingLeads, setLoadingLeads] = useState(false)
    const [deleteModalLead, setDeleteModalLead] = useState(null)
    const [showAddLeadModal, setShowAddLeadModal] = useState(false)
    const [showAcceptLeadModal, setShowAcceptLeadModal] = useState(false)
    const [leadToAccept, setLeadToAccept] = useState(null)
    const [acceptToGroupId, setAcceptToGroupId] = useState('')
    const [newLeadName, setNewLeadName] = useState('')
    const [newLeadPhone, setNewLeadPhone] = useState('')
    const [newLeadType, setNewLeadType] = useState("Ro'yxatdan o'tish")
    const [newLeadStatus, setNewLeadStatus] = useState("Qabul qilindi")
    const [newLeadGroup, setNewLeadGroup] = useState('')
    const [schedules, setSchedules] = useState([])
    const [loadingSchedules, setLoadingSchedules] = useState(false)
    const [showAddScheduleModal, setShowAddScheduleModal] = useState(false)
    const [deleteModalSchedule, setDeleteModalSchedule] = useState(null)
    const [newScheduleGroup, setNewScheduleGroup] = useState('')
    const [newScheduleDays, setNewScheduleDays] = useState([])
    const [newScheduleTime, setNewScheduleTime] = useState('')
    const [editingScheduleId, setEditingScheduleId] = useState(null)

    const LanguageDropdown = ({ isMobile }) => {
        const [isOpen, setIsOpen] = useState(false);
        const dropdownRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        const langs = {
            uz: "O'zbekcha",
            ru: "Русский",
            en: "English"
        };
        const currentLang = i18n.language || 'en';

        return (
            <div className={`relative ${isMobile ? 'w-full' : 'w-36 hidden sm:block shrink-0'}`} ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center justify-between w-full px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-900 dark:text-white transition-all hover:border-red-500/50 shadow-sm ${isMobile ? 'py-3' : 'py-2.5 h-10'}`}
                >
                    <span>{langs[currentLang] || langs['uz']}</span>
                    <FaChevronDown className={`text-[10px] opacity-70 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <div 
                    className={`absolute ${isMobile ? 'bottom-full mb-2 origin-bottom' : 'top-full mt-2 right-0 origin-top'} w-full bg-white dark:bg-[#0a0f1c] border border-gray-100 dark:border-gray-800 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 flex flex-col p-1 gap-0.5 transition-all duration-200 ease-out ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible' : 'opacity-0 scale-95 pointer-events-none invisible'} ${isOpen ? '' : isMobile ? 'translate-y-2' : '-translate-y-2'}`}
                >
                    {Object.entries(langs).map(([code, label]) => (
                        <button
                            key={code}
                            onClick={() => {
                                i18n.changeLanguage(code);
                                setIsOpen(false);
                                if (isMobile) setIsMobileMenuOpen(false);
                            }}
                            className={`px-3 py-2.5 rounded-lg text-sm font-bold text-left transition-all ${currentLang === code ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md shadow-red-600/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    const [groups, setGroups] = useState([])
    const [loadingGroups, setLoadingGroups] = useState(false)
    const [showAddGroupModal, setShowAddGroupModal] = useState(false)
    const [deleteModalGroup, setDeleteModalGroup] = useState(null)
    const [newGroupNameInput, setNewGroupNameInput] = useState('')
    const [selectedGroupDetails, setSelectedGroupDetails] = useState(null)
    const [showAddStudentModal, setShowAddStudentModal] = useState(false)
    const [editingStudentId, setEditingStudentId] = useState(null)
    const [newStudentName, setNewStudentName] = useState('')
    const [newStudentPhone, setNewStudentPhone] = useState('')
    const [newStudentGender, setNewStudentGender] = useState('erkak')
    const [deleteModalStudent, setDeleteModalStudent] = useState(null)
    const [editingGroupId, setEditingGroupId] = useState(null)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleCreateLead = async (e) => {
        e.preventDefault()

        if (!newLeadName.trim()) {
            toast.error(t('adminPanel.fillNameError', "Iltimos, F.I.O ni kiriting!"))
            return
        }
        
        if (newLeadStatus === "Qabul qilindi" && !newLeadGroup) {
            toast.error("Iltimos, guruhni tanlang!");
            return;
        }

        const cleanDigits = newLeadPhone.replace(/\D/g, '')
        if (cleanDigits.length !== 9) {
            toast.error(t('adminPanel.phoneError9Digits', "Telefon raqami ro'ppa-rosa 9 ta raqamdan iborat bo'lishi kerak! (Masalan: 901234567)"))
            return
        }

        const formattedPhone = `+998 ${cleanDigits}`

        const now = new Date()
        const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
        
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
    loadSchedules()
    loadGroups()
    const interval = setInterval(() => {
        loadLeads()
        loadSchedules()
        loadGroups()
    }, 3000)
    return () => clearInterval(interval)
}, [])

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

    const loadGroups = async () => {
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

    

    const handleCreateOrUpdateStudent = async (e) => {
        e.preventDefault();
        if (!newStudentName.trim() || !newStudentPhone.trim()) {
            toast.error(t('adminDashboard.toast.fillNameAndPhone'));
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
                gender: newStudentGender
            } : st);
        } else {
            const newStudent = {
                id: Date.now(),
                name: newStudentName.trim(),
                phone: newStudentPhone.trim(),
                gender: newStudentGender
            };
            updatedStudents = [newStudent, ...students];
        }

        const updatedGroups = groups.map(g => g.id === currentGroup.id ? { ...g, students: updatedStudents } : g);
        setGroups(updatedGroups);
        setSelectedGroupDetails({ ...currentGroup, students: updatedStudents });
        localStorage.setItem('admin_groups', JSON.stringify(updatedGroups));

        try {
            await axios.put(import.meta.env.VITE_FIREBASE_GROUPS_URL, updatedGroups);
            toast.success(editingStudentId ? t('adminDashboard.toast.studentUpdated') : t('adminDashboard.toast.studentAdded'));
        } catch (err) {
            toast.success("O'quvchi saqlandi (lokal)!");
        }

        setShowAddStudentModal(false);
        setEditingStudentId(null);
        setNewStudentName('');
        setNewStudentPhone('');
        setNewStudentGender('erkak');
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
            toast.success(t('adminDashboard.toast.studentDeleted'));
        } catch (err) {
        }
        setDeleteModalStudent(null);
    };

    const handleEditStudentClick = (student) => {
        setEditingStudentId(student.id);
        setNewStudentName(student.name);
        setNewStudentPhone(student.phone);
        setNewStudentGender(student.gender || 'erkak');
        setShowAddStudentModal(true);
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault()
        const newName = newGroupNameInput.trim()
        if (!newName) {
            toast.error(t('adminDashboard.toast.enterGroupName'))
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
            toast.success(editingGroupId ? t('adminDashboard.toast.groupUpdated') : t('adminDashboard.toast.groupAdded'))
        } catch (e) {
            toast.success("Guruh saqlandi (lokal)!")
        }

        setNewGroupNameInput('')
        setEditingGroupId(null)
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
        toast.success(t('adminDashboard.toast.groupDeleted'))
        setDeleteModalGroup(null)
    }

    const handleCreateOrUpdateSchedule = async (e) => {
    e.preventDefault()
    if (!newScheduleGroup.trim() || newScheduleDays.length === 0 || !newScheduleTime.trim()) {
        toast.error(t('adminDashboard.toast.fillAllFields'))
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
        toast.error(t('adminDashboard.toast.timeConflict'));
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
    setNewScheduleDays([])
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
    toast.success(t('adminDashboard.toast.scheduleDeleted'))
    setDeleteModalSchedule(null)
}

const handleEditScheduleClick = (schedule) => {
    setEditingScheduleId(schedule.id)
    setNewScheduleGroup(schedule.group)
    setNewScheduleDays(schedule.days)
    setNewScheduleTime(schedule.time)
    setShowAddScheduleModal(true)
}

const handleAcceptLeadToGroup = () => {
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
    };
    
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

const getTranslatedType = (type) => {
    if (!type) return t('adminPanel.typeMurojaat', "Murojaat");
    if (type === "Ro'yxatdan o'tish") return t('adminPanel.typeRegistration', "Ro'yxatdan o'tish");
    if (type === "Bepul maslahat") return t('adminPanel.typeFreeConsultation', "Bepul maslahat");
    if (type === "Ingliz tili") return t('adminPanel.typeEnglish', "Ingliz tili");
    if (type === "Rus tili") return t('adminPanel.typeRussian', "Rus tili");
    if (type === "Arab tili") return t('adminPanel.typeArabic', "Arab tili");
    if (type === "Mental Arifmetika") return t('adminPanel.typeMentalMath', "Mental Arifmetika");
    if (type === "Ona tili va Adabiyot") return t('adminPanel.typeNativeLang', "Ona tili va Adabiyot");
    if (type === "Matematika") return t('adminPanel.typeMath', "Matematika");
    return type;
};

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
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-[#070b14] font-['Plus_Jakarta_Sans',sans-serif] text-gray-900 dark:text-gray-100 relative">
        <Toaster position="top-center" />
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
            />
        )}

        {/* Sidebar Wrapper */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transform transition-transform duration-300 lg:relative lg:translate-x-0 shrink-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {/* Sticky Inner Container */}
            <div className="sticky top-0 flex flex-col h-screen">
                <div className="px-4 py-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white flex items-center justify-center text-base shadow-lg shadow-red-600/30">
                            <FaUserShield />
                        </div>
                        <span className="font-black text-lg tracking-tight text-gray-900 dark:text-white truncate">OPTIMUM</span>
                    </div>
                    <div className="flex items-center gap-1.5 lg:hidden shrink-0">
                        <button onClick={Theme} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            {dark ? <FaRegSun className="text-sm" /> : <FaRegMoon className="text-sm" />}
                        </button>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <FaTimes className="text-sm" />
                        </button>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
                    <SidebarItem icon={<FaChartBar />} label={t('adminPanel.murojaatlarTab', "Murojaatlar")} isActive={activeTab === 'leads'} onClick={() => { setActiveTab('leads'); setIsMobileMenuOpen(false); }} />
                    <SidebarItem icon={<FaCommentDots />} label={t('adminPanel.CommentsORGTab', "O'quvchilar Izohlari")} isActive={activeTab === 'CommentsORG'} onClick={() => { setActiveTab('CommentsORG'); setIsMobileMenuOpen(false); }} />
                    <SidebarItem icon={<FaCalendarAlt />} label={t('adminDashboard.schedulesTab')} isActive={activeTab === 'schedules'} onClick={() => { setActiveTab('schedules'); setIsMobileMenuOpen(false); }} />
                    <SidebarItem icon={<FaUsers />} label={t('adminDashboard.groupsTab')} isActive={activeTab === 'groups'} onClick={() => { setActiveTab('groups'); setIsMobileMenuOpen(false); }} />
                    <SidebarItem icon={<FaUserGraduate />} label={t('adminDashboard.studentsTab')} isActive={activeTab === 'students'} onClick={() => { setActiveTab('students'); setIsMobileMenuOpen(false); }} />
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-2">
                        <div className="lg:hidden">
                            <LanguageDropdown isMobile={true} />
                        </div>

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
            {/* Mobile Navbar */}
            <div className="lg:hidden flex items-center justify-between px-5 py-4 bg-white dark:bg-[#0a0f1c] border-b border-gray-200 dark:border-white/5 sticky top-0 z-30 transition-colors duration-300">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#ef4444] text-white flex items-center justify-center text-xl shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                        <FaUserShield />
                    </div>
                    <span className="font-black text-xl tracking-tight text-gray-900 dark:text-white uppercase transition-colors duration-300">OPTIMUM</span>
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="w-11 h-11 rounded-[14px] bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors duration-300"
                >
                    <div className="flex flex-col gap-[5px]">
                        <span className="w-5 h-[2px] bg-gray-700 dark:bg-white rounded-full transition-colors duration-300"></span>
                        <span className="w-5 h-[2px] bg-gray-700 dark:bg-white rounded-full transition-colors duration-300"></span>
                        <span className="w-5 h-[2px] bg-gray-700 dark:bg-white rounded-full transition-colors duration-300"></span>
                    </div>
                </button>
            </div>

            {/* Header */}
            <header className="px-4 lg:px-8 py-4 flex items-center justify-between gap-4 bg-white/80 dark:bg-[#070b14]/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800 shrink-0 sticky top-[76px] lg:top-0 z-20 shadow-sm transition-all">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-black uppercase text-gray-900 dark:text-white tracking-wide truncate max-w-[150px] sm:max-w-none">
                        {activeTab === 'leads' ? t('adminPanel.murojaatlarTab', 'Murojaatlar').toUpperCase() : activeTab === 'schedules' ? t('adminDashboard.schedulesTab', 'DARS JADVALI').toUpperCase() : activeTab === 'groups' ? t('adminDashboard.groupsTab', 'GURUHLAR').toUpperCase() : t('adminPanel.CommentsORGTab', "O'quvchilar Izohlari").toUpperCase()}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <LanguageDropdown isMobile={false} />

                    <button onClick={Theme} className="hidden lg:flex w-10 h-10 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border border-gray-200 dark:border-gray-700 shrink-0">
                        {dark ? <FaRegSun className="text-lg" /> : <FaRegMoon className="text-lg" />}
                    </button>

                    <button onClick={() => { loadLeads(); loadSchedules(); loadGroups(); }} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-gray-700 shrink-0">
                        <FaSync className={loadingLeads || loadingSchedules || loadingGroups ? "animate-spin" : ""} />
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
                                                    {t('adminPanel.noLeadsFound', "Murojaatlar topilmadi")}
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredLeads.map(lead => (
                                                <tr key={lead.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition text-sm">
                                                    <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">{lead.name}</td>
                                                    <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{getTranslatedType(lead.type)}</td>
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
                                                                <button onClick={() => { setLeadToAccept(lead); setShowAcceptLeadModal(true); }} className="text-emerald-500 hover:text-emerald-600 transition-colors" title="Tasdiqlash">
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
                {activeTab === 'schedules' && (
                    <div className="space-y-8 max-w-[1400px] mx-auto">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col relative">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('adminDashboard.schedulesTab', 'Dars jadvallari')}</h2>
                                <button onClick={() => {
                                    setEditingScheduleId(null)
                                    setNewScheduleGroup('')
                                    setNewScheduleDays('')
                                    setNewScheduleTime('')
                                    setShowAddScheduleModal(true)
                                }} className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-red-600/20 whitespace-nowrap">
                                    {t('adminDashboard.addGroupBtn', "+ Guruh qo'shish")}
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto custom-scrollbar pb-4 relative">
                                <table className="w-full text-left border-collapse border border-gray-100 dark:border-gray-800 min-w-[1400px]">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400 text-center">
                                            <th className="py-4 px-3 border-r border-gray-100 dark:border-gray-800 sticky left-0 z-20 bg-gray-50 dark:bg-gray-800 shadow-[2px_0_5px_rgba(0,0,0,0.05)] w-32">{t('adminDashboard.daysAndTime')}</th>
                                            {timesList.map(time => (
                                                <th key={time} className="py-4 px-2 border-r border-gray-100 dark:border-gray-800 min-w-[120px]">{time}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {daysList.map(day => (
                                            <tr key={day} className="border-b border-gray-100 dark:border-gray-800 transition text-sm">
                                                <td className="py-4 px-4 font-bold text-gray-900 dark:text-white border-r border-gray-100 dark:border-gray-800 sticky left-0 z-10 bg-white dark:bg-gray-900 shadow-[2px_0_5px_rgba(0,0,0,0.05)] text-center">
                                                    {t(`adminPanel.days.${day.toLowerCase()}`, day)}
                                                </td>
                                                {timesList.map(time => {
                                                    const schedule = schedules.find(s => {
                                                        const sDays = Array.isArray(s.days) ? s.days : [s.days];
                                                        return sDays.includes(day) && s.time === time;
                                                    });
                                                    
                                                    return (
                                                        <td key={time} className="p-2 border-r border-gray-100 dark:border-gray-800 relative group min-w-[130px] align-middle hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                                            {schedule ? (
                                                                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-3 border border-indigo-100 dark:border-indigo-800/50 flex flex-col h-full items-center justify-center relative shadow-sm">
                                                                    <span className="font-bold text-indigo-700 dark:text-indigo-400 text-center leading-snug">{schedule.group}</span>
                                                                    
                                                                    {/* Hover Actions */}
                                                                    <div className="absolute inset-0 bg-indigo-900/90 rounded-xl flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                        <button onClick={() => handleEditScheduleClick(schedule)} className="text-white hover:scale-110 transition-transform" title={t('adminDashboard.editTitle')}>
                                                                            <FaRegEye className="text-xl" />
                                                                        </button>
                                                                        <button onClick={() => setDeleteModalSchedule(schedule)} className="text-rose-400 hover:scale-110 transition-transform" title={t('adminDashboard.deleteTitle')}>
                                                                            <FaTrash className="text-lg" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div 
                                                                    className="w-full h-[60px] rounded-xl border-2 border-dashed border-transparent hover:border-gray-200 dark:hover:border-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                                                    onClick={() => {
                                                                        setEditingScheduleId(null)
                                                                        setNewScheduleGroup('')
                                                                        setNewScheduleDays([day])
                                                                        setNewScheduleTime(time)
                                                                        setShowAddScheduleModal(true)
                                                                    }}
                                                                >
                                                                    <span className="text-xs font-bold text-gray-400">{t('adminDashboard.addBtn')}</span>
                                                                </div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>


                    </div>
                )}
                
                {activeTab === 'groups' && (
                    <div className="space-y-8 max-w-[1400px] mx-auto">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col relative">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('adminDashboard.groupsTab')}</h2>
                                <button onClick={() => {
                                    setNewGroupNameInput('')
                                    setShowAddGroupModal(true)
                                }} className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-red-600/20 whitespace-nowrap">
                                    {t('adminDashboard.addGroupBtn', "+ Guruh qo'shish")}
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto custom-scrollbar pb-2">
                                <table className="w-full text-left border-collapse min-w-[500px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800 text-xs lg:text-sm font-bold text-gray-500 dark:text-gray-400">
                                            <th className="py-4 px-4 font-medium">{t('adminDashboard.groupName', 'Guruh Nomi')}</th>
                                            <th className="py-4 px-4 font-medium text-right">{t('adminDashboard.actions', 'Amallar')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groups.length === 0 ? (
                                            <tr>
                                                <td colSpan="2" className="py-8 text-center text-gray-500">
                                                    {t('adminDashboard.noGroups', 'Guruhlar topilmadi')}
                                                </td>
                                            </tr>
                                        ) : (
                                            groups.map(group => (
                                                <tr key={group.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition text-sm">
                                                    <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">{group.name}</td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button onClick={() => {
                                                                setEditingGroupId(group.id)
                                                                setNewGroupNameInput(group.name)
                                                                setShowAddGroupModal(true)
                                                            }} className="text-indigo-500 hover:text-indigo-600 transition-colors" title={t('adminDashboard.editTitle')}>
                                                                <FaPen className="text-lg" />
                                                            </button>
                                                            <button onClick={() => setSelectedGroupDetails(group)} className="text-blue-500 hover:text-blue-600 transition-colors" title={t('adminDashboard.viewStudents')}>
                                                                <FaRegEye className="text-xl" />
                                                            </button>
                                                            <button onClick={() => setDeleteModalGroup(group)} className="text-rose-500 hover:text-rose-600 transition-colors" title={t('adminDashboard.deleteTitle')}>
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
                
                {activeTab === 'students' && (
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                {t('adminDashboard.studentsTab')}
                            </h2>
                        </div>

                        {groups.flatMap(g => (g.students || []).map(s => ({...s, groupName: g.name, groupId: g.id}))).length === 0 ? (
                            <div className="text-center py-16">
                                <FaUserGraduate className="text-6xl text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('adminDashboard.noStudentsTitle', "Hali o'quvchilar yo'q")}</h3>
                                <p className="text-gray-500">{t('adminDashboard.noStudentsDesc', "Guruhlarga kirib o'quvchi qo'shishingiz mumkin.")}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {groups.flatMap(g => (g.students || []).map(s => ({...s, groupName: g.name, groupId: g.id}))).map(student => (
                                    <div key={student.id} className="bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex flex-col gap-4 hover:shadow-md hover:bg-white dark:hover:bg-gray-800 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-14 h-14 rounded-full shrink-0 border-2 border-gray-100 dark:border-gray-600 flex items-center justify-center text-3xl shadow-sm ${student.gender === 'ayol' ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-500' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'}`}>
                                                <FaUser />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 dark:text-white truncate" title={student.name}>{student.name}</h4>
                                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 truncate">{student.phone}</p>
                                            </div>
                                        </div>
                                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                            <span className="inline-block px-3 py-1.5 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 truncate max-w-[150px]">
                                                {student.groupName}
                                            </span>
                                            
                                            <button onClick={() => {
                                                const group = groups.find(g => g.id === student.groupId);
                                                setSelectedGroupDetails(group);
                                                setActiveTab('groups');
                                                // We can also trigger editing the student, but viewing the group is good enough
                                            }} className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-blue-900/40 flex items-center justify-center transition-colors">
                                                <FaRegEye className="text-xs" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
                        <button onClick={() => setDeleteModalSchedule(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">{t('adminDashboard.cancel')}</button>
                        <button onClick={() => handleDeleteSchedule(deleteModalSchedule.id)} className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-500/30 transition">{t('adminDashboard.deleteConfirmBtn')}</button>
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
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('adminDashboard.groupName')}</label>
                            <select value={newScheduleGroup} onChange={(e) => setNewScheduleGroup(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-red-500 text-gray-900 dark:text-white" required>
                                <option value="">Guruhni tanlang</option>
                                {groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                            </select>
                        </div>
                        <div>
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
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowAddScheduleModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">{t('adminDashboard.cancel')}</button>
                            <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-sm shadow-md shadow-red-600/20 hover:from-red-500 hover:to-rose-500 transition">{t('adminDashboard.save')}</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {deleteModalGroup && (
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
                        <button onClick={() => setDeleteModalGroup(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">{t('adminDashboard.cancel')}</button>
                        <button onClick={() => handleDeleteGroup(deleteModalGroup.id)} className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-500/30 transition">{t('adminDashboard.deleteConfirmBtn')}</button>
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
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">{editingGroupId ? t('adminDashboard.editGroup') : t('adminDashboard.addNewGroup')}</h3>
                        </div>
                    </div>

                    <form onSubmit={handleCreateGroup} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Guruh nomi (Masalan: IELTS Beginner)</label>
                            <input type="text" value={newGroupNameInput} onChange={(e) => setNewGroupNameInput(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-red-500 text-gray-900 dark:text-white" required />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowAddGroupModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">{t('adminDashboard.cancel')}</button>
                            <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-sm shadow-md shadow-red-600/20 hover:from-red-500 hover:to-rose-500 transition">{t('adminDashboard.save')}</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {selectedGroupDetails && (
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
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t('adminDashboard.studentsList')}</p>
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
                                <FaUserPlus /> {t('adminDashboard.addStudentBtn')}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(!selectedGroupDetails.students || selectedGroupDetails.students.length === 0) ? (
                                <div className="col-span-full py-12 text-center">
                                    <div className="w-20 h-20 mx-auto bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                                        <FaUserCircle className="text-4xl text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <p className="text-gray-500 font-semibold">{t('adminDashboard.noStudents')}</p>
                                </div>
                            ) : (
                                selectedGroupDetails.students.map(student => (
                                    <div key={student.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow group">
                                        <div className={`w-16 h-16 rounded-full shrink-0 border-2 border-gray-100 dark:border-gray-600 flex items-center justify-center text-3xl shadow-sm ${student.gender === 'ayol' ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-500' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'}`}>
                                            <FaUser />
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
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">{editingStudentId ? t('adminDashboard.editStudent') : t('adminDashboard.addNewStudent')}</h3>
                        </div>
                    </div>

                    <form onSubmit={handleCreateOrUpdateStudent} className="space-y-4">
                        <div className="flex justify-center gap-6">
                            <label className={`cursor-pointer group flex flex-col items-center gap-2 ${newStudentGender === 'erkak' ? 'scale-110' : 'opacity-50 hover:opacity-100'} transition-all`}>
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl bg-blue-50 dark:bg-blue-900/20 border-2 ${newStudentGender === 'erkak' ? 'border-blue-500 shadow-md text-blue-500' : 'border-transparent text-gray-400'}`}>
                                    <FaUser />
                                </div>
                                <span className="text-xs font-bold text-gray-500">{t('adminDashboard.boy')}</span>
                                <input type="radio" name="gender" value="erkak" checked={newStudentGender === 'erkak'} onChange={(e) => setNewStudentGender(e.target.value)} className="hidden" />
                            </label>
                            
                            <label className={`cursor-pointer group flex flex-col items-center gap-2 ${newStudentGender === 'ayol' ? 'scale-110' : 'opacity-50 hover:opacity-100'} transition-all`}>
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl bg-pink-50 dark:bg-pink-900/20 border-2 ${newStudentGender === 'ayol' ? 'border-pink-500 shadow-md text-pink-500' : 'border-transparent text-gray-400'}`}>
                                    <FaUser />
                                </div>
                                <span className="text-xs font-bold text-gray-500">{t('adminDashboard.girl')}</span>
                                <input type="radio" name="gender" value="ayol" checked={newStudentGender === 'ayol'} onChange={(e) => setNewStudentGender(e.target.value)} className="hidden" />
                            </label>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('adminDashboard.fio')}</label>
                            <input type="text" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} placeholder={t('adminDashboard.fioPlaceholder')} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 text-gray-900 dark:text-white transition-colors" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('adminDashboard.phone')}</label>
                            <div className="flex w-full bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl focus-within:border-indigo-500 transition-colors overflow-hidden">
                                <div className="px-4 py-3 bg-gray-100/50 dark:bg-gray-800/50 border-r border-gray-100 dark:border-gray-800 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300 text-sm">
                                    +998
                                </div>
                                <input type="text" value={newStudentPhone} onChange={(e) => {
                                    // Barcha raqam bo'lmagan belgilarni olib tashlaymiz
                                    let val = e.target.value.replace(/\D/g, '');
                                    
                                    // 9 tadan ortiq raqam kiritilishiga yo'l qo'ymaymiz
                                    if(val.length > 9) val = val.substring(0, 9);
                                    
                                    // Formatlash: (XX) XXX-XX-XX
                                    let formatted = '';
                                    if(val.length > 0) {
                                        formatted += '(' + val.substring(0, 2);
                                    }
                                    if(val.length >= 3) {
                                        formatted += ') ' + val.substring(2, 5);
                                    }
                                    if(val.length >= 6) {
                                        formatted += '-' + val.substring(5, 7);
                                    }
                                    if(val.length >= 8) {
                                        formatted += '-' + val.substring(7, 9);
                                    }
                                    
                                    setNewStudentPhone(formatted);
                                }} placeholder="(90) 123-45-67" className="flex-1 px-4 py-3 bg-transparent text-sm font-medium focus:outline-none text-gray-900 dark:text-white" required />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => setShowAddStudentModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">{t('adminDashboard.cancel')}</button>
                            <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-md transition-all">{t('adminDashboard.save')}</button>
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
                        <h3 className="text-lg font-black text-gray-900 dark:text-white">{t('adminDashboard.deleteStudentConfirm')}</h3>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-2">{deleteModalStudent.name}</p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2">
                        <button onClick={() => setDeleteModalStudent(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">{t('adminDashboard.cancel')}</button>
                        <button onClick={() => handleDeleteStudent(deleteModalStudent.id)} className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-500/30 transition">{t('adminDashboard.deleteConfirmBtn')}</button>
                    </div>
                </div>
            </div>
        )}

        {showAcceptLeadModal && (
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

        {deleteModalLead && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-5 relative">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center text-2xl mx-auto">
                        <FaTrash />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white">{t('adminPanel.deleteConfirmTitle', "Ushbu murojaatni o'chirmoqchimisiz?")}</h3>
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
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Guruhni tanlang (Majburiy emas)</label>
                            <select value={newLeadGroup} onChange={(e) => setNewLeadGroup(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-red-500 text-gray-900 dark:text-white transition-colors">
                                <option value="">Tanlang...</option>
                                {groups.map(g => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </select>
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