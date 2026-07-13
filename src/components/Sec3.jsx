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

    {addModal && <AddComment getdata={GetData} setAddModal={setAddModal} editId={editId} />}
    <Toaster />
</div>
    )
}
