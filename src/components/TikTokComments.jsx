import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHeart, FaRegHeart, FaPaperPlane, FaTrash, FaCheckCircle, FaUserCircle, FaSync, FaChevronDown, FaChevronUp, FaTimes, FaEnvelope, FaAt, FaComments, FaCommentDots } from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'

const API_URL = 'https://jsonblob.com/api/jsonBlob/019fdb65-5567-75af-ba93-74e706ff9f88'

export default function TikTokComments({ isAdmin = false, defaultOpen = false }) {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(isAdmin ? true : defaultOpen)
    const [comments, setComments] = useState([])
    const [usernameInput, setUsernameInput] = useState('')
    const [emailInput, setEmailInput] = useState('')
    const [text, setText] = useState('')
    const [score, setScore] = useState('IELTS 7.5')
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    // Predefined vibrant gradients for user avatars
    const avatarGradients = [
        'from-pink-500 to-rose-500',
        'from-purple-500 to-indigo-500',
        'from-cyan-500 to-blue-500',
        'from-emerald-500 to-teal-500',
        'from-amber-500 to-orange-500',
        'from-red-500 to-pink-600'
    ]

    const loadComments = async () => {
        setLoading(true)
        try {
            const res = await axios.get(API_URL)
            const list = Array.isArray(res.data) ? res.data : []
            setComments(list)
            localStorage.setItem('tiktok_comments', JSON.stringify(list))
        } catch (e) {
            console.error(e)
            const stored = JSON.parse(localStorage.getItem('tiktok_comments') || '[]')
            setComments(stored)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadComments()

        // Real-vaqtda sinxronlash (har 4 soniyada)
        const interval = setInterval(() => {
            loadComments()
        }, 4000)

        return () => clearInterval(interval)
    }, [])

    const handleAddComment = async (e) => {
        e.preventDefault()

        // Read directly from DOM input elements as foolproof fallback for browser autofill selection
        const domEmail = document.getElementById('user-email-input')?.value || emailInput
        const domUsername = document.getElementById('user-username-input')?.value || usernameInput

        const finalEmail = domEmail.trim()
        const finalUsername = domUsername.trim()

        if (!finalUsername || !finalEmail || !text.trim()) {
            toast.error("Iltimos, Username, Gmail va izohni to'liq kiriting!")
            return
        }

        if (!finalEmail.includes('@') || !finalEmail.includes('.')) {
            toast.error("Iltimos, to'g'ri Gmail / Email manzilini kiriting!")
            return
        }

        setSubmitting(true)
        const formattedUsername = finalUsername.startsWith('@') 
            ? finalUsername 
            : `@${finalUsername.toLowerCase().replace(/\s+/g, '_')}`

        const displayName = finalUsername.replace(/^@/, '')

        const newComment = {
            id: Date.now(),
            name: displayName,
            username: formattedUsername,
            email: finalEmail,
            avatarGradient: avatarGradients[Math.floor(Math.random() * avatarGradients.length)],
            text: text.trim(),
            score: score,
            likesCount: 1,
            likedByMe: false,
            date: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) + ' · Bugun'
        }

        const updatedList = [newComment, ...comments]
        setComments(updatedList)
        localStorage.setItem('tiktok_comments', JSON.stringify(updatedList))
        setText('')
        setEmailInput('')
        setUsernameInput('')

        try {
            await axios.put(API_URL, updatedList)
            toast.success("Izohingiz qo'shildi!")
        } catch (err) {
            console.error(err)
        } finally {
            setSubmitting(false)
        }
    }

    const toggleLike = async (id) => {
        const updatedList = comments.map(item => {
            if (item.id === id) {
                const isLiked = !item.likedByMe
                return {
                    ...item,
                    likedByMe: isLiked,
                    likesCount: isLiked ? (item.likesCount || 0) + 1 : Math.max(0, (item.likesCount || 0) - 1)
                }
            }
            return item
        })

        setComments(updatedList)
        localStorage.setItem('tiktok_comments', JSON.stringify(updatedList))

        try {
            await axios.put(API_URL, updatedList)
        } catch (e) {
            console.error(e)
        }
    }

    const handleDeleteComment = async (id) => {
        const updatedList = comments.filter(item => item.id !== id)
        setComments(updatedList)
        localStorage.setItem('tiktok_comments', JSON.stringify(updatedList))

        try {
            await axios.put(API_URL, updatedList)
            toast.success("Izoh o'chirildi!")
        } catch (e) {
            console.error(e)
        }
    }

    if (!isOpen) {
        return (
            <div className="flex justify-center my-6 font-['Plus_Jakarta_Sans',sans-serif]">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="group inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-red-600/30 transition-all cursor-pointer border border-red-400/30"
                >
                    <FaComments className="text-base animate-bounce" />
                    <span>{t('studentComments.viewAndLeaveBtn', "Izohlarni ko'rish va qoldirish")}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-mono font-bold">
                        {comments.length}
                    </span>
                    <FaChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
                </motion.button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto font-['Plus_Jakarta_Sans',sans-serif] text-gray-900 dark:text-white select-none transition-all duration-300">
            
            {/* Header section */}
            <div className="flex items-center justify-between p-4 sm:p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-t-3xl border-t border-x border-gray-200 dark:border-gray-800 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-red-500 flex items-center justify-center text-white text-lg shadow-lg shadow-pink-500/30">
                        <FaComments />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-black tracking-tight">
                            {t('studentComments.title', "O'quvchilar Izohlari va Natijalari")}
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                            {t('studentComments.subtitle', "O'quvchilar izohlari ({{count}} ta izoh)", { count: comments.length })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={loadComments}
                        className="p-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all cursor-pointer active:scale-95"
                        title="Yangilash"
                    >
                        <FaSync className={loading ? "animate-spin text-sm" : "text-sm"} />
                    </button>

                    {!isAdmin && (
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all cursor-pointer active:scale-95"
                            title="Yopish"
                        >
                            <FaChevronUp className="text-sm" />
                        </button>
                    )}
                </div>
            </div>

            {/* Comments Scrollable List */}
            <div className="bg-white/60 dark:bg-gray-950/60 backdrop-blur-xl border-x border-gray-200 dark:border-gray-800 max-h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4 divide-y divide-gray-100 dark:divide-gray-800/60">
                {comments.length === 0 ? (
                    <div className="py-12 text-center space-y-3">
                        <FaCommentDots className="text-4xl animate-bounce text-gray-400 mx-auto" />
                        <h4 className="text-base font-bold text-gray-700 dark:text-gray-300">
                            {t('studentComments.noComments', "Hozircha izohlar yo'q")}
                        </h4>
                        <p className="text-xs text-gray-500">
                            {t('studentComments.beFirst', "Birinchi bo'lib Username va Gmail pochta orqali izohingizni qoldiring!")}
                        </p>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {comments.map((comment) => (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                                className="pt-4 first:pt-0 flex items-start justify-between gap-3 group"
                            >
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    {/* User Avatar */}
                                    {comment.avatar ? (
                                        <img
                                            src={comment.avatar}
                                            alt={comment.name}
                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-500/30 shrink-0"
                                        />
                                    ) : (
                                        <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${comment.avatarGradient || 'from-pink-500 to-rose-500'} flex items-center justify-center text-white font-black text-sm shadow-md shrink-0`}>
                                            {comment.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}

                                    {/* Comment Details */}
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                                                {comment.name}
                                            </span>
                                            <span className="text-[11px] font-mono text-gray-400">
                                                {comment.username}
                                            </span>
                                            {comment.email && (
                                                <span className="text-[10px] text-gray-400 flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                                                    <FaEnvelope className="text-[9px] text-red-500" />
                                                    {comment.email}
                                                </span>
                                            )}
                                            {comment.score && (
                                                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-red-600/10 to-rose-600/10 border border-red-500/20 text-[#c41e30] dark:text-red-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                                    <FaCheckCircle className="text-[9px]" />
                                                    {comment.score}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 leading-relaxed break-words">
                                            {comment.text}
                                        </p>

                                        <div className="flex items-center gap-4 text-[11px] font-semibold text-gray-400 pt-0.5">
                                            <span>{comment.date || 'Hozirgina'}</span>
                                            <button className="hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
                                                Javob berish
                                            </button>

                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                                >
                                                    <FaTrash className="text-[10px]" />
                                                    <span>O'chirish</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* TikTok-Style Heart Like Button */}
                                <div className="flex flex-col items-center justify-center shrink-0 pl-2">
                                    <motion.button
                                        whileTap={{ scale: 1.4 }}
                                        onClick={() => toggleLike(comment.id)}
                                        className="p-2 cursor-pointer transition-colors"
                                        aria-label="Like comment"
                                    >
                                        {comment.likedByMe ? (
                                            <motion.div
                                                initial={{ scale: 0.5 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                            >
                                                <FaHeart className="text-lg text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
                                            </motion.div>
                                        ) : (
                                            <FaRegHeart className="text-lg text-gray-400 hover:text-rose-400 transition-colors" />
                                        )}
                                    </motion.button>
                                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 -mt-1">
                                        {comment.likesCount || 0}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Bottom Add Comment Bar */}
            <form
                onSubmit={handleAddComment}
                className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl p-4 sm:p-5 rounded-b-3xl border-b border-x border-gray-200 dark:border-gray-800 shadow-xl space-y-3"
            >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative flex items-center">
                        <FaAt className="absolute left-3.5 text-gray-400 text-xs" />
                        <input
                            type="text"
                            name="username"
                            id="user-username-input"
                            autoComplete="username"
                            placeholder={t('studentComments.usernamePlaceholder', "Username (masalan: @azizbek)")}
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            onInput={(e) => setUsernameInput(e.target.value)}
                            onSelect={(e) => setUsernameInput(e.target.value)}
                            onBlur={(e) => setUsernameInput(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-red-600 text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    <div className="relative flex items-center">
                        <FaEnvelope className="absolute left-3.5 text-gray-400 text-xs" />
                        <input
                            type="email"
                            name="email"
                            id="user-email-input"
                            autoComplete="email"
                            placeholder={t('studentComments.emailPlaceholder', "Gmail pochta (azizbek@gmail.com)")}
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            onInput={(e) => setEmailInput(e.target.value)}
                            onSelect={(e) => setEmailInput(e.target.value)}
                            onBlur={(e) => setEmailInput(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-red-600 text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    <select
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-red-600 cursor-pointer h-[42px]"
                    >
                        <option value="IELTS 7.0">IELTS 7.0</option>
                        <option value="IELTS 7.5">IELTS 7.5</option>
                        <option value="IELTS 8.0">IELTS 8.0</option>
                        <option value="IELTS 8.5">IELTS 8.5</option>
                        <option value="IELTS 9.0">IELTS 9.0</option>
                        <option value="O'quvchi">O'quvchi</option>
                    </select>
                </div>

                <div className="relative flex items-center">
                    <input
                        type="text"
                        placeholder={t('studentComments.textPlaceholder', "Izohingizni yozing...")}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-red-600 text-gray-900 dark:text-white"
                        required
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="absolute right-2 p-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold transition-all shadow-md shadow-red-600/30 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        <FaPaperPlane className="text-xs" />
                    </button>
                </div>
            </form>

        </div>
    )
}
