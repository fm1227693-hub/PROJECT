import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

export default function AddComment({ getdata, setAddModal, editId }) {
    const [imageUrl, setImageUrl] = useState('')
    const [title, setTitle] = useState('')
    const [achievement, setAchievement] = useState('')

    const getDetailData = async function () {
        try {
            if (!editId) return;
            const res = await axios.get(`http://localhost:3001/products/${editId}`)
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
                await axios.put(`http://localhost:3001/products/${editId}`, payload);
                toast.success('Muvaffaqiyatli tahrirlandi');
            } else {
                await axios.post('http://localhost:3001/products', payload);
                toast.success('Muvaffaqiyatli qo\'shildi');
            }

            getdata();
            setAddModal(false);
        } catch (e) {
            console.log(e)
            toast.error('Xatolik yuz berdi');
        }
    }

    return (
        <div className='fixed left-0 top-0 bg-black/50 backdrop-blur-sm h-screen w-full flex items-center justify-center z-50 p-4'>
            <div className="max-w-lg w-full p-5 sm:p-6 rounded-3xl dark:bg-gray-900 bg-white shadow-2xl relative animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-800">
                <h2 className='text-xl sm:text-2xl dark:text-white mb-4 sm:mb-5 font-black text-gray-900'>
                    {editId ? 'O\'quvchini tahrirlash' : 'Yangi o\'quvchi qo\'shish'}
                </h2>
                <button onClick={() => setAddModal(false)} className='absolute w-8 h-8 sm:w-9 sm:h-9 top-3.5 right-3.5 sm:top-4 sm:right-4 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white transition-colors flex items-center justify-center text-xl sm:text-2xl leading-none'>&times;</button>

                <div className="mb-3.5 sm:mb-4">
                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">Rasm tanlash</label>
                    <label className="flex items-center w-full border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl text-sm sm:text-base text-gray-400 dark:text-gray-500 cursor-pointer hover:border-red-500 transition-colors">
                        <span>{imageUrl ? "Rasm tanlandi" : "Faylni tanlang..."}</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files[0] && setImageUrl(URL.createObjectURL(e.target.files[0]))}
                            className="hidden"
                        />
                    </label>
                </div>

                <div className="mb-3.5 sm:mb-4">
                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">O'quvchining ismi</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Masalan: Alisher Vahobov'
                        className='w-full border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 focus:border-red-500 focus:outline-none px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl text-sm sm:text-base text-gray-700 dark:text-gray-200 placeholder-gray-400 transition-colors'
                    />
                </div>

                <div className="mb-3.5 sm:mb-4">
                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">Erishgan yutug'i</label>
                    <input
                        type="text"
                        value={achievement}
                        onChange={(e) => setAchievement(e.target.value)}
                        placeholder='Masalan: IELTS 8.0 / CEFR B2'
                        className='w-full border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 focus:border-red-500 focus:outline-none px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl text-sm sm:text-base text-gray-700 dark:text-gray-200 placeholder-gray-400 transition-colors'
                    />
                </div>

                <div className="flex justify-end w-full mt-6 gap-2.5 sm:gap-3">
                    <button onClick={() => setAddModal(false)} className='px-4 sm:px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-semibold cursor-pointer'>Bekor qilish</button>
                    <button onClick={PostData} className='px-5 sm:px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-sm sm:text-base text-white transition-colors font-bold cursor-pointer shadow-lg shadow-red-500/20'>{editId ? 'Saqlash' : 'Qo\'shish'}</button>
                </div>
            </div>
        </div>
    )
}