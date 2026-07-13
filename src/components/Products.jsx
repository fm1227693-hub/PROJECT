import React, { useEffect, useState } from "react"
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

export default function Products() {
    const [data, setData] = useState([])

    const GetData = async function () {
        try {
            const res = await axios.get('https://project-3gpc.onrender.com/products')
            console.log(res)
            setData(res.data)
        } catch (e) {
            console.log(e)
            toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi!")
        }
    }

    useEffect(() => {
        GetData()
    }, [])

    return (
        <div className="max-w-7xl w-full mx-auto px-6 lg:px-8 pt-20 mb-20 select-none font-sans transition-colors duration-200 bg-gray-50 dark:bg-gray-950 min-h-screen">
            <div className="max-w-6xl mx-auto">
                
                <div className="mb-10 border-b border-gray-200 dark:border-gray-800 pb-5">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-full">
                        Muvaffaqiyat
                    </span>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-3 tracking-tight">
                        Yutuqqa erishgan o'quvchilarimiz
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data && data.length > 0 ? (
                        data.map((item) => (
                            <div key={item.id} className="group bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800/80 flex flex-col justify-between transition-all duration-300">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-full h-48 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 mb-4 group-hover:scale-105 transition-transform duration-500">
                                        <img className="w-full h-full object-cover" src={item.image} alt={item.title} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-4">
                                        {item.achievement || "IELTS 7.5 / Yuqori natija"}
                                    </p>
                                </div>
                                <div className="flex items-center justify-center pt-4 mt-auto border-t border-gray-50 dark:border-gray-800/60">
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-3 py-1.5 rounded-lg w-full text-center">
                                        Sertifikat olgan
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                            <p className="text-gray-400 dark:text-gray-500 font-medium">Hozircha o'quvchilar natijalari yuklanmagan</p>
                        </div>
                    )}
                </div>
            </div>

            <Toaster position="bottom-right" />
        </div>
    )
}