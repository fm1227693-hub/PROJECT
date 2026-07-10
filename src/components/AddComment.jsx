import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

export default function AddComment({ getdata, setAddModal, editId }) {
    // Ikkita alohida state (biri rasm url, ikkinchisi title uchun)
    const [imageUrl, setImageUrl] = useState('')
    const [title, setTitle] = useState('')

    const getDetailData = async function () {
        try {
            if (!editId) return;
            const res = await axios.get(`http://localhost:3000/products/${editId}`)
            setImageUrl(res.data.image || '')
            setTitle(res.data.title || '')
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getDetailData()
    }, [editId])

    const PostData = async function () {
        try {
            const payload = { image: imageUrl, title: title };

            if (editId) {
                await axios.put(`http://localhost:3000/products/${editId}`, payload);
                toast.success('Muvaffaqiyatli tahrirlandi');
            } else {
                await axios.post('http://localhost:3000/products', payload);
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
        <div className='fixed left-0 top-0  bg-black/50 backdrop-blur-sm h-screen w-full flex items-center justify-center z-50'>
            <div className="max-w-lg w-full mx-4 p-6 rounded-2xl dark:bg-gray-900 bg-white shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <h2 className='text-2xl dark:text-white mb-5 font-bold text-gray-800'>{editId ? 'Edit' : 'Add'} Product</h2>
                <button onClick={() => setAddModal(false)} className='absolute w-9 h-9 top-4 right-4 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors flex items-center justify-center text-2xl leading-none'>&times;</button>

                {/* Rasm URL uchun input */}
                <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder='Write your url here'
                    className='w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-gray-500 focus:outline-none px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 placeholder-gray-400 mb-4 transition-colors'
                />

                {/* Title uchun textarea */}
                <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Write your product title here...'
                    className='w-full border border-gray-300 dark:border-gray-700 bg-white  dark:bg-gray-900 focus:border-gray-500 focus:outline-none px-4 py-3 rounded-xl h-32 resize-none text-gray-700 dark:text-gray-200 placeholder-gray-400 transition-colors'>
                </textarea>

                <div className="flex justify-end w-full mt-5 gap-3">
                    <button onClick={() => setAddModal(false)} className='px-5 py-2 rounded-xl border border-gray-300 text-gray-600 dark:text-white hover:bg-gray-700 transition-colors'>Cancel</button>
                    <button onClick={PostData} className='px-5 py-2 rounded-xl bg-gray-900 text-white  border-gray-300 hover:bg-gray-700 transition-colors font-medium'>{editId ? 'Edit' : 'Add'}</button>
                </div>
            </div>
        </div>
    )
}