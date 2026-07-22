import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AddComment from './AddComment'
import toast, { Toaster } from 'react-hot-toast'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { FaArrowLeft } from 'react-icons/fa'
import axios from 'axios'

export default function Comments() {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const [addModal, setAddModal] = useState(false)
    const [editId, setEditId] = useState(false)

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 80,
        })
    }, [])

    const GetData = async function () {
        try {
            const res = await axios.get('https://project-3gpc.onrender.com/products')
            setData(res.data)
        } catch (e) {
            console.log(e)
        }
    }

    const DeleteData = async function (id) {
        if (!id) return false
        try {
            await axios.delete(`https://project-3gpc.onrender.com/products/${id}`)
            toast.success(t('comments.deleteSuccess'))
            GetData()
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        GetData()
    }, [addModal])

    return (
        <div className="pt-24 sm:pt-28 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative min-h-screen pb-16">
            
            {/* 100% ishlaydigan orqaga qaytish tugmasi */}
            <div className="max-w-5xl mx-auto mb-6 flex justify-start">
                <button
                    onClick={() => {
                        // Agar oldingi sahifaga qaytish kerak bo'lsa: window.history.back()
                        // Aniq /enter sahifasiga o'tishi shart bo'lsa: window.location.href = '/enter'
                        window.location.href = '/enter'
                    }} 
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer z-50 relative"
                >
                    <FaArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('Orqaga')}</span>
                </button>
            </div>

            <div
                data-aos="fade-down"
                data-aos-duration="600"
                className="flex justify-center text-2xl sm:text-4xl lg:text-5xl mb-8 sm:mb-12 text-center"
            >
                <h1 className="text-gray-900 dark:text-white font-black tracking-tight">{t('comments.title')}</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {
                    data.filter(co => co.title).map((co, index) => {
                        return (
                            <div
                                key={co.id}
                                data-aos="fade-up"
                                data-aos-duration="800"
                                data-aos-delay={index * 50}
                                className="flex justify-center w-full"
                            >
                                <div className="flex items-center flex-col text-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 w-full p-5 sm:p-6 justify-between group">
                                    <div className="w-full mb-4">
                                        <div className="w-full h-40 sm:h-44 rounded-xl sm:rounded-2xl overflow-hidden mb-4 border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-950">
                                            <img
                                                src={co.image}
                                                alt={co.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <b className="text-gray-900 dark:text-white flex items-center justify-center line-clamp-1 text-sm sm:text-base font-bold">
                                            {co.title}
                                        </b>
                                    </div>
                                    <div className="flex justify-between gap-x-3 w-full pt-4 border-t border-gray-200 dark:border-gray-800">
                                        <button
                                            onClick={() => DeleteData(co.id)}
                                            className="px-3 sm:px-4 py-2 text-xs font-bold border border-rose-300 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer w-full active:scale-95"
                                        >
                                            {t('comments.deleteBtn')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setAddModal(true)
                                                setEditId(co.id)
                                            }}
                                            className="px-3 sm:px-4 py-2 text-xs font-bold border border-blue-300 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors cursor-pointer w-full active:scale-95"
                                        >
                                            {t('comments.editBtn')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <div className="flex justify-center mt-10">
                <button
                    data-aos="zoom-in"
                    data-aos-duration="600"
                    onClick={() => {
                        setAddModal(true)
                        setEditId(false)
                    }}
                    className="bg-gray-900 dark:bg-white text-white dark:text-gray-950 w-14 h-14 text-center border-0 rounded-full text-3xl flex items-center justify-center hover:scale-110 shadow-xl transition-all cursor-pointer active:scale-95"
                    title={t('comments.addBtnTitle')}
                >
                    +
                </button>
            </div>

            {
                addModal && <AddComment getdata={GetData} setAddModal={setAddModal} editId={editId} />
            }
            <Toaster />
        </div>
    )
}