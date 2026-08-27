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
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { HexColorPicker } from 'react-colorful'

moment.updateLocale('en', {
    week: {
        dow: 1, // Monday is the first day of the week.
    },
})
const localizer = momentLocalizer(moment)

const GROUP_COLORS = [
    'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', // Red
    'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', // Blue
    'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Emerald
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Amber
    'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', // Violet
    'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', // Pink
];

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
    const [showAcceptGroupDropdown, setShowAcceptGroupDropdown] = useState(false)
    const [newLeadName, setNewLeadName] = useState('')
    const [newLeadPhone, setNewLeadPhone] = useState('')
    const [newLeadPhoneCode, setNewLeadPhoneCode] = useState('')
    const [newLeadType, setNewLeadType] = useState("Ro'yxatdan o'tish")
    const [newLeadStatus, setNewLeadStatus] = useState("Qabul qilindi")
    const [newLeadGroup, setNewLeadGroup] = useState('')
    const [showLeadGroupDropdown, setShowLeadGroupDropdown] = useState(false)
    const [schedules, setSchedules] = useState([])
    const [loadingSchedules, setLoadingSchedules] = useState(false)
    const [showAddScheduleModal, setShowAddScheduleModal] = useState(false)
    const [deleteModalSchedule, setDeleteModalSchedule] = useState(null)
    const [newScheduleGroup, setNewScheduleGroup] = useState('')
    const [showScheduleGroupDropdown, setShowScheduleGroupDropdown] = useState(false)
    const [newScheduleStart, setNewScheduleStart] = useState('')
    const [newScheduleEnd, setNewScheduleEnd] = useState('')
    const [editingScheduleId, setEditingScheduleId] = useState(null)
    const [selectedDateForModal, setSelectedDateForModal] = useState(null)
    const [currentView, setCurrentView] = useState('month')
    const [currentDate, setCurrentDate] = useState(new Date())

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
    const [editingGroupId, setEditingGroupId] = useState(null)
    const [newGroupColor, setNewGroupColor] = useState(GROUP_COLORS[0])
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [deleteModalGroup, setDeleteModalGroup] = useState(null)
    const [newGroupNameInput, setNewGroupNameInput] = useState('')
    const [selectedGroupDetails, setSelectedGroupDetails] = useState(null)
    const [showAddStudentModal, setShowAddStudentModal] = useState(false)
    const [editingStudentId, setEditingStudentId] = useState(null)
    const [newStudentName, setNewStudentName] = useState('')
    const [newStudentPhone, setNewStudentPhone] = useState('')
    const [newStudentGender, setNewStudentGender] = useState('erkak')
    const [newStudentGroupId, setNewStudentGroupId] = useState('')
    const [showStudentGroupDropdown, setShowStudentGroupDropdown] = useState(false)
    const [deleteModalStudent, setDeleteModalStudent] = useState(null)
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
        setNewLeadPhoneCode('')
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
        const safeParse = (arr) => arr.map(s => {
            const startDate = new Date(s.start);
            const endDate = new Date(s.end);
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;
            return {
                ...s,
                start: startDate,
                end: endDate,
                title: s.title || s.group
            }
        }).filter(Boolean);

        if (res.status === 200 && res.data !== null) {
            const dataArray = Array.isArray(res.data) ? res.data : Object.values(res.data)
            const parsedArray = safeParse(dataArray)
            setSchedules(parsedArray)
            localStorage.setItem('admin_schedules', JSON.stringify(dataArray))
        } else if (res.data === null) {
            setSchedules([])
            localStorage.setItem('admin_schedules', '[]')
        } else {
            const stored = JSON.parse(localStorage.getItem('admin_schedules') || '[]')
            setSchedules(safeParse(stored))
        }
    } catch (e) {
        const stored = JSON.parse(localStorage.getItem('admin_schedules') || '[]')
        setSchedules(safeParse(stored))
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

        const targetGroupId = selectedGroupDetails ? selectedGroupDetails.id : (newStudentGroupId ? Number(newStudentGroupId) : null);
        
        if (!targetGroupId) {
            toast.error(t('adminDashboard.selectGroup', 'Guruhni tanlang'));
            return;
        }

        const currentGroup = groups.find(g => g.id === targetGroupId);
        if (!currentGroup) return;
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
        if (selectedGroupDetails) {
            setSelectedGroupDetails({ ...currentGroup, students: updatedStudents });
        }
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
        setNewStudentGroupId('');
        setShowStudentGroupDropdown(false);
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
            updatedList = groups.map(g => g.id === editingGroupId ? { ...g, name: newName, color: newGroupColor } : g);
            
            // Update schedules with new group name
            updatedSchedulesList = schedules.map(s => s.group === oldName ? { ...s, group: newName } : s);
            setSchedules(updatedSchedulesList);
            localStorage.setItem('admin_schedules', JSON.stringify(updatedSchedulesList));
            axios.put(import.meta.env.VITE_FIREBASE_SCHEDULES_URL, updatedSchedulesList).catch(()=>{});
        } else {
            const newGroup = {
                id: Date.now(),
                name: newName,
                color: newGroupColor
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
        setNewGroupColor(GROUP_COLORS[0])
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
    if (!newScheduleGroup.trim() || !newScheduleStart || !newScheduleEnd) {
        toast.error(t('adminDashboard.toast.fillAllFields'))
        return
    }

    const start = new Date(newScheduleStart);
    const end = new Date(newScheduleEnd);

    if (start >= end) {
        toast.error("Tugash vaqti boshlanish vaqtidan keyin bo'lishi kerak!");
        return;
    }

    let updatedList;
    if (editingScheduleId) {
        updatedList = schedules.map(s => s.id === editingScheduleId ? {
            ...s,
            group: newScheduleGroup.trim(),
            title: newScheduleGroup.trim(),
            start: start,
            end: end
        } : s)
    } else {
        const newSchedule = {
            id: Date.now(),
            group: newScheduleGroup.trim(),
            title: newScheduleGroup.trim(),
            start: start,
            end: end
        }
        updatedList = [...schedules, newSchedule]
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
    setNewScheduleStart('')
    setNewScheduleEnd('')
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
    setNewScheduleGroup(schedule.group || schedule.title || '')
    setNewScheduleStart(moment(schedule.start).format('YYYY-MM-DDTHH:mm'))
    setNewScheduleEnd(moment(schedule.end).format('YYYY-MM-DDTHH:mm'))
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

    if (newStatus === 'Rad etildi') {
        // Find the lead to get their phone/name
        const rejectedLead = leads.find(l => l.id === id)
        if (rejectedLead) {
            // Remove this student from all groups
            const updatedGroups = groups.map(g => ({
                ...g,
                students: (g.students || []).filter(s =>
                    s.phone !== rejectedLead.phone && s.name !== rejectedLead.name
                )
            }))
            setGroups(updatedGroups)
            localStorage.setItem('admin_groups', JSON.stringify(updatedGroups))
            axios.put(import.meta.env.VITE_FIREBASE_GROUPS_URL, updatedGroups).catch(() => {})
        }
        toast.error("So'rov rad etildi va o'quvchi guruhdan chiqarildi!")
    } else if (newStatus === 'Qabul qilindi') {
        toast.success("So'rov qabul qilindi!")
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
                            <div onClick={() => setStatusFilter('Kutilmoqda')} className={`cursor-pointer transition-all ${statusFilter === 'Kutilmoqda' ? 'ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-gray-950 rounded-2xl' : 'hover:scale-[1.02]'}`}>
                                <StatCard value={pendingCount} label={t('adminPanel.pending', "Kutilmoqda")} />
                            </div>
                            <div onClick={() => setStatusFilter('all')} className={`cursor-pointer transition-all ${statusFilter === 'all' ? 'ring-2 ring-red-500 ring-offset-2 dark:ring-offset-gray-950 rounded-2xl' : 'hover:scale-[1.02]'}`}>
                                <StatCard value={totalCount} label={t('adminPanel.totalLeads', "Jami Murojaatlar")} />
                            </div>
                            <div onClick={() => setStatusFilter('Qabul qilindi')} className={`cursor-pointer transition-all ${statusFilter === 'Qabul qilindi' ? 'ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-gray-950 rounded-2xl' : 'hover:scale-[1.02]'}`}>
                                <StatCard value={acceptedCount} label={t('adminPanel.accepted', "Qabul Qilindi")} />
                            </div>
                            <div onClick={() => setStatusFilter('Rad etildi')} className={`cursor-pointer transition-all ${statusFilter === 'Rad etildi' ? 'ring-2 ring-rose-400 ring-offset-2 dark:ring-offset-gray-950 rounded-2xl' : 'hover:scale-[1.02]'}`}>
                                <StatCard value={rejectedCount} label={t('adminPanel.rejected', "Rad Etildi")} />
                            </div>
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
                                    setNewScheduleStart('')
                                    setNewScheduleEnd('')
                                    setShowAddScheduleModal(true)
                                }} className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-red-600/20 whitespace-nowrap">
                                    {t('adminDashboard.addGroupBtn', "+ Guruh qo'shish")}
                                </button>
                            </div>
                            
                            <div className="h-[700px] w-full mt-4 bg-white dark:bg-gray-900 rounded-xl overflow-hidden calendar-container">
                                <style>{`
                                    .calendar-container .rbc-calendar { font-family: 'Plus Jakarta Sans', sans-serif; border: none; }
                                    .calendar-container .rbc-header { padding: 10px 0; font-weight: 800; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; border-bottom: 1px solid #f3f4f6; color: #6b7280; }
                                    .dark .calendar-container .rbc-header { border-bottom: 1px solid #1f2937; color: #9ca3af; }
                                    
                                    .calendar-container .rbc-month-view, .calendar-container .rbc-time-view, .calendar-container .rbc-agenda-view { border: 1px solid #f3f4f6; border-radius: 12px; overflow: hidden; background: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
                                    .dark .calendar-container .rbc-month-view, .dark .calendar-container .rbc-time-view, .dark .calendar-container .rbc-agenda-view { border-color: #1f2937; background: #111827; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2); }
                                    
                                    .calendar-container .rbc-day-bg, .calendar-container .rbc-month-row, .calendar-container .rbc-time-header-content { border-color: #f3f4f6; transition: background-color 0.2s ease; cursor: pointer; }
                                    .dark .calendar-container .rbc-day-bg, .dark .calendar-container .rbc-month-row, .dark .calendar-container .rbc-time-header-content { border-color: #1f2937; }
                                    
                                    .calendar-container .rbc-day-bg:hover { background-color: rgba(239, 68, 68, 0.03); }
                                    .dark .calendar-container .rbc-day-bg:hover { background-color: rgba(239, 68, 68, 0.05); }
                                    
                                    .calendar-container .rbc-off-range-bg { background-color: transparent; }
                                    .dark .calendar-container .rbc-off-range-bg { background-color: transparent; }
                                    
                                    .calendar-container .rbc-today { background-color: rgba(239, 68, 68, 0.05); border-top: 3px solid #ef4444; }
                                    .dark .calendar-container .rbc-today { background-color: rgba(239, 68, 68, 0.1); border-top: 3px solid #ef4444; }
                                    
                                    .calendar-container .rbc-event { border-radius: 6px; padding: 3px 8px; border: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.2s ease, box-shadow 0.2s ease; }
                                    .calendar-container .rbc-event:hover { transform: translateY(-1px) scale(1.02); box-shadow: 0 4px 8px rgba(0,0,0,0.2); z-index: 5; }
                                    
                                    /* Hide events in Month View completely */
                                    .calendar-container .rbc-month-view .rbc-event, .calendar-container .rbc-month-view .rbc-show-more { display: none !important; }
                                    
                                    .calendar-container .rbc-button-link { font-weight: 700; color: #4b5563; padding: 4px; display: inline-block; }
                                    .dark .calendar-container .rbc-button-link { color: #d1d5db; }
                                    
                                    .calendar-container .rbc-toolbar { margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
                                    .calendar-container .rbc-toolbar > span:first-child { display: flex; gap: 4px; }
                                    
                                    .calendar-container .rbc-toolbar-label { font-size: 1.5rem; font-weight: 900; color: #111827; letter-spacing: -0.02em; }
                                    .dark .calendar-container .rbc-toolbar-label { color: #ffffff; }
                                    
                                    .calendar-container .rbc-toolbar button { color: #4b5563; border: 1px solid #e5e7eb; border-radius: 8px; padding: 6px 16px; font-weight: 600; font-size: 0.875rem; background: #ffffff; transition: all 0.2s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
                                    .dark .calendar-container .rbc-toolbar button { color: #d1d5db; border-color: #374151; background: #1f2937; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
                                    
                                    .calendar-container .rbc-toolbar button:hover { background: #f9fafb; border-color: #d1d5db; color: #111827; }
                                    .dark .calendar-container .rbc-toolbar button:hover { background: #374151; border-color: #4b5563; color: #ffffff; }
                                    
                                    .calendar-container .rbc-toolbar button:active, .calendar-container .rbc-toolbar button.rbc-active { background: #ef4444; color: white; border-color: #ef4444; box-shadow: 0 2px 4px rgba(239,68,68,0.2); }
                                    .dark .calendar-container .rbc-toolbar button:active, .dark .calendar-container .rbc-toolbar button.rbc-active { background: #ef4444; color: white; border-color: #ef4444; box-shadow: 0 2px 4px rgba(239,68,68,0.2); }
                                    
                                    .calendar-container .rbc-show-more { background: rgba(239, 68, 68, 0.1); color: #ef4444; font-weight: 800; border-radius: 4px; padding: 2px 6px; margin-top: 2px; transition: background 0.2s ease; }
                                    .calendar-container .rbc-show-more:hover { background: rgba(239, 68, 68, 0.2); color: #dc2626; }
                                    
                                    /* Week/Day View Enhancements */
                                    .calendar-container .rbc-time-view, .calendar-container .rbc-time-header, .calendar-container .rbc-time-content, .calendar-container .rbc-timeslot-group, .calendar-container .rbc-time-header-content { border-color: #f3f4f6; }
                                    .dark .calendar-container .rbc-time-view, .dark .calendar-container .rbc-time-header, .dark .calendar-container .rbc-time-content, .dark .calendar-container .rbc-timeslot-group, .dark .calendar-container .rbc-time-header-content { border-color: #1f2937; }
                                    
                                    .calendar-container .rbc-day-slot .rbc-time-slot { border-top: 1px solid #f9fafb; }
                                    .dark .calendar-container .rbc-day-slot .rbc-time-slot { border-top: 1px solid #111827; }
                                    
                                    .calendar-container .rbc-label { font-size: 0.75rem; font-weight: 700; color: #9ca3af; padding: 0 8px; }
                                    .dark .calendar-container .rbc-label { color: #6b7280; }
                                    
                                    .calendar-container .rbc-current-time-indicator { display: none !important; }
                                    
                                    .calendar-container .rbc-allday-cell { display: none; }
                                    
                                    /* datetime-local picker icon fix for dark mode */
                                    input[type="datetime-local"]::-webkit-calendar-picker-indicator {
                                        filter: invert(1) brightness(0.7);
                                        opacity: 0.6;
                                        cursor: pointer;
                                        border-radius: 4px;
                                        padding: 2px;
                                        transition: opacity 0.2s;
                                    }
                                    input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
                                        opacity: 1;
                                        filter: invert(1) brightness(1);
                                    }
                                `}</style>
                                <Calendar
                                    localizer={localizer}
                                    events={schedules}
                                    eventPropGetter={(event) => {
                                        const group = groups.find(g => g.name === event.group);
                                        const bgColor = group?.color || GROUP_COLORS[0];
                                        return { style: { background: bgColor } };
                                    }}
                                    startAccessor="start"
                                    endAccessor="end"
                                    style={{ height: '100%', width: '100%' }}
                                    views={['month', 'week', 'day', 'agenda']}
                                    view={currentView}
                                    onView={setCurrentView}
                                    date={currentDate}
                                    onNavigate={(newDate) => setCurrentDate(newDate)}
                                    selectable={true}
                                    min={new Date(1970, 1, 1, 8, 0, 0)}
                                    max={new Date(1970, 1, 1, 20, 0, 0)}
                                    formats={{
                                        timeGutterFormat: 'HH:mm',
                                        selectRangeFormat: ({ start, end }, culture, localizer) => `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
                                        eventTimeRangeFormat: ({ start, end }, culture, localizer) => `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
                                        agendaTimeRangeFormat: ({ start, end }, culture, localizer) => `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`
                                    }}
                                    onSelectSlot={(slotInfo) => {
                                        const start = moment(slotInfo.start);
                                        
                                        if (start.isBefore(moment().startOf('day'))) {
                                            toast.error(t('adminDashboard.pastDateError', "O'tib ketgan sanaga dars qo'shib bo'lmaydi!"));
                                            return;
                                        }
                                        
                                        if (start.hours() === 0 && start.minutes() === 0) {
                                            setSelectedDateForModal(slotInfo.start);
                                        } else {
                                            setEditingScheduleId(null);
                                            setNewScheduleGroup('');
                                            let end = moment(slotInfo.end);
                                            setNewScheduleStart(start.format('YYYY-MM-DDTHH:mm'));
                                            setNewScheduleEnd(end.format('YYYY-MM-DDTHH:mm'));
                                            setShowAddScheduleModal(true);
                                        }
                                    }}
                                    onSelectEvent={(event) => handleEditScheduleClick(event)}
                                    className="text-gray-800 dark:text-gray-300 text-sm"
                                    messages={{
                                        allDay: t('calendar.allDay', "Kun bo'yi"),
                                        previous: "◀",
                                        next: "▶",
                                        today: t('calendar.today', "Bugun"),
                                        month: t('calendar.month', "Oy"),
                                        week: t('calendar.week', "Hafta"),
                                        day: t('calendar.day', "Kun"),
                                        agenda: t('calendar.agenda', "Ro'yxat"),
                                        date: t('calendar.date', "Sana"),
                                        time: t('calendar.time', "Vaqt"),
                                        event: t('calendar.event', "Voqea"),
                                        noEventsInRange: t('calendar.noEventsInRange', "Bu oraliqda darslar yo'q.")
                                    }}
                                />
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
                                                                setNewGroupColor(group.color || GROUP_COLORS[0])
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
                            {groups.flatMap(g => (g.students || [])).length > 0 && (
                                <button onClick={() => {
                                    setEditingStudentId(null);
                                    setNewStudentName('');
                                    setNewStudentPhone('');
                                    setNewStudentGender('erkak');
                                    setNewStudentGroupId('');
                                    setShowAddStudentModal(true);
                                }} className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2">
                                    <FaUserPlus /> {t('adminDashboard.addStudentBtn', "O'quvchi qo'shish")}
                                </button>
                            )}
                        </div>

                        {groups.flatMap(g => (g.students || []).map(s => ({...s, groupName: g.name, groupId: g.id}))).length === 0 ? (
                            <div className="text-center py-16 flex flex-col items-center justify-center">
                                <FaUserGraduate className="text-6xl text-gray-200 dark:text-gray-700 mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('adminDashboard.noStudentsTitle', "Hali o'quvchilar yo'q")}</h3>
                                <p className="text-gray-500 mb-6">{t('adminDashboard.noStudentsDesc', "Guruhlarga kirib o'quvchi qo'shishingiz mumkin.")}</p>
                                <button onClick={() => {
                                    setEditingStudentId(null);
                                    setNewStudentName('');
                                    setNewStudentPhone('');
                                    setNewStudentGender('erkak');
                                    setNewStudentGroupId('');
                                    setShowAddStudentModal(true);
                                }} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2">
                                    <FaUserPlus /> {t('adminDashboard.addStudentBtn', "O'quvchi qo'shish")}
                                </button>
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
        {selectedDateForModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in overflow-y-auto">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 relative my-8">
                    <button onClick={() => setSelectedDateForModal(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                        <FaTimes className="text-xl" />
                    </button>
                    
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center text-2xl font-bold shrink-0">
                            <FaCalendarAlt />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">{moment(selectedDateForModal).format('DD MMMM, YYYY')} - Dars jadvali</h3>
                            <p className="text-sm font-bold text-gray-500 mt-1">Soatlar kesimida guruhlar</p>
                        </div>
                    </div>

                    <div className="bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl p-4 sm:p-6 border border-gray-100 dark:border-gray-800 max-h-[65vh] overflow-y-auto custom-scrollbar">
                        <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-12 sm:ml-16 space-y-6 pb-6">
                            {Array.from({length: 13}).map((_, i) => {
                                const hour = i + 8; // 08:00 dan 20:00 gacha
                                const timeStr = `${hour.toString().padStart(2, '0')}:00`;
                                
                                const cellStart = moment(selectedDateForModal).hours(hour).minutes(0).seconds(0);
                                const cellEnd = moment(selectedDateForModal).hours(hour+1).minutes(0).seconds(0);
                                
                                // Find if any schedule overlaps with this hour cell
                                const cellSchedules = schedules.filter(s => {
                                    const sStart = moment(s.start);
                                    const sEnd = moment(s.end);
                                    return sStart.isBefore(cellEnd) && sEnd.isAfter(cellStart);
                                });

                                return (
                                    <div key={timeStr} className="relative pl-6 sm:pl-10">
                                        {/* Timeline Dot */}
                                        <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-gray-900 border-[4px] border-indigo-200 dark:border-indigo-900/60 shadow-sm z-10 transition-colors duration-300"></div>
                                        
                                        {/* Time Label */}
                                        <div className="absolute -left-16 sm:-left-20 top-1 text-sm font-black text-gray-400 dark:text-gray-500 w-12 text-right">
                                            {timeStr}
                                        </div>

                                        {/* Content */}
                                        <div className="min-h-[44px]">
                                            {cellSchedules.length > 0 ? (
                                                <div className="grid gap-3">
                                                    {cellSchedules.map(sch => (
                                                        <div key={sch.id} className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-4 shadow-lg shadow-red-500/20 text-white relative group/item overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
                                                            {/* Glass reflection effect */}
                                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                                            
                                                            <div className="flex justify-between items-center relative z-10">
                                                                <div>
                                                                    <h4 className="text-lg font-black tracking-tight">{sch.group}</h4>
                                                                    <p className="text-sm font-bold text-white/80 mt-0.5">{moment(sch.start).format('HH:mm')} - {moment(sch.end).format('HH:mm')}</p>
                                                                </div>
                                                                
                                                                {/* Action buttons */}
                                                                <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-all duration-300 translate-x-4 group-hover/item:translate-x-0">
                                                                    <button onClick={() => {
                                                                        handleEditScheduleClick(sch);
                                                                        setSelectedDateForModal(null);
                                                                    }} className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-colors shadow-sm"><FaRegEye className="text-white" /></button>
                                                                    <button onClick={() => {
                                                                        setDeleteModalSchedule(sch);
                                                                        setSelectedDateForModal(null);
                                                                    }} className="w-9 h-9 rounded-xl bg-black/20 hover:bg-black/30 backdrop-blur-md flex items-center justify-center transition-colors shadow-sm"><FaTrash className="text-white" /></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                cellStart.isBefore(moment().startOf('day')) ? (
                                                    <div className="w-full text-left py-3.5 px-5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 text-gray-400/60 dark:text-gray-600 font-bold text-sm">
                                                        <span className="flex items-center gap-3">
                                                            <FaCalendarAlt className="text-lg opacity-30" /> 
                                                            <span>Bu vaqtda dars o'tilmagan</span>
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => {
                                                        setEditingScheduleId(null);
                                                        setNewScheduleGroup('');
                                                        setNewScheduleStart(cellStart.format('YYYY-MM-DDTHH:mm'));
                                                        setNewScheduleEnd(cellEnd.format('YYYY-MM-DDTHH:mm'));
                                                        setShowAddScheduleModal(true);
                                                        setSelectedDateForModal(null);
                                                    }} className="w-full text-left py-3.5 px-5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700/60 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-sm transition-all duration-300 group shadow-sm hover:shadow-md">
                                                        <span className="flex items-center gap-3">
                                                            <FaCalendarAlt className="text-lg opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" /> 
                                                            <span>Bu vaqt bo'sh. Guruh qo'shish</span>
                                                        </span>
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )}

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
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowScheduleGroupDropdown(!showScheduleGroupDropdown)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium text-left flex items-center justify-between gap-2 transition-all hover:border-red-400 focus:outline-none focus:border-red-500"
                                >
                                    <div className="flex items-center gap-2">
                                        {newScheduleGroup && (() => { const g = groups.find(gr => gr.name === newScheduleGroup); return g?.color ? <span className="w-3 h-3 rounded-full shadow-sm flex-shrink-0" style={{ background: g.color }}></span> : null; })()}
                                        <span className={newScheduleGroup ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-400'}>
                                            {newScheduleGroup || t('adminDashboard.selectGroup', 'Guruhni tanlang')}
                                        </span>
                                    </div>
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${showScheduleGroupDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>

                                {showScheduleGroupDropdown && (
                                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                                        <div className="fixed inset-0 z-[-1]" onClick={() => setShowScheduleGroupDropdown(false)}></div>
                                        {groups.map(g => (
                                            <button
                                                key={g.id}
                                                type="button"
                                                onClick={() => { setNewScheduleGroup(g.name); setShowScheduleGroupDropdown(false); }}
                                                className={`w-full px-4 py-3 text-sm font-medium text-left transition-all flex items-center gap-3 ${newScheduleGroup === g.name ? 'bg-gradient-to-r from-red-500 to-red-600 text-white font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                            >
                                                {g.color && <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: g.color }}></span>}
                                                {g.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('adminDashboard.startTime', 'Boshlanish vaqti')}</label>
                            <input type="datetime-local" value={newScheduleStart} onChange={(e) => setNewScheduleStart(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-red-500 text-gray-900 dark:text-white" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('adminDashboard.endTime', 'Tugash vaqti')}</label>
                            <input type="datetime-local" value={newScheduleEnd} onChange={(e) => setNewScheduleEnd(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-red-500 text-gray-900 dark:text-white" required />
                        </div>
                        <div className="flex gap-3 pt-2">
                            {editingScheduleId && (
                                <button type="button" onClick={() => {
                                    const sch = schedules.find(s => s.id === editingScheduleId);
                                    if (sch) setDeleteModalSchedule(sch);
                                    setShowAddScheduleModal(false);
                                }} className="w-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition">
                                    <FaTrash />
                                </button>
                            )}
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
                        <h3 className="text-lg font-black text-gray-900 dark:text-white">{t('adminDashboard.deleteGroupConfirm', "Ushbu guruhni o'chirmoqchimisiz?")}</h3>
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
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('adminDashboard.groupNameLabel', "Guruh nomi (Masalan: IELTS Beginner)")}</label>
                            <input type="text" value={newGroupNameInput} onChange={(e) => setNewGroupNameInput(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-red-500 text-gray-900 dark:text-white" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">{t('adminDashboard.groupColorLabel', "Guruh rangi (Kalendarda shunday ko'rinadi)")}</label>
                            <div className="flex flex-wrap gap-3 items-center mt-1">
                                {GROUP_COLORS.map((color, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setNewGroupColor(color)}
                                        className={`w-8 h-8 rounded-full shadow-sm transition-transform ${newGroupColor === color ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-110'}`}
                                        style={{ background: color }}
                                        title={`Rang ${idx + 1}`}
                                    />
                                ))}
                                <div className="w-[1px] h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                                <div className="relative">
                                    <button
                                        type="button" 
                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                        className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 transition-transform ${(!GROUP_COLORS.includes(newGroupColor) || showColorPicker) ? 'scale-125 ring-2 ring-offset-2 ring-gray-400 border-none' : 'hover:scale-110'}`}
                                        style={{ background: !GROUP_COLORS.includes(newGroupColor) ? newGroupColor : 'transparent' }}
                                        title="Boshqa rang tanlash"
                                    >
                                        {GROUP_COLORS.includes(newGroupColor) && <span className="text-gray-400 text-lg leading-none font-light mb-0.5">+</span>}
                                    </button>
                                    
                                    {showColorPicker && (
                                        <div className="absolute top-full left-0 mt-3 z-[60] animate-fade-in shadow-2xl rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800">
                                            <div className="fixed inset-0 z-[-1]" onClick={() => setShowColorPicker(false)}></div>
                                            <HexColorPicker color={newGroupColor.startsWith('#') ? newGroupColor : '#ff0000'} onChange={setNewGroupColor} />
                                        </div>
                                    )}
                                </div>
                            </div>
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

                        {!selectedGroupDetails && (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('adminDashboard.selectGroup', 'Guruhni tanlang')}</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowStudentGroupDropdown(!showStudentGroupDropdown)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium text-left flex items-center justify-between gap-2 transition-all hover:border-indigo-400 focus:outline-none focus:border-indigo-500"
                                    >
                                        <div className="flex items-center gap-2">
                                            {newStudentGroupId && (() => { const g = groups.find(gr => String(gr.id) === String(newStudentGroupId)); return g?.color ? <span className="w-3 h-3 rounded-full shadow-sm flex-shrink-0" style={{ background: g.color }}></span> : null; })()}
                                            <span className={newStudentGroupId ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-400'}>
                                                {newStudentGroupId ? groups.find(g => String(g.id) === String(newStudentGroupId))?.name || t('adminDashboard.selectGroup', 'Guruhni tanlang') : t('adminDashboard.selectGroup', 'Guruhni tanlang')}
                                            </span>
                                        </div>
                                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${showStudentGroupDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>

                                    {showStudentGroupDropdown && (
                                        <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto custom-scrollbar bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-2xl animate-fade-in">
                                            <div className="fixed inset-0 z-[-1]" onClick={() => setShowStudentGroupDropdown(false)}></div>
                                            {groups.map(g => (
                                                <button
                                                    key={g.id}
                                                    type="button"
                                                    onClick={() => { setNewStudentGroupId(g.id); setShowStudentGroupDropdown(false); }}
                                                    className={`w-full px-4 py-3 text-sm font-medium text-left transition-all flex items-center gap-3 ${String(newStudentGroupId) === String(g.id) ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                                >
                                                    {g.color && <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: g.color }}></span>}
                                                    {g.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
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
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center text-2xl shrink-0">
                            <FaCheckCircle />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">{t('adminPanel.acceptStudentTitle', "O'quvchini qabul qilish")}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{leadToAccept?.name}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('adminDashboard.selectGroup', 'Guruhni tanlang')}</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowAcceptGroupDropdown(!showAcceptGroupDropdown)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium text-left flex items-center justify-between gap-2 transition-all hover:border-red-400 focus:outline-none focus:border-red-500"
                                >
                                    <div className="flex items-center gap-2">
                                        {acceptToGroupId && (() => { const g = groups.find(gr => String(gr.id) === String(acceptToGroupId)); return g?.color ? <span className="w-3 h-3 rounded-full shadow-sm flex-shrink-0" style={{ background: g.color }}></span> : null; })()}
                                        <span className={acceptToGroupId ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-400'}>
                                            {acceptToGroupId ? groups.find(g => String(g.id) === String(acceptToGroupId))?.name || t('adminDashboard.selectGroup', 'Guruhni tanlang') : t('adminDashboard.selectGroup', 'Guruhni tanlang')}
                                        </span>
                                    </div>
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${showAcceptGroupDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>

                                {showAcceptGroupDropdown && (
                                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                                        <div className="fixed inset-0 z-[-1]" onClick={() => setShowAcceptGroupDropdown(false)}></div>
                                        {groups.map(g => (
                                            <button
                                                key={g.id}
                                                type="button"
                                                onClick={() => { setAcceptToGroupId(g.id); setShowAcceptGroupDropdown(false); }}
                                                className={`w-full px-4 py-3 text-sm font-medium text-left transition-all flex items-center gap-3 ${String(acceptToGroupId) === String(g.id) ? 'bg-gradient-to-r from-red-500 to-red-600 text-white font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                            >
                                                {g.color && <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: g.color }}></span>}
                                                {g.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button onClick={() => { setShowAcceptLeadModal(false); setShowAcceptGroupDropdown(false); }} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">{t('adminPanel.noBtn', 'Bekor qilish')}</button>
                        <button onClick={handleAcceptLeadToGroup} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold text-sm shadow-md shadow-red-500/20 transition">{t('adminPanel.acceptBtn', 'Qabul qilish')}</button>
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
                            <div className="flex items-center bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden focus-within:border-red-500 transition-all">
                                <span className="px-4 text-sm font-bold text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-gray-700 py-3">+998</span>
                                <input
                                    type="text"
                                    maxLength={9}
                                    value={newLeadPhone}
                                    onChange={(e) => setNewLeadPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                                    placeholder="(90) 123-45-67"
                                    className="flex-1 px-4 py-3 bg-transparent text-sm font-bold tracking-wider focus:outline-none text-gray-900 dark:text-white placeholder:text-gray-400 placeholder:font-normal"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Guruhni tanlang (Majburiy emas)</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowLeadGroupDropdown(!showLeadGroupDropdown)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium text-left flex items-center justify-between gap-2 transition-all hover:border-red-400 focus:outline-none focus:border-red-500"
                                >
                                    <div className="flex items-center gap-2">
                                        {newLeadGroup && (() => { const g = groups.find(gr => String(gr.id) === String(newLeadGroup)); return g?.color ? <span className="w-3 h-3 rounded-full shadow-sm flex-shrink-0" style={{ background: g.color }}></span> : null; })()}
                                        <span className={newLeadGroup ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-400'}>
                                            {newLeadGroup ? groups.find(g => String(g.id) === String(newLeadGroup))?.name || t('adminDashboard.selectGroup', 'Guruhni tanlang') : t('adminDashboard.selectGroup', 'Guruhni tanlang')}
                                        </span>
                                    </div>
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${showLeadGroupDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>

                                {showLeadGroupDropdown && (
                                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                                        <div className="fixed inset-0 z-[-1]" onClick={() => setShowLeadGroupDropdown(false)}></div>

                                        {groups.map(g => (
                                            <button
                                                key={g.id}
                                                type="button"
                                                onClick={() => { setNewLeadGroup(g.id); setShowLeadGroupDropdown(false); }}
                                                className={`w-full px-4 py-3 text-sm font-medium text-left transition-all flex items-center gap-3 ${String(newLeadGroup) === String(g.id) ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                            >
                                                {g.color && <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: g.color }}></span>}
                                                {g.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
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