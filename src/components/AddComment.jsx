import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

export default function AddComment({ getdata, setAddModal, editId }) {
    const { t } = useTranslation()
    const [imageUrl, setImageUrl] = useState('')
    const [title, setTitle] = useState('')
    const [achievement, setAchievement] = useState('')

    const getDetailData = async function () {
        try {
            if (!editId) return
            const res = await axios.get(`https://project-3gpc.onrender.com/products/${editId}`)
            setImageUrl(res.data.image || '')
            setTitle(res.data.title || '')
            setAchievement(res.data.achievement || '')
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getDetailData()
    }, [editId])

    const PostData = async function () {
        try {
            const payload = {
                image: imageUrl,
                title: title,
                achievement: achievement || "IELTS 7.5 / Yuqori natija"
            }

            if (editId) {
                await axios.put(`https://project-3gpc.onrender.com/products/${editId}`, payload)
                toast.success(t('addComment.editSuccess', "Muvaffaqiyatli tahrirlandi!"))
            } else {
                await axios.post('https://project-3gpc.onrender.com/products', payload)
                toast.success(t('addComment.addSuccess', "Muvaffaqiyatli qo'shildi!"))
            }

            getdata()
            setAddModal(false)
        } catch (e) {
            console.log(e)
            toast.error(t('addComment.errorOccurred', "Xatolik yuz berdi!"))
        }
    }

    return (
        <div
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/70 backdrop-blur-md transition-opacity duration-300"
        >
            {/* Modal oynaning o'zi */}
            <div className="relative w-full max-w-lg p-6 sm:p-8 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800/80 rounded-3xl shadow-2xl transform transition-all">

                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight pr-8">
                    {editId ? t('addComment.editTitle', "Ma'lumotni tahrirlash") : t('addComment.addTitle', "Yangi qo'shish")}
                </h2>

                <button
                    onClick={() => setAddModal(false)}
                    className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors text-xl leading-none cursor-pointer active:scale-95"
                >
                    &times;
                </button>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[11px] sm:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                            {t('addComment.imageLabel', "Rasm havolasi (URL)")}
                        </label>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder={t('addComment.imagePlaceholder', "Rasm havolasini kiriting...")}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-xs sm:text-sm font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] sm:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                            {t('addComment.nameLabel', "Sarlavha / Ism")}
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={t('addComment.namePlaceholder', "Sarlavhani kiriting...")}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-xs sm:text-sm font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] sm:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                            {t('addComment.achievementLabel', "Natija / Izoh")}
                        </label>
                        <input
                            type="text"
                            value={achievement}
                            onChange={(e) => setAchievement(e.target.value)}
                            placeholder={t('addComment.achievementPlaceholder', "Natijani kiriting...")}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-xs sm:text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 mt-8">
                    <button
                        onClick={() => setAddModal(false)}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer active:scale-95"
                    >
                        {t('addComment.cancelBtn', "Bekor qilish")}
                    </button>
                    <button
                        onClick={PostData}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-500/30 transition-all cursor-pointer active:scale-95"
                    >
                        {editId ? t('addComment.saveBtn', "Saqlash") : t('addComment.addBtn', "Qo'shish")}
                    </button>
                </div>

            </div>
        </div>
    )
}