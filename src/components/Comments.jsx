import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AddComment from './AddComment'
import toast, { Toaster } from 'react-hot-toast'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Comments() {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const [addModal, setAddModal] = useState(false)
    const [editId, setEditId] = useState(false)

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 100,
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
        <div className="pt-20 w-full">
            <div
                data-aos="fade-down"
                data-aos-duration="600"
                className="flex justify-center text-3xl sm:text-5xl mb-8"
            >
                <h1 className="dark:text-white font-black tracking-tight">{t('comments.title')}</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto p-4 sm:p-6">
                {
                    data.filter(co => co.title).map((co, index) => {
                        return (
                            <div
                                key={co.id}
                                data-aos="fade-up"
                                data-aos-duration="800"
                                data-aos-delay={index * 100}
                                className="flex justify-center w-full"
                            >
                                <div className="flex items-center flex-col text-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 w-full p-6 justify-between group">
                                    <div className="w-full mb-4">
                                        <img src={co.image} alt={co.title} className="w-full h-44 object-cover rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-500" />
                                        <b className="text-gray-900 dark:text-white flex items-center justify-center line-clamp-1 text-base md:text-lg font-bold">
                                            {co.title}
                                        </b>
                                    </div>
                                    <div className="flex justify-between gap-x-3 w-full pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <button
                                            onClick={() => DeleteData(co.id)}
                                            className="px-4 py-2 text-xs font-bold border border-rose-300 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer w-full"
                                        >
                                            {t('comments.deleteBtn')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setAddModal(true)
                                                setEditId(co.id)
                                            }}
                                            className="px-4 py-2 text-xs font-bold border border-blue-300 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors cursor-pointer w-full"
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

            <button
                data-aos="zoom-in"
                data-aos-duration="600"
                onClick={() => {
                    setAddModal(true)
                    setEditId(false)
                }}
                className="dark:bg-white bg-gray-900 dark:text-gray-950 text-white w-14 h-14 text-center border-0 rounded-full text-3xl mx-auto mt-8 flex items-center justify-center hover:scale-110 shadow-xl transition-all cursor-pointer"
                title={t('comments.addBtnTitle')}
            >
                +
            </button>

            {
                addModal && <AddComment getdata={GetData} setAddModal={setAddModal} editId={editId} />
            }
            <Toaster />
        </div>
    )
}