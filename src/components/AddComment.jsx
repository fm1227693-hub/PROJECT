import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';

export default function AddComment({ setAddModal, editId }) {

    const [comment, setComment] = useState('')


    const getDetailData = async function () {
        try {
            const res = await axios.get(`http://localhost:3000/products/${editId}`)
            setComment(res.data.text || '')
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getDetailData()
    }, [editId])

    const PostData = async function () {
        try {
            if (editId) {
                await axios.put(`http://localhost:3000/products/${editId}`, {
                    title: comment
                });
            } else {
                await axios.post('http://localhost:3000/products', {
                    title: comment
                });
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className='fixed left-0 top-0 bg-black/50 backdrop-blur-sm h-screen w-full flex items-center justify-center z-50'>
            <div className="max-w-lg w-full mx-4 p-6 rounded-2xl bg-white shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <h2 className='text-2xl mb-5 font-bold text-gray-800'>{editId ? 'Edit' : 'Add'} Comment</h2>
                <button onClick={() => setAddModal(false)} className='absolute w-9 h-9 top-4 right-4 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors flex items-center justify-center text-2xl leading-none'>&times;</button>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)} placeholder='Write your comment here...' className='w-full border border-gray-300 focus:border-gray-500 focus:outline-none px-4 py-3 rounded-xl h-40 resize-none text-gray-700 placeholder-gray-400 transition-colors'></textarea>
                <div className="flex justify-end w-full mt-5 gap-3">
                    <button onClick={() => setAddModal(false)} className='px-5 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors'>Cancel</button>
                    <button onClick={() => PostData()} className='px-5 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors font-medium'>{editId ? 'Edit' : 'Add'}</button>
                </div>
            </div>
            <Toaster />
        </div>
    )
}
