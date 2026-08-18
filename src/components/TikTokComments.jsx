import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHeart, FaRegHeart, FaPaperPlane, FaTrash, FaCheckCircle, FaUserCircle, FaSync, FaChevronDown, FaChevronUp, FaTimes, FaEnvelope, FaAt, FaComments, FaCommentDots } from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'

const API_URL = import.meta.env.VITE_FIREBASE_COMMENTS_URL

export default function CommentsORG({ isAdmin = false, defaultOpen = false }) {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(isAdmin ? true : defaultOpen)
    const [CommentsORG, setCommentsORG] = useState([])
    const [replyingTo, setReplyingTo] = useState(null)
    const [expandedReplies, setExpandedReplies] = useState({})
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

    const loadCommentsORG = async () => {
        setLoading(true)
        try {
            const res = await axios.get(API_URL, { validateStatus: status => status < 500 })
            if (res.status === 200 && res.data !== null) {
                const dataArray = Array.isArray(res.data) ? res.data : Object.values(res.data)
                setCommentsORG(dataArray)
                localStorage.setItem('tiktok_CommentsORG', JSON.stringify(dataArray))
            } else if (res.data === null) {
                setCommentsORG([])
                localStorage.setItem('tiktok_CommentsORG', '[]')
            } else {
                const stored = JSON.parse(localStorage.getItem('tiktok_CommentsORG') || '[]')
                setCommentsORG(stored)
            }
        } catch (e) {
            const stored = JSON.parse(localStorage.getItem('tiktok_CommentsORG') || '[]')
            setCommentsORG(stored)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCommentsORG()

        // Real-vaqtda sinxronlash (har 30 soniyada)
        const interval = setInterval(() => {
            loadCommentsORG()
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    const handleAddComment = async (e) => {
        e.preventDefault()

        const finalName = "O'quvchi"

        if (!text.trim()) {
            toast.error(t('studentCommentsORG.fillError', "Iltimos, izohni to'liq kiriting!"))
            return
        }

        setSubmitting(true)
        const formattedUsername = finalName.startsWith('@')
            ? finalName
            : `@${finalName.toLowerCase().replace(/\s+/g, '_')}`

        const displayName = finalName.replace(/^@/, '')

        const newComment = {
            id: Date.now(),
            text: text.trim(),
            date: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) + ' · Bugun',
            replies: []
        }

        let updatedList;
        if (replyingTo) {
            updatedList = CommentsORG.map(c => {
                if (c.id === replyingTo) {
                    return { ...c, replies: [...(c.replies || []), newComment] }
                }
                return c
            })
        } else {
            updatedList = [newComment, ...CommentsORG]
        }

        setCommentsORG(updatedList)
        localStorage.setItem('tiktok_CommentsORG', JSON.stringify(updatedList))
        setText('')
        if (replyingTo) {
            setExpandedReplies(prev => ({ ...prev, [replyingTo]: true }))
        }
        setReplyingTo(null)

        try {
            await axios.put(API_URL, updatedList)
            toast.success(t('studentCommentsORG.addSuccess', "Izohingiz qo'shildi!"))
        } catch (err) {
            console.error(err)
        } finally {
            setSubmitting(false)
        }
    }

    const toggleLike = async (id) => {
        const updatedList = CommentsORG.map(item => {
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

        setCommentsORG(updatedList)
        localStorage.setItem('tiktok_CommentsORG', JSON.stringify(updatedList))

        try {
            await axios.put(API_URL, updatedList)
        } catch (e) {
            console.error(e)
        }
    }

    const handleDeleteComment = async (id) => {
        const updatedList = CommentsORG.filter(item => item.id !== id)
        setCommentsORG(updatedList)
        localStorage.setItem('tiktok_CommentsORG', JSON.stringify(updatedList))

        try {
            await axios.put(API_URL, updatedList)
            toast.success(t('studentCommentsORG.deleteSuccess', "Izoh o'chirildi!"))
        } catch (e) {
            console.error(e)
        }
    }

    const handleDeleteReply = async (commentId, replyId) => {
        const updatedList = CommentsORG.map(c => {
            if (c.id === commentId) {
                return { ...c, replies: (c.replies || []).filter(r => r.id !== replyId) }
            }
            return c
        })
        setCommentsORG(updatedList)
        localStorage.setItem('tiktok_CommentsORG', JSON.stringify(updatedList))
        try {
            await axios.put(API_URL, updatedList)
            toast.success(t('studentCommentsORG.deleteSuccess', "Izoh o'chirildi!"))
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
                    <span>{t('studentCommentsORG.viewAndLeaveBtn', "Izohlarni ko'rish va qoldirish")}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-mono font-bold">
                        {CommentsORG.length}
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
                            {t('studentCommentsORG.title', "O'quvchilar Izohlari va Natijalari")}
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                            {t('studentCommentsORG.subtitle', "O'quvchilar izohlari ({{count}} ta izoh)", { count: CommentsORG.length })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={loadCommentsORG}
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

            {/* CommentsORG Scrollable List */}
            <div className="bg-white/60 dark:bg-gray-950/60 backdrop-blur-xl border-x border-gray-200 dark:border-gray-800 max-h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4 divide-y divide-gray-100 dark:divide-gray-800/60">
                {CommentsORG.length === 0 ? (
                    <div className="py-12 text-center space-y-3">
                        <FaCommentDots className="text-4xl animate-bounce text-gray-400 mx-auto" />
                        <h4 className="text-base font-bold text-gray-700 dark:text-gray-300">
                            {t('studentCommentsORG.noCommentsORG', "Hozircha izohlar yo'q")}
                        </h4>
                        <p className="text-xs text-gray-500">
                            {t('studentCommentsORG.beFirst', "Birinchi bo'lib o'z izohingizni qoldiring!")}
                        </p>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {CommentsORG.map((comment) => (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                                className="pt-4 first:pt-0 flex items-start justify-between gap-3 group"
                            >
                                <div className="flex-1 min-w-0 space-y-1">
                                    <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 leading-relaxed break-words">
                                        {comment.text}
                                    </p>

                                    <div className="flex items-center gap-4 text-[11px] font-semibold text-gray-400 pt-0.5">
                                        <span>{comment.date || t('studentCommentsORG.justNow')}</span>
                                        <button
                                            type="button"
                                            onClick={() => { setReplyingTo(comment.id); document.getElementById('comment-input')?.focus(); }}
                                            className="hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer transition-colors"
                                        >
                                            {t('studentCommentsORG.reply')}
                                        </button>
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                            >
                                                <FaTrash className="text-[10px]" />
                                                <span>{t('studentCommentsORG.deleteBtn')}</span>
                                            </button>
                                        )}
                                    </div>
                                    
                                    
                                    {comment.replies && comment.replies.length > 0 && (
                                        <div className="mt-2">
                                            <button
                                                onClick={() => setExpandedReplies(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                                                className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                            >
                                                <span className="w-6 h-[1px] bg-gray-300 dark:bg-gray-700 inline-block"></span>
                                                {expandedReplies[comment.id] 
                                                    ? t('studentCommentsORG.closeReplies')
                                                    : `${comment.replies.length} ${t('studentCommentsORG.viewReplies')}`
                                                }
                                                {expandedReplies[comment.id] ? <FaChevronUp className="text-[9px]" /> : <FaChevronDown className="text-[9px]" />}
                                            </button>

                                            <AnimatePresence>
                                                {expandedReplies[comment.id] && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="space-y-3 border-l-2 border-gray-200 dark:border-gray-800 pl-3 mt-3 overflow-hidden"
                                                    >
                                                        {comment.replies.map(reply => (
                                                            <div key={reply.id} className="pt-2 first:pt-0">
                                                                <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 leading-relaxed break-words">
                                                                    {reply.text}
                                                                </p>
                                                                <div className="flex items-center gap-4 text-[10px] font-semibold text-gray-400 pt-1">
                                                                    <span>{reply.date || t('studentCommentsORG.justNow')}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => { setReplyingTo(comment.id); document.getElementById('comment-input')?.focus(); }}
                                                                        className="hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer transition-colors"
                                                                    >
                                                                        {t('studentCommentsORG.reply')}
                                                                    </button>
                                                                    {isAdmin && (
                                                                        <button
                                                                            onClick={() => handleDeleteReply(comment.id, reply.id)}
                                                                            className="text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                                                        >
                                                                            <FaTrash className="text-[9px]" />
                                                                            <span>{t('studentCommentsORG.deleteBtn')}</span>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}
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
                {replyingTo && (
                    <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-2"><FaCommentDots className="text-gray-400" /> {t('studentCommentsORG.replying')}</span>
                        <button type="button" onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer p-1">
                            <FaTimes />
                        </button>
                    </div>
                )}

                <div className="relative flex items-center">
                    <input
                        type="text"
                        id="comment-input"
                        placeholder={t('studentCommentsORG.textPlaceholder', "Izohingizni yozing...")}
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
