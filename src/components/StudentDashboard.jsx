import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaGraduationCap, 
    FaCalendarAlt, 
    FaUsers, 
    FaBook, 
    FaClock, 
    FaSignOutAlt, 
    FaCheckCircle, 
    FaTimesCircle, 
    FaExclamationCircle, 
    FaUserGraduate, 
    FaChalkboardTeacher,
    FaArrowRight,
    FaSync,
    FaEye,
    FaEyeSlash,
    FaCommentDots,
    FaComments,
    FaPaperPlane,
    FaTimes,
    FaEnvelope,
    FaEdit,
    FaTrash,
    FaCheck,
    FaCamera,
    FaImage,
    FaUserEdit,
    FaLock,
    FaUser,
    FaKey
} from 'react-icons/fa';
import { useAuth } from '../utils/AuthContext';
import { 
    getSchedules, 
    getGroups, 
    getHomework, 
    getGroupMessages, 
    sendGroupMessage,
    updateGroupMessage,
    deleteGroupMessage,
    updateStudentAvatar,
    updateUserProfile
} from '../utils/authService';
import moment from 'moment';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { currentUser, logout, loading: authLoading, refreshSession } = useAuth();

    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'schedule' | 'group' | 'homework'
    const [schedules, setSchedules] = useState([]);
    const [myGroup, setMyGroup] = useState(null);
    const [homeworkList, setHomeworkList] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [showMyPassword, setShowMyPassword] = useState(false);

    // Messaging & SMS state
    const [messages, setMessages] = useState([]);
    const [selectedChatStudent, setSelectedChatStudent] = useState(null);
    const [directMsgInput, setDirectMsgInput] = useState('');
    const [groupMsgInput, setGroupMsgInput] = useState('');
    const [sendingMsg, setSendingMsg] = useState(false);
    const [editingMsgId, setEditingMsgId] = useState(null);
    const [editMsgText, setEditMsgText] = useState('');
    const chatBottomRef = useRef(null);

    // Avatar upload state
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null);

    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_SIZE = 320;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height = Math.round((height * MAX_SIZE) / width);
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width = Math.round((width * MAX_SIZE) / height);
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                    resolve(dataUrl);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Iltimos, rasm faylini tanlang (JPG, PNG, WebP)!");
            return;
        }

        try {
            setUploadingAvatar(true);
            const loadToast = toast.loading("Rasm saqlanmoqda...");
            const compressedBase64 = await compressImage(file);
            await updateStudentAvatar(currentUser.username || currentUser.id, compressedBase64);
            await refreshSession();
            await loadStudentData();
            toast.dismiss(loadToast);
            toast.success("Profil rasmi muvaffaqiyatli yangilandi! 🎉");
        } catch (err) {
            console.error('Avatar upload error:', err);
            toast.error("Rasmni saqlashda xatolik yuz berdi");
        } finally {
            setUploadingAvatar(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemoveAvatar = async () => {
        if (!window.confirm("Profilingiz rasmini o'chirishni xohlaysizmi?")) return;
        try {
            setUploadingAvatar(true);
            await updateStudentAvatar(currentUser.username || currentUser.id, null);
            await refreshSession();
            await loadStudentData();
            toast.success("Profil rasmi o'chirildi");
        } catch (err) {
            toast.error("Xatolik yuz berdi");
        } finally {
            setUploadingAvatar(false);
        }
    };

    // Edit Profile credentials state
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [editProfileName, setEditProfileName] = useState('');
    const [editProfileUsername, setEditProfileUsername] = useState('');
    const [editProfilePassword, setEditProfilePassword] = useState('');
    const [showEditPassword, setShowEditPassword] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);

    const openEditProfileModal = () => {
        if (!currentUser) return;
        setEditProfileName(currentUser.name || '');
        setEditProfileUsername((currentUser.username || '').replace(/^@/, ''));
        setEditProfilePassword(currentUser.rawPassword || '');
        setShowEditPassword(false);
        setIsEditProfileOpen(true);
    };

    const handleSaveProfile = async (e) => {
        if (e) e.preventDefault();
        if (!editProfileName.trim()) {
            toast.error("Ism-familiyangizni kiriting!");
            return;
        }
        const cleanUname = editProfileUsername.trim().toLowerCase().replace(/^@/, '').replace(/\s+/g, '');
        if (!cleanUname || cleanUname.length < 3) {
            toast.error("Login kamida 3 ta belgidan iborat bo'lishi kerak!");
            return;
        }
        if (editProfilePassword && editProfilePassword.length < 6) {
            toast.error("Parol kamida 6 ta belgidan iborat bo'lishi kerak!");
            return;
        }

        try {
            setSavingProfile(true);
            const loadToast = toast.loading("Profil ma'lumotlari yangilanmoqda...");
            await updateUserProfile(currentUser.username || currentUser.id, {
                newName: editProfileName.trim(),
                newUsername: cleanUname,
                newPassword: editProfilePassword ? editProfilePassword.trim() : undefined
            });
            await refreshSession();
            await loadStudentData();
            toast.dismiss(loadToast);
            toast.success("Profil ma'lumotlaringiz muvaffaqiyatli yangilandi! 🎉");
            setIsEditProfileOpen(false);
        } catch (err) {
            console.error('Save profile error:', err);
            toast.error(err.message || "Xatolik yuz berdi");
        } finally {
            setSavingProfile(false);
        }
    };


    // Route guard
    useEffect(() => {
        if (!authLoading && !currentUser) {
            navigate('/login');
        }
    }, [currentUser, authLoading, navigate]);

    const loadStudentData = async () => {
        if (!currentUser) return;
        setLoadingData(true);
        try {
            const [allSchedules, allGroups, allHw] = await Promise.all([
                getSchedules(),
                getGroups(),
                getHomework()
            ]);

            // Find student's group
            const currentGroup = allGroups.find(g => 
                g.id === currentUser.groupId || 
                g.name === currentUser.groupName ||
                (g.students || []).some(s => s.id === currentUser.id || s.userId === currentUser.id || s.username === currentUser.username)
            );
            setMyGroup(currentGroup || null);

            // Filter schedules for student's group only
            const groupName = currentGroup ? currentGroup.name : currentUser.groupName;
            const relevantSchedules = allSchedules.filter(s => 
                (s.group && groupName && s.group.trim().toLowerCase() === groupName.trim().toLowerCase()) ||
                (s.groupId && currentGroup && s.groupId === currentGroup.id)
            ).map(s => ({
                ...s,
                startDate: new Date(s.start),
                endDate: new Date(s.end)
            })).sort((a, b) => new Date(a.start) - new Date(b.start));

            setSchedules(relevantSchedules);

            // Filter homework for student's group
            const relevantHw = allHw.filter(h => 
                (h.group && groupName && h.group.trim().toLowerCase() === groupName.trim().toLowerCase()) ||
                (h.groupId && currentGroup && h.groupId === currentGroup.id)
            );
            setHomeworkList(relevantHw);

            // Load group messages
            const gid = currentGroup?.id || currentUser.groupId;
            if (gid) {
                await loadMessages(gid);
            }

        } catch (e) {
            console.error('Error loading student dashboard data', e);
        } finally {
            setLoadingData(false);
        }
    };

    const loadMessages = async (groupId) => {
        const gid = groupId || myGroup?.id || currentUser?.groupId;
        if (!gid) return;
        try {
            const list = await getGroupMessages(gid);
            setMessages(list);
        } catch (e) {}
    };

    const handleSendDirectMessage = async (e) => {
        if (e) e.preventDefault();
        const text = directMsgInput.trim();
        if (!text || !selectedChatStudent) return;
        const gid = myGroup?.id || currentUser?.groupId || 'default_group';

        setSendingMsg(true);
        try {
            const msgObj = {
                senderId: currentUser.id,
                senderName: currentUser.name,
                senderUsername: currentUser.username,
                senderAvatar: currentUser.avatar || currentUser.image || null,
                targetUsername: selectedChatStudent.username || selectedChatStudent.name,
                targetName: selectedChatStudent.name,
                text: text
            };
            const sent = await sendGroupMessage(gid, msgObj);
            setMessages(prev => [...prev, sent]);
            setDirectMsgInput('');
            toast.success("Xabar yuborildi!");
        } catch (e) {
            toast.error("Xabar yuborishda xatolik");
        } finally {
            setSendingMsg(false);
        }
    };

    const handleSendGroupMessage = async (e) => {
        if (e) e.preventDefault();
        const text = groupMsgInput.trim();
        if (!text) return;
        const gid = myGroup?.id || currentUser?.groupId || 'default_group';

        setSendingMsg(true);
        try {
            const msgObj = {
                senderId: currentUser.id,
                senderName: currentUser.name,
                senderUsername: currentUser.username,
                senderAvatar: currentUser.avatar || currentUser.image || null,
                targetUsername: 'all',
                targetName: 'Barcha guruhdoshlar',
                text: text
            };
            const sent = await sendGroupMessage(gid, msgObj);
            setMessages(prev => [...prev, sent]);
            setGroupMsgInput('');
            toast.success("Xabar guruhga yuborildi!");
        } catch (e) {
            toast.error("Xabar yuborishda xatolik");
        } finally {
            setSendingMsg(false);
        }
    };

    const handleStartEdit = (msg) => {
        const isOwner = (msg.senderUsername && currentUser?.username && msg.senderUsername.toLowerCase() === currentUser.username.toLowerCase()) ||
                        (msg.senderId && currentUser?.id && String(msg.senderId) === String(currentUser.id));
        if (!isOwner) {
            toast.error("Faqat o'zingiz yozgan xabarni tahrirlashingiz mumkin!");
            return;
        }
        setEditingMsgId(msg.id || msg.firebaseKey);
        setEditMsgText(msg.text);
    };

    const handleSaveEdit = async (msgId) => {
        if (!editMsgText.trim()) return;
        const gid = myGroup?.id || currentUser?.groupId || 'default_group';
        try {
            await updateGroupMessage(gid, msgId, editMsgText, currentUser.id, currentUser.username);
            setMessages(prev => prev.map(m => {
                if (m.id === msgId || m.firebaseKey === msgId) {
                    return { ...m, text: editMsgText.trim(), isEdited: true, updatedAt: new Date().toISOString() };
                }
                return m;
            }));
            setEditingMsgId(null);
            setEditMsgText('');
            toast.success("Xabaringiz tahrirlandi!");
        } catch (err) {
            toast.error(err.message || "Tahrirlashda xatolik");
        }
    };

    const handleDeleteMessage = async (msgId, senderUsername) => {
        if (senderUsername && currentUser?.username && senderUsername.toLowerCase() !== currentUser.username.toLowerCase()) {
            toast.error("Faqat o'zingiz yozgan xabarni o'chirishingiz mumkin!");
            return;
        }
        const gid = myGroup?.id || currentUser?.groupId || 'default_group';
        try {
            await deleteGroupMessage(gid, msgId, currentUser.id, currentUser.username);
            setMessages(prev => prev.filter(m => m.id !== msgId && m.firebaseKey !== msgId));
            toast.success("Xabaringiz o'chirildi!");
        } catch (err) {
            toast.error(err.message || "O'chirishda xatolik");
        }
    };

    useEffect(() => {
        if (currentUser) {
            loadStudentData();
        }
    }, [currentUser]);

    // Live background polling for messages
    useEffect(() => {
        const gid = myGroup?.id || currentUser?.groupId;
        if (!gid) return;
        const interval = setInterval(() => {
            loadMessages(gid);
        }, 3000);
        return () => clearInterval(interval);
    }, [myGroup?.id, currentUser?.groupId]);

    if (authLoading || !currentUser) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-red-500/20 border-t-red-600 animate-spin" />
            </div>
        );
    }

    // Guard: Pending Administrator Approval
    if (currentUser.status === 'pending') {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 select-none relative overflow-hidden flex items-center justify-center">
                <div className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/[0.08] rounded-full blur-[160px] -z-10" />

                <div className="w-full max-w-2xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative rounded-3xl bg-white/95 dark:bg-[#0b0e17]/95 backdrop-blur-3xl border border-amber-500/30 dark:border-amber-500/20 shadow-2xl p-8 sm:p-12 overflow-hidden text-center"
                    >
                        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-pulse" />

                        <div className="relative group w-20 h-20 mx-auto mb-6">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-4xl shadow-xl shadow-amber-500/25 overflow-hidden border-2 border-white/80 dark:border-white/10">
                                {currentUser.avatar || currentUser.image ? (
                                    <img src={currentUser.avatar || currentUser.image} alt={currentUser.name} className="w-full h-full object-cover" />
                                ) : (
                                    <FaClock />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingAvatar}
                                className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-slate-900/90 hover:bg-amber-600 text-white shadow-md border border-white/20 transition cursor-pointer active:scale-95 flex items-center justify-center"
                                title="Galereyadan rasm tanlash"
                            >
                                {uploadingAvatar ? <FaSync className="animate-spin text-xs" /> : <FaCamera className="text-xs" />}
                            </button>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 mb-4">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                            <span>TASDIQLASH KUTILMOQDA</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3">
                            Arizangiz qabul qilindi, {currentUser.name}!
                        </h2>

                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed mb-8">
                            Hisobingiz muvaffaqiyatli ro'yxatdan o'tdi. Administrator sizning arizangizni tasdiqlab, o'quv guruhiga biriktirgach, barcha darslar jadvali, xona raqamlari va uy vazifalari avtomatik ravishda ochiladi.
                        </p>

                        <div className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl p-5 mb-8 text-left space-y-3">
                            <div className="flex justify-between items-center text-xs sm:text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Login (Username):</span>
                                <span className="font-mono font-bold text-slate-800 dark:text-white">@{currentUser.username}</span>
                            </div>
                            {currentUser.rawPassword && (
                                <div className="flex justify-between items-center text-xs sm:text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Parolingiz:</span>
                                    <div className="flex items-center gap-2 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                        <span>{showMyPassword ? currentUser.rawPassword : '••••••••'}</span>
                                        <button
                                            type="button"
                                            onClick={() => setShowMyPassword(!showMyPassword)}
                                            className="text-slate-400 hover:text-indigo-500 transition"
                                            title={showMyPassword ? "Yashirish" : "Ko'rish"}
                                        >
                                            {showMyPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-xs sm:text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Telefon:</span>
                                <span className="font-semibold text-slate-800 dark:text-white">{currentUser.phone || '-'}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs sm:text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Tanlangan guruh / kurs:</span>
                                <span className="font-bold text-red-600 dark:text-red-400">{currentUser.groupName || currentUser.course || 'Guruh kodi kiritilgan'}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs sm:text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Holat:</span>
                                <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                                    Tekshirilmoqda (Kutilmoqda)
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                            <button
                                onClick={async () => {
                                    setLoadingData(true);
                                    const updated = await refreshSession();
                                    if (updated && updated.status === 'active') {
                                        toast.success("Hisobingiz tasdiqlandi!");
                                        loadStudentData();
                                    } else {
                                        toast("Hali tasdiqlanmadi. Administrator tekshirmoqda.", { icon: '⏳' });
                                    }
                                    setLoadingData(false);
                                }}
                                disabled={loadingData}
                                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-sm shadow-lg shadow-red-600/25 hover:from-red-500 hover:to-rose-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <FaSync className={loadingData ? 'animate-spin' : ''} />
                                <span>Holatni tekshirish</span>
                            </button>

                            <button
                                type="button"
                                onClick={openEditProfileModal}
                                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 font-bold text-sm border border-slate-200 dark:border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <FaUserEdit className="text-base" />
                                <span>Tahrirlash</span>
                            </button>

                            <button
                                onClick={() => { logout(); navigate('/'); }}
                                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-500/20 font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <FaSignOutAlt />
                                <span>Chiqish</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Guard: Suspended account
    if (currentUser.status === 'suspended') {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 select-none relative overflow-hidden flex items-center justify-center">
                <div className="w-full max-w-lg text-center p-8 rounded-3xl bg-white/95 dark:bg-[#0b0e17]/95 border border-rose-500/30 shadow-2xl">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-3xl mb-4">
                        <FaTimesCircle />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Hisobingiz to'xtatilgan</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        Ushbu hisob ma'muriyat tomonidan vaqtincha to'xtatilgan. Iltimos, o'quv markazi ma'muriyati bilan bog'laning.
                    </p>
                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="px-6 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 font-bold text-sm"
                    >
                        Chiqish
                    </button>
                </div>
            </div>
        );
    }

    const upcomingLessons = schedules.filter(s => new Date(s.end) >= new Date());
    const pastLessons = schedules.filter(s => new Date(s.end) < new Date());

    return (
        <div className="min-h-screen pt-20 sm:pt-28 pb-16 px-3 sm:px-6 lg:px-8 select-none relative overflow-hidden">
            {/* Ambient Background Aura */}
            <div className="pointer-events-none fixed top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-red-600/[0.06] rounded-full blur-[160px] -z-10" />

            <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
                
                {/* Top Profile Banner Bar */}
                <div className="relative rounded-3xl bg-gradient-to-r from-white/95 via-white/90 to-slate-50/95 dark:from-[#0d101a]/95 dark:via-[#090b12]/95 dark:to-[#06080e]/95 backdrop-blur-3xl border border-black/[0.08] dark:border-white/[0.1] shadow-xl p-4 sm:p-8 overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                    
                    {/* Hidden file input for gallery upload */}
                    <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarUpload} 
                    />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                        <div className="flex items-center gap-3.5 sm:gap-4">
                            <div className="relative group shrink-0">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white flex items-center justify-center text-2xl sm:text-3xl shadow-lg shadow-red-600/30 overflow-hidden border-2 border-white/80 dark:border-white/10">
                                    {currentUser.avatar || currentUser.image ? (
                                        <img 
                                            src={currentUser.avatar || currentUser.image} 
                                            alt={currentUser.name} 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <FaUserGraduate />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingAvatar}
                                    className="absolute -bottom-1 -right-1 p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-red-600 text-white shadow-md border border-white/20 transition cursor-pointer active:scale-95 flex items-center justify-center"
                                    title="Galereyadan rasm tanlash / o'zgartirish"
                                >
                                    {uploadingAvatar ? (
                                        <FaSync className="animate-spin text-[10px]" />
                                    ) : (
                                        <FaCamera className="text-[11px]" />
                                    )}
                                </button>
                            </div>
                            <div className="space-y-0.5 sm:space-y-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                    <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-heading truncate">
                                        {currentUser.name}
                                    </h1>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                                        FAOL O'QUVCHI
                                    </span>
                                    {(currentUser.avatar || currentUser.image) && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveAvatar}
                                            disabled={uploadingAvatar}
                                            className="text-[10px] text-slate-400 hover:text-rose-500 transition underline cursor-pointer ml-1"
                                            title="Rasmni o'chirish"
                                        >
                                            Rasmni o'chirish
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="truncate">@{currentUser.username} • Guruh: <strong className="text-slate-800 dark:text-white font-bold">{myGroup?.name || currentUser.groupName || "Biriktirilmagan"}</strong></span>
                                    {currentUser.rawPassword && (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold">
                                            <span>Parol: {showMyPassword ? currentUser.rawPassword : '••••••••'}</span>
                                            <button
                                                type="button"
                                                onClick={() => setShowMyPassword(!showMyPassword)}
                                                className="text-slate-400 hover:text-indigo-500 transition ml-0.5 cursor-pointer"
                                                title={showMyPassword ? "Yashirish" : "Ko'rish"}
                                            >
                                                {showMyPassword ? <FaEyeSlash className="text-[11px]" /> : <FaEye className="text-[11px]" />}
                                            </button>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-2.5 self-end md:self-center">
                            <button
                                onClick={openEditProfileModal}
                                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/10 transition-all border border-slate-200 dark:border-white/10 text-xs font-bold cursor-pointer active:scale-95 shadow-xs"
                                title="Ism, login va parolni tahrirlash"
                            >
                                <FaUserEdit className="text-sm" />
                                <span className="hidden sm:inline">Tahrirlash</span>
                            </button>
                            <button
                                onClick={loadStudentData}
                                className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:text-red-500 transition-colors border border-slate-200 dark:border-white/10 cursor-pointer"
                                title="Yangilash"
                            >
                                <FaSync className={loadingData ? 'animate-spin' : ''} />
                            </button>
                            <button
                                onClick={() => { logout(); navigate('/'); }}
                                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-xs font-bold transition-colors cursor-pointer"
                            >
                                <FaSignOutAlt />
                                <span>Chiqish</span>
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs - Horizontal Swipe on Mobile */}
                    <div className="flex items-center gap-2 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-200/80 dark:border-white/[0.08] overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                        {[
                            { id: 'overview', label: 'Umumiy holat', icon: <FaGraduationCap /> },
                            { id: 'schedule', label: `Dars jadvali (${upcomingLessons.length})`, icon: <FaCalendarAlt /> },
                            { id: 'group', label: `Mening guruhim`, icon: <FaUsers /> },
                            { id: 'homework', label: `Vazifalar (${homeworkList.length})`, icon: <FaBook /> },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`shrink-0 whitespace-nowrap inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30'
                                        : 'bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-white/5'
                                }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* 3 Metric Tiles */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-5 rounded-2xl bg-white/95 dark:bg-[#0c0f18]/95 border border-slate-200 dark:border-white/10 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Guruh</span>
                                    <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center text-sm">
                                        <FaUsers />
                                    </div>
                                </div>
                                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
                                    {myGroup?.name || currentUser.groupName || "Mavjud emas"}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{myGroup?.course || 'Optimum Academic Program'}</p>
                            </div>

                            <div className="p-5 rounded-2xl bg-white/95 dark:bg-[#0c0f18]/95 border border-slate-200 dark:border-white/10 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Keyingi dars</span>
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-sm">
                                        <FaClock />
                                    </div>
                                </div>
                                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
                                    {upcomingLessons.length > 0 ? moment(upcomingLessons[0].start).format('DD MMM, HH:mm') : "Belgilanmagan"}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    {upcomingLessons.length > 0 ? upcomingLessons[0].title || "Optimum Lesson" : "Hozircha rejalashtirilgan dars yo'q"}
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-white/95 dark:bg-[#0c0f18]/95 border border-slate-200 dark:border-white/10 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Guruh a'zolari</span>
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm">
                                        <FaUserGraduate />
                                    </div>
                                </div>
                                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
                                    {myGroup?.students ? myGroup.students.length : 1} nafar
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Guruh statusi: Faol</p>
                            </div>
                        </div>

                        {/* Next upcoming class card */}
                        <div className="rounded-3xl bg-white/95 dark:bg-[#0c0f18]/95 border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading mb-4 flex items-center gap-2">
                                <FaCalendarAlt className="text-red-500" />
                                <span>Yaqinlashayotgan darslar</span>
                            </h3>

                            {upcomingLessons.length === 0 ? (
                                <div className="text-center py-12 text-slate-500 space-y-2">
                                    <FaClock className="w-10 h-10 mx-auto text-slate-400 opacity-40" />
                                    <p className="text-sm font-bold">Hozirda yaqin darslar jadvalga kiritilmagan</p>
                                    <p className="text-xs">Administrator dars qo'shganda bu yerda avtomatik ko'rinadi.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {upcomingLessons.slice(0, 3).map((lesson) => (
                                        <div key={lesson.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex flex-col items-center justify-center font-mono font-black shrink-0 border border-red-500/20">
                                                    <span className="text-xs leading-none">{moment(lesson.start).format('DD')}</span>
                                                    <span className="text-[10px] leading-none uppercase">{moment(lesson.start).format('MMM')}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{lesson.title || lesson.group}</h4>
                                                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                                                        {moment(lesson.start).format('HH:mm')} - {moment(lesson.end).format('HH:mm')} (Toshkent vaqti)
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 self-start sm:self-center border border-emerald-500/20">
                                                Rejalashtirilgan
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 2: SCHEDULE */}
                {activeTab === 'schedule' && (
                    <div className="rounded-3xl bg-white/95 dark:bg-[#0c0f18]/95 border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">
                                Guruh dars jadvali
                            </h3>
                            <span className="text-xs font-mono font-bold text-slate-500">
                                Jami: {schedules.length} ta dars
                            </span>
                        </div>

                        {schedules.length === 0 ? (
                            <div className="text-center py-16 text-slate-500">
                                <FaCalendarAlt className="w-12 h-12 mx-auto text-slate-400 opacity-40 mb-3" />
                                <p className="text-sm font-bold">Ushbu guruh uchun darslar belgilanmagan</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {schedules.map((lesson) => {
                                    const isPast = new Date(lesson.end) < new Date();
                                    return (
                                        <div
                                            key={lesson.id}
                                            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                                isPast 
                                                    ? 'bg-slate-50/50 dark:bg-white/[0.01] border-slate-200/50 dark:border-white/5 opacity-75' 
                                                    : 'bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/10 shadow-xs'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono font-black shrink-0 border ${
                                                    isPast ? 'bg-slate-200/50 dark:bg-white/5 text-slate-500 border-transparent' : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                }`}>
                                                    <span className="text-xs leading-none">{moment(lesson.start).format('DD')}</span>
                                                    <span className="text-[10px] leading-none uppercase">{moment(lesson.start).format('MMM')}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{lesson.title || lesson.group}</h4>
                                                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                                                        {moment(lesson.start).format('dddd, HH:mm')} - {moment(lesson.end).format('HH:mm')}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold self-start sm:self-center border ${
                                                isPast 
                                                    ? 'bg-slate-200 dark:bg-white/5 text-slate-500 border-transparent' 
                                                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                            }`}>
                                                {isPast ? "O'tkazilgan" : "Kutilmoqda"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: GROUP */}
                {activeTab === 'group' && (
                    <div className="rounded-3xl bg-white/95 dark:bg-[#0c0f18]/95 border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading">
                                    {myGroup?.name || currentUser.groupName || "Guruh biriktirilmagan"}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Kurs: {myGroup?.course || "General English"} • Daraja: {myGroup?.level || "B2 Intermediate"}
                                </p>
                            </div>
                            {myGroup?.inviteCode && (
                                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                                    <span className="text-[10px] uppercase font-bold text-red-500 block">Guruh taklif kodi</span>
                                    <span className="text-base font-mono font-black text-red-600 dark:text-red-400">{myGroup.inviteCode}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Guruhdoshlar ro'yxati ({myGroup?.students ? myGroup.students.length : 1} nafar)
                                    </h4>
                                    <p className="text-[11px] text-slate-400">
                                        Istalgan guruhdoshingizga SMS xabar yozishingiz mumkin
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {(myGroup?.students || [{ name: currentUser.name, username: currentUser.username }]).map((st, i) => {
                                    const isMe = (st.username && (st.username.toLowerCase() === currentUser.username.toLowerCase())) ||
                                                 (st.id && (st.id === currentUser.id || String(st.id) === String(currentUser.id))) ||
                                                 (st.name && st.name.toLowerCase() === currentUser.name.toLowerCase());

                                    // Count direct messages with this classmate
                                    const directCount = messages.filter(m => 
                                        (m.senderUsername === st.username && m.targetUsername === currentUser.username) ||
                                        (m.senderUsername === currentUser.username && m.targetUsername === st.username)
                                    ).length;

                                    return (
                                        <div 
                                            key={i} 
                                            className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex flex-col justify-between gap-3 hover:border-red-500/40 transition-all shadow-xs"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="relative">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-white/10 dark:to-white/5 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200/60 dark:border-white/10 overflow-hidden">
                                                        {(isMe ? (currentUser.avatar || currentUser.image) : (st.avatar || st.image)) ? (
                                                            <img 
                                                                src={isMe ? (currentUser.avatar || currentUser.image) : (st.avatar || st.image)} 
                                                                alt={st.name} 
                                                                className="w-full h-full object-cover" 
                                                            />
                                                        ) : (
                                                            st.name ? st.name.charAt(0).toUpperCase() : 'S'
                                                        )}
                                                    </div>
                                                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0c0f18]" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{st.name}</p>
                                                        {isMe && (
                                                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-500/10 text-red-600 dark:text-red-400">
                                                                Siz
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 truncate">@{st.username || 'student'}</p>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                                                {!isMe ? (
                                                    <button
                                                        onClick={() => setSelectedChatStudent(st)}
                                                        className="w-full py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-600 dark:text-red-400 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-red-500/20 shadow-xs cursor-pointer active:scale-95"
                                                        title={`${st.name} ga SMS xabar yozish`}
                                                    >
                                                        <FaPaperPlane className="text-[10px]" />
                                                        <span>SMS yozish</span>
                                                        {directCount > 0 && (
                                                            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-red-600 text-white font-mono">
                                                                {directCount}
                                                            </span>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <div className="w-full py-1.5 text-center text-[10px] font-bold text-slate-400">
                                                        Sizning profilingiz
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Guruhdoshlar jonli umumiy chati & SMS */}
                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center text-sm">
                                        <FaComments />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Guruh umumiy chati & SMS
                                        </h4>
                                        <p className="text-[11px] text-slate-400">
                                            Barcha guruhdoshlar bu yerdagi xabarlarni real-vaqtda ko'rishadi
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono font-bold text-slate-500">
                                    {messages.length} ta xabar
                                </span>
                            </div>

                            {/* Message Feed */}
                            <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 p-3 sm:p-4 h-72 sm:h-80 overflow-y-auto space-y-3 custom-scrollbar flex flex-col">
                                {messages.length === 0 ? (
                                    <div className="my-auto text-center py-8 text-slate-400 space-y-2">
                                        <FaCommentDots className="w-10 h-10 mx-auto opacity-30 text-slate-400" />
                                        <p className="text-xs font-bold">Hozircha xabarlar yo'q</p>
                                        <p className="text-[11px]">Guruhdoshlaringizga birinchi bo'lib salom yozing!</p>
                                    </div>
                                ) : (
                                    messages.map((m, idx) => {
                                        const isMine = (m.senderUsername && currentUser?.username && m.senderUsername.toLowerCase() === currentUser.username.toLowerCase()) || 
                                                       (m.senderId && currentUser?.id && String(m.senderId) === String(currentUser.id));
                                        const isDirectToMe = m.targetUsername && currentUser?.username && m.targetUsername.toLowerCase() === currentUser.username.toLowerCase();
                                        const isEditing = editingMsgId === (m.id || m.firebaseKey);

                                        const senderStudent = (myGroup?.students || []).find(s => 
                                            (s.username && m.senderUsername && s.username.toLowerCase() === m.senderUsername.toLowerCase()) ||
                                            (s.id && m.senderId && String(s.id) === String(m.senderId)) ||
                                            (s.name && m.senderName && s.name.toLowerCase() === m.senderName.toLowerCase())
                                        );
                                        const avatarSrc = isMine 
                                            ? (currentUser.avatar || currentUser.image) 
                                            : (m.senderAvatar || senderStudent?.avatar || senderStudent?.image);

                                        return (
                                            <div
                                                key={m.id || m.firebaseKey || idx}
                                                className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} space-y-1 group`}
                                            >
                                                <div className="flex items-center gap-1.5 sm:gap-2 px-1">
                                                    <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-200 dark:bg-white/10 flex items-center justify-center text-[9px] font-bold shrink-0">
                                                        {avatarSrc ? (
                                                            <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span>{(m.senderName || m.senderUsername || 'U').charAt(0).toUpperCase()}</span>
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                                        {isMine ? 'Siz' : (m.senderName || m.senderUsername)}
                                                    </span>
                                                    {m.targetUsername && m.targetUsername !== 'all' && (
                                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-500 font-bold">
                                                            ➔ @{m.targetUsername}
                                                        </span>
                                                    )}
                                                    {m.isEdited && (
                                                        <span className="text-[9px] text-slate-400 italic">
                                                            (tahrirlangan)
                                                        </span>
                                                    )}
                                                    <span className="text-[9px] text-slate-400 font-mono">
                                                        {m.createdAt ? moment(m.createdAt).format('HH:mm') : ''}
                                                    </span>

                                                    {/* Edit & Delete ONLY for owner */}
                                                    {isMine && !isEditing && (
                                                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition ml-1">
                                                            <button
                                                                onClick={() => handleStartEdit(m)}
                                                                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-amber-500 text-[10px] cursor-pointer"
                                                                title="Xabarni tahrirlash"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteMessage(m.id || m.firebaseKey, m.senderUsername)}
                                                                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-rose-500 text-[10px] cursor-pointer"
                                                                title="Xabarni o'chirish"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Editing Mode */}
                                                {isEditing ? (
                                                    <div className="flex items-center gap-1.5 w-full max-w-[90%] sm:max-w-[75%]">
                                                        <input
                                                            type="text"
                                                            value={editMsgText}
                                                            onChange={(e) => setEditMsgText(e.target.value)}
                                                            className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0c0f18] text-xs text-slate-900 dark:text-white border border-red-500 focus:outline-none shadow-xs"
                                                            autoFocus
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleSaveEdit(m.id || m.firebaseKey);
                                                                if (e.key === 'Escape') setEditingMsgId(null);
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => handleSaveEdit(m.id || m.firebaseKey)}
                                                            className="p-2 rounded-xl bg-emerald-500 text-white text-xs hover:bg-emerald-600 transition shadow-xs cursor-pointer"
                                                            title="Saqlash"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingMsgId(null)}
                                                            className="p-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs hover:bg-slate-300 transition cursor-pointer"
                                                            title="Bekor qilish"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs max-w-[85%] sm:max-w-[70%] break-words leading-relaxed shadow-xs ${
                                                            isMine
                                                                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-tr-none'
                                                                : isDirectToMe
                                                                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 border border-indigo-500/30 rounded-tl-none font-medium'
                                                                : 'bg-white dark:bg-white/[0.08] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-white/5 rounded-tl-none'
                                                        }`}
                                                    >
                                                        {m.text}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Input Form */}
                            <form onSubmit={handleSendGroupMessage} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={groupMsgInput}
                                    onChange={(e) => setGroupMsgInput(e.target.value)}
                                    placeholder="Guruhdoshlaringizga xabar yozing (SMS)..."
                                    className="flex-1 px-3.5 sm:px-4 py-2.5 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-red-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!groupMsgInput.trim() || sendingMsg}
                                    className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 shadow-md shadow-red-600/20 cursor-pointer active:scale-95 shrink-0"
                                >
                                    <FaPaperPlane className="text-[11px]" />
                                    <span className="hidden sm:inline">Yuborish</span>
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* TAB 4: HOMEWORK */}
                {activeTab === 'homework' && (
                    <div className="rounded-3xl bg-white/95 dark:bg-[#0c0f18]/95 border border-slate-200 dark:border-white/10 p-4 sm:p-8 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">
                                Uyga vazifalar
                            </h3>
                            <span className="text-xs font-mono font-bold text-slate-500">
                                {homeworkList.length} ta topshiriq
                            </span>
                        </div>

                        {homeworkList.length === 0 ? (
                            <div className="text-center py-16 text-slate-500">
                                <FaBook className="w-12 h-12 mx-auto text-slate-400 opacity-40 mb-3" />
                                <p className="text-sm font-bold">Ushbu guruh uchun yangi vazifalar yo'q</p>
                                <p className="text-xs mt-1">O'qituvchi yangi vazifa yuklaganda bu yerda paydo bo'ladi.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {homeworkList.map((hw, idx) => (
                                    <div key={hw.id || idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{hw.title}</h4>
                                            {hw.dueDate && (
                                                <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                                                    Muddati: {hw.dueDate}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{hw.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* DIRECT SMS / CHAT MODAL WITH SPECIFIC CLASSMATE */}
                <AnimatePresence>
                    {selectedChatStudent && (
                        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                                className="w-full max-w-lg bg-white dark:bg-[#0c0f18] rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col h-[88vh] sm:h-[540px]"
                            >
                                {/* Modal Header */}
                                <div className="p-3.5 sm:p-5 bg-gradient-to-r from-slate-50 to-white dark:from-white/[0.04] dark:to-transparent border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 shrink-0">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-md shadow-red-600/20 shrink-0 overflow-hidden">
                                            {selectedChatStudent.avatar || selectedChatStudent.image ? (
                                                <img 
                                                    src={selectedChatStudent.avatar || selectedChatStudent.image} 
                                                    alt={selectedChatStudent.name} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                                selectedChatStudent.name ? selectedChatStudent.name.charAt(0).toUpperCase() : 'S'
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                                {selectedChatStudent.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                                <span>@{selectedChatStudent.username || 'student'}</span>
                                                <span className="flex items-center gap-1 text-emerald-500 font-bold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    Online
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedChatStudent(null)}
                                        className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 flex items-center justify-center transition cursor-pointer"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>

                                {/* Direct Message Feed */}
                                <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 custom-scrollbar flex flex-col bg-slate-50/50 dark:bg-black/20">
                                    {(() => {
                                        const directMsgs = messages.filter(m => 
                                            (m.senderUsername === currentUser.username && m.targetUsername === selectedChatStudent.username) ||
                                            (m.senderUsername === selectedChatStudent.username && (m.targetUsername === currentUser.username || m.targetUsername === 'all'))
                                        );

                                        if (directMsgs.length === 0) {
                                            return (
                                                <div className="my-auto text-center py-8 text-slate-400 space-y-3">
                                                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center text-xl sm:text-2xl">
                                                        <FaPaperPlane />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                            {selectedChatStudent.name} ga SMS xabar yozing
                                                        </p>
                                                        <p className="text-[11px] text-slate-400 mt-1">
                                                            Siz yozgan xabar o'quvchi profilida darhol ko'rinadi.
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return directMsgs.map((m, idx) => {
                                            const isMine = (m.senderUsername && currentUser?.username && m.senderUsername.toLowerCase() === currentUser.username.toLowerCase()) ||
                                                           (m.senderId && currentUser?.id && String(m.senderId) === String(currentUser.id));
                                            const isEditing = editingMsgId === (m.id || m.firebaseKey);
                                            const directAvatarSrc = isMine 
                                                ? (currentUser.avatar || currentUser.image) 
                                                : (m.senderAvatar || selectedChatStudent.avatar || selectedChatStudent.image);

                                            return (
                                                <div
                                                    key={m.id || m.firebaseKey || idx}
                                                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} space-y-1 group`}
                                                >
                                                    <div className="flex items-center gap-1.5 px-1 text-[9px] text-slate-400 font-mono">
                                                        <div className="w-4 h-4 rounded-full overflow-hidden bg-slate-200 dark:bg-white/10 flex items-center justify-center text-[8px] font-bold shrink-0">
                                                            {directAvatarSrc ? (
                                                                <img src={directAvatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span>{(isMine ? currentUser.name : selectedChatStudent.name).charAt(0).toUpperCase()}</span>
                                                            )}
                                                        </div>
                                                        <span>{isMine ? 'Siz' : selectedChatStudent.name}</span>
                                                        <span>•</span>
                                                        {m.isEdited && <span className="italic text-slate-400">(tahrirlangan) •</span>}
                                                        <span>{m.createdAt ? moment(m.createdAt).format('HH:mm') : ''}</span>

                                                        {/* Edit / Delete strictly for owner */}
                                                        {isMine && !isEditing && (
                                                            <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition ml-1">
                                                                <button
                                                                    onClick={() => handleStartEdit(m)}
                                                                    className="p-0.5 rounded text-slate-400 hover:text-amber-500 cursor-pointer"
                                                                    title="Tahrirlash"
                                                                >
                                                                    <FaEdit className="text-[10px]" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteMessage(m.id || m.firebaseKey, m.senderUsername)}
                                                                    className="p-0.5 rounded text-slate-400 hover:text-rose-500 cursor-pointer"
                                                                    title="O'chirish"
                                                                >
                                                                    <FaTrash className="text-[10px]" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Inline edit inside direct modal */}
                                                    {isEditing ? (
                                                        <div className="flex items-center gap-1.5 w-full max-w-[95%]">
                                                            <input
                                                                type="text"
                                                                value={editMsgText}
                                                                onChange={(e) => setEditMsgText(e.target.value)}
                                                                className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0c0f18] text-xs text-slate-900 dark:text-white border border-red-500 focus:outline-none shadow-xs"
                                                                autoFocus
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') handleSaveEdit(m.id || m.firebaseKey);
                                                                    if (e.key === 'Escape') setEditingMsgId(null);
                                                                }}
                                                            />
                                                            <button
                                                                onClick={() => handleSaveEdit(m.id || m.firebaseKey)}
                                                                className="p-2 rounded-xl bg-emerald-500 text-white text-xs hover:bg-emerald-600 transition cursor-pointer"
                                                            >
                                                                <FaCheck />
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingMsgId(null)}
                                                                className="p-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs hover:bg-slate-300 transition cursor-pointer"
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs max-w-[85%] break-words leading-relaxed shadow-xs ${
                                                                isMine
                                                                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-tr-none'
                                                                    : 'bg-white dark:bg-white/[0.08] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-white/5 rounded-tl-none'
                                                            }`}
                                                        >
                                                            {m.text}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>

                                {/* Modal Input Footer */}
                                <form onSubmit={handleSendDirectMessage} className="p-3 sm:p-3.5 bg-white dark:bg-[#0c0f18] border-t border-slate-200 dark:border-white/10 flex items-center gap-2 shrink-0">
                                    <input
                                        type="text"
                                        autoFocus
                                        value={directMsgInput}
                                        onChange={(e) => setDirectMsgInput(e.target.value)}
                                        placeholder={`${selectedChatStudent.name} ga SMS yozing...`}
                                        className="flex-1 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-red-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!directMsgInput.trim() || sendingMsg}
                                        className="px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer active:scale-95 shrink-0"
                                    >
                                        <FaPaperPlane className="text-[11px]" />
                                        <span>Yuborish</span>
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* EDIT PROFILE CREDENTIALS MODAL */}
                <AnimatePresence>
                    {isEditProfileOpen && (
                        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="w-full max-w-md bg-white dark:bg-[#0c0f18] rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white flex items-center justify-center text-lg shadow-md shadow-red-600/20">
                                            <FaUserEdit />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-slate-900 dark:text-white font-heading">
                                                Profilni tahrirlash
                                            </h3>
                                            <p className="text-[11px] text-slate-400">
                                                Ismingiz, login va parolingizni yangilang
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditProfileOpen(false)}
                                        className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 flex items-center justify-center transition cursor-pointer"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>

                                <form onSubmit={handleSaveProfile} className="space-y-4">
                                    {/* Name Field */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                            <FaUser className="text-red-500 text-[11px]" />
                                            <span>To'liq ism-familiya</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={editProfileName}
                                            onChange={(e) => setEditProfileName(e.target.value)}
                                            placeholder="Masalan: Bilol Aliyev"
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                    </div>

                                    {/* Username Field */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                            <span className="text-red-500 font-mono font-bold text-sm">@</span>
                                            <span>Login (Username)</span>
                                        </label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-3.5 text-slate-400 font-mono font-bold text-xs select-none">
                                                @
                                            </span>
                                            <input
                                                type="text"
                                                value={editProfileUsername}
                                                onChange={(e) => setEditProfileUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                                                placeholder="bilol"
                                                required
                                                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white font-mono placeholder:text-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-400">
                                            Tizimga kirish uchun ushbu login ishlatiladi (kamida 3 belgi)
                                        </p>
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                            <FaLock className="text-red-500 text-[11px]" />
                                            <span>Parol</span>
                                        </label>
                                        <div className="relative flex items-center">
                                            <input
                                                type={showEditPassword ? 'text' : 'password'}
                                                value={editProfilePassword}
                                                onChange={(e) => setEditProfilePassword(e.target.value)}
                                                placeholder="Yangi parol (kamida 6 ta belgi)"
                                                required
                                                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white font-mono placeholder:text-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowEditPassword(!showEditPassword)}
                                                className="absolute right-3 text-slate-400 hover:text-red-500 transition cursor-pointer"
                                                title={showEditPassword ? "Yashirish" : "Ko'rish"}
                                            >
                                                {showEditPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-slate-400">
                                            Yangi parolni kiriting (kamida 6 ta belgi)
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-white/5">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditProfileOpen(false)}
                                            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
                                        >
                                            Bekor qilish
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={savingProfile}
                                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold transition shadow-md shadow-red-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                        >
                                            {savingProfile ? (
                                                <>
                                                    <FaSync className="animate-spin text-xs" />
                                                    <span>Saqlanmoqda...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FaCheck className="text-xs" />
                                                    <span>Saqlash</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
