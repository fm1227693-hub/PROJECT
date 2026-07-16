import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'

export default function Sec3() {
    const [data, setData] = useState([])
    const [addModal, setAddModal] = useState(false)

    const GetData = async function () {
        try {
            const res = await axios.get('https://project-3gpc.onrender.com/products')
            console.log(res)
            setData(res.data)
        } catch (e) {
            console.log(e)
        }
    }   



    useEffect(() => {
        GetData()
    }, [addModal])
    return (
        <div className="max-w-7xl w-full mx-auto px-6 lg:px-8 pt-24 mb-24 select-none font-sans transition-colors duration-200 bg-gray-50 dark:bg-gray-950 min-h-screen">
            <div className="max-w-5xl mx-auto p-4 sm:p-6">
                <div className="flex justify-between items-center mb-8 border-b border-gray-200/60 dark:border-gray-800 pb-4">
                    <div className="flex items-center gap-3">
                        <span className="w-4 h-[9px] md:w-3 md:h-3 bg-red-600 rounded-full animate-ping"></span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-955 dark:text-white tracking-tight">
                            Yutuqqa erishgan o'quvchilar
                        </h2>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full">
                        Optimum Pride
                    </span>
                </div>

                {data && data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {data.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col transition-all duration-200 hover:border-red-500/40"
                            >
                                <div className="w-full h-52 sm:h-56 relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 right-3 flex items-center justify-center px-2 py-0.5 md:px-2.5 md:py-1 bg-red-600/95 backdrop-blur-sm text-white rounded-full text-[9px] md:text-[10px] font-bold shadow-md">
                                        Yutuq
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col justify-between flex-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                        {item.subtitle || "Muvaffaqiyatli o'quvchi"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">Hozircha yutuqqa erishgan o'quvchilar qo'shilmagan</p>
                    </div>
                )}
            </div>




            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 dark:bg-gray-950">
                <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
                    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                            src="public/photo_2026-07-14_23-35-01.jpg"
                            alt="Student"
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5">
                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            Zayniddinov Jahongir
                        </h3>
                        <div className="space-y-1.5 text-sm mb-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Age:</span> 14
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Starting level:</span> Starter
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Preparation time:</span> 13 months
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Teacher:</span> Ruhillo Asrorov
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">OBS: 7.0</p>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                View →
                            </span>
                        </div>
                    </div>
                </div>
                <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
                    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                            src="public/photo_2026-07-14_23-35-06.jpg"
                            alt="Student"
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5">
                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            Umidova Mehrangiz
                        </h3>
                        <div className="space-y-1.5 text-sm mb-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Age:</span> 15
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Starting level:</span> Beginner
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Preparation time:</span> 9 months
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Teacher:</span> Ruhillo Asrorov
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">OBS: 7.0</p>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                View →
                            </span>
                        </div>
                    </div>
                </div>
                <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
                    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                            src="public/photo_2026-07-14_23-35-09.jpg"
                            alt="Student"
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5">
                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            Nozigul G'aybilloyeva
                        </h3>
                        <div className="space-y-1.5 text-sm mb-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Age:</span> 15
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Starting level:</span> Elementary
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Preparation time:</span> 7 months
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Teacher:</span> Ruhillo Asrorov
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">OBS: 7.0</p>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                View →
                            </span>
                        </div>
                    </div>
                </div>
                <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
                    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                            src="public/photo_2026-07-14_23-35-11.jpg"
                            alt="Student"
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5">
                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            Djamalova Laziza
                        </h3>
                        <div className="space-y-1.5 text-sm mb-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Age:</span> 14
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Starting level:</span> Elementary
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Preparation time:</span> 7 months
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Teacher:</span> Ruhillo Asrorov
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">OBS: 6.5</p>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                View →
                            </span>
                        </div>
                    </div>
                </div>
                <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
                    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                            src="public/photo_2026-07-14_23-35-13.jpg"
                            alt="Student"
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5">
                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            Shukhratova Mahbuba
                        </h3>
                        <div className="space-y-1.5 text-sm mb-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Age:</span> 22
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Starting level:</span> Pre-Intermediate
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Preparation time:</span> 7 months
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Teacher:</span> Ruhillo Asrorov
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">OBS: 6.5</p>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                View →
                            </span>
                        </div>
                    </div>
                </div>
                <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
                    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                            src="public/photo_2026-07-14_23-35-15.jpg"
                            alt="Student"
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5">
                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            Muradilloyeva Farida
                        </h3>
                        <div className="space-y-1.5 text-sm mb-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Age:</span> 15
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Starting level:</span> Pre-Intermediate
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Preparation time:</span> 7 months
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Teacher:</span> Ruhillo Asrorov
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">OBS: 6.0</p>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                View →
                            </span>
                        </div>
                    </div>
                </div>
                <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
                    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                            src="public/photo_2026-07-14_23-35-17.jpg"
                            alt="Student"
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5">
                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                           Dilshoda Muhammedova
                        </h3>
                        <div className="space-y-1.5 text-sm mb-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Age:</span> 16
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Starting level:</span> Pre-Intermediate
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Preparation time:</span> 7 months
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Teacher:</span> Ruhillo Asrorov
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">OBS: 6.0</p>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                View →
                            </span>
                        </div>
                    </div>
                </div>
                <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
                    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                            src="public/photo_2026-07-14_23-35-19.jpg"
                            alt="Student"
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5">
                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                           Inomjon Izomov
                        </h3>
                        <div className="space-y-1.5 text-sm mb-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Age:</span> 16
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Starting level:</span> Pre-Intermediate
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Preparation time:</span> 3 months
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Teacher:</span> Ruhillo Asrorov
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">OBS: B2</p>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                View →
                            </span>
                        </div>
                    </div>
                </div>
                <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
                    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                            src="public/photo_2026-07-14_23-35-21.jpg"
                            alt="Student"
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5">
                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            Sohibjon
                        </h3>
                        <div className="space-y-1.5 text-sm mb-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Age:</span> 15
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Starting level:</span> Elementary
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Preparation time:</span> 7 months
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Teacher:</span> Ruhillo Asrorov
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">OBS: B2</p>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                View →
                            </span>
                        </div>
                    </div>
                </div>
                <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
                    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                            src="public/photo_2026-07-14_23-35-23.jpg"
                            alt="Student"
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5">
                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            Zarnigor
                        </h3>
                        <div className="space-y-1.5 text-sm mb-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Age:</span> 15
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Starting level:</span> Elementary
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Preparation time:</span> 1 year
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Teacher:</span> Ruhillo Asrorov
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">OBS: B2</p>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                View →
                            </span>
                        </div>
                    </div>
                </div>
                <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
                    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                            src="public/photo_2026-07-14_23-35-25.jpg"
                            alt="Student"
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5">
                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            Gulnoza
                        </h3>
                        <div className="space-y-1.5 text-sm mb-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Age:</span> 35
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Starting level:</span> starter
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Preparation time:</span> 10 months
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Teacher:</span> Mehrangiz
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">OBS: B2</p>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                View →
                            </span>
                        </div>
                    </div>
                </div>
                <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
                    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                            src="public/photo_2026-07-14_23-35-27.jpg"
                            alt="Student"
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5">
                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            Javohir
                        </h3>
                        <div className="space-y-1.5 text-sm mb-4">
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Age:</span> 17
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Starting level:</span> Pre-Intermediate
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Preparation time:</span> 6 months
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-gray-200">Teacher:</span> Mehrangiz
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">OBS: 7.5  </p>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                View →
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {addModal && <AddComment getdata={GetData} setAddModal={setAddModal} editId={editId} />}
            <Toaster />
        </div>
    )
}
