import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast';

export default function AddComment({ getdata, setAddModal, editId }) {
    const { t } = useTranslation()
    const [imageUrl, setImageUrl] = useState('')
    const [title, setTitle] = useState('')
    const [achievement, setAchievement] = useState('')

    const getDetailData = async function () {
        try {
            if (!editId) return;
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
            };

            if (editId) {
                await axios.put(`https://project-3gpc.onrender.com/products/${editId}`, payload);
                toast.success(t('addComment.editSuccess'));
            } else {
                await axios.post('https://project-3gpc.onrender.com/products', payload);
                toast.success(t('addComment.addSuccess'));
            }

            getdata();
            setAddModal(false);
        } catch (e) {
            console.log(e)
            toast.error(t('addComment.errorOccurred'));
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm transition-opacity duration-300">
            {/* Modal oynaning o'zi */}
            <div className="relative w-full max-w-lg p-6 sm:p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl transform transition-all">

                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight pr-8">
                    {editId ? t('addComment.editTitle') : t('addComment.addTitle')}
                </h2>

                <button
                    onClick={() => setAddModal(false)}
                    className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors text-xl leading-none cursor-pointer"
                >
                    &times;
                </button>

                <div className="space-y-5">
                    <div>
                        <label className="block text-[11px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            {t('addComment.imageLabel')}
                        </label>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder={t('addComment.imagePlaceholder')}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:border-red-500 dark:focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all text-sm sm:text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            {t('addComment.nameLabel')}
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={t('addComment.namePlaceholder')}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:border-red-500 dark:focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all text-sm sm:text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            {t('addComment.achievementLabel')}
                        </label>
                        <input
                            type="text"
                            value={achievement}
                            onChange={(e) => setAchievement(e.target.value)}
                            placeholder={t('addComment.achievementPlaceholder')}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:border-red-500 dark:focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all text-sm sm:text-base"
                        />
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 mt-8">
                    <button
                        onClick={() => setAddModal(false)}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold text-sm sm:text-base transition-colors cursor-pointer active:scale-95"
                    >
                        {t('addComment.cancelBtn')}
                    </button>
                    <button
                        onClick={PostData}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-red-500/30 transition-colors cursor-pointer active:scale-95"
                    >
                        {editId ? t('addComment.saveBtn') : t('addComment.addBtn')}
                    </button>
                </div>

            </div>
        </div>
    )
}