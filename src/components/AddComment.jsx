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
        <div className='fixed left-0 top-0 bg-black/60 backdrop-blur-md h-screen w-full flex items-center justify-center z-50 p-4 transition-opacity duration-300'>
            {/* Modal oynaning o'zi (Scale va Fade animatsiyasi bilan) */}
            <div className="max-w-lg w-full p-6 sm:p-8 rounded-3xl dark:bg-gray-900 bg-white shadow-2xl relative transform transition-all animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">

                <h2 className='text-xl sm:text-2xl dark:text-white mb-5 font-black text-gray-950 tracking-tight'>
                    {editId ? t('addComment.editTitle') : t('addComment.addTitle')}
                </h2>

                <button
                    onClick={() => setAddModal(false)}
                    className='absolute w-9 h-9 top-4 right-4 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white transition-colors flex items-center justify-center text-2xl leading-none cursor-pointer'
                >
                    &times;
                </button>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
                            {t('addComment.imageLabel')}
                        </label>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder={t('addComment.imagePlaceholder')}
                            className='w-full border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 focus:border-red-500 dark:focus:border-red-500 focus:outline-none px-4 py-3 rounded-xl text-sm sm:text-base text-gray-800 dark:text-gray-200 placeholder-gray-400 transition-colors'
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
                            {t('addComment.nameLabel')}
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={t('addComment.namePlaceholder')}
                            className='w-full border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 focus:border-red-500 dark:focus:border-red-500 focus:outline-none px-4 py-3 rounded-xl text-sm sm:text-base text-gray-800 dark:text-gray-200 placeholder-gray-400 transition-colors'
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
                            {t('addComment.achievementLabel')}
                        </label>
                        <input
                            type="text"
                            value={achievement}
                            onChange={(e) => setAchievement(e.target.value)}
                            placeholder={t('addComment.achievementPlaceholder')}
                            className='w-full border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 focus:border-red-500 dark:focus:border-red-500 focus:outline-none px-4 py-3 rounded-xl text-sm sm:text-base text-gray-800 dark:text-gray-200 placeholder-gray-400 transition-colors'
                        />
                    </div>
                </div>

                <div className="flex justify-end w-full mt-6 gap-3">
                    <button
                        onClick={() => setAddModal(false)}
                        className='px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-semibold cursor-pointer'
                    >
                        {t('addComment.cancelBtn')}
                    </button>
                    <button
                        onClick={PostData}
                        className='px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-sm sm:text-base text-white transition-colors font-bold cursor-pointer shadow-lg shadow-red-500/20'
                    >
                        {editId ? t('addComment.saveBtn') : t('addComment.addBtn')}
                    </button>
                </div>
            </div>
        </div>
    )
}