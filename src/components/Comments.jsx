import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AddComment from './AddComment'
import toast, { Toaster } from 'react-hot-toast'

export default function Comments() {
    const [data, setData] = useState([])
    const [addModal, setAddModal] = useState(false)
    const [editId, setEditId] = useState(false)

    const GetData = async function () {
        try {
            const res = await axios.get('http://localhost:3001/products')
            setData(res.data)
        } catch (e) {
            console.log(e)
        }
    }

    const DeleteData = async function (id) {
        if (!id) return false
        try {
            await axios.delete(`http://localhost:3001/products/${id}`)
            toast.success('Muvaffaqiyatli o`chirildi')
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
    <div className="flex justify-center text-3xl sm:text-5xl mb-6">
        <h1 className="dark:text-white font-extrabold tracking-tight">Kurslarni boshqarish</h1>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto p-4 sm:p-6">
        {
            data.filter(co => co.title).map((co) => {
                return (
                    <div key={co.id} className="flex justify-center w-full">
                        <div className="flex items-center flex-col text-center mb-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow w-full duration-300 p-4 justify-between">
                            <div className="w-full mb-4">
                                <img src={co.image} alt={co.title} className="w-full h-40 object-cover rounded-xl mb-3" />
                                <b className="text-gray-800 dark:text-gray-100 flex items-start line-clamp-1 text-sm md:text-base font-semibold">
                                    {co.title}
                                </b>
                            </div>
                            <div className="flex justify-between gap-x-3 w-full pt-3 border-t border-gray-100 dark:border-gray-800">
                                <button 
                                    onClick={() => DeleteData(co.id)} 
                                    className="px-3 py-1.5 text-xs font-medium border border-rose-300 text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
                                >
                                    O'chirish
                                </button>
                                <button 
                                    onClick={() => {
                                        setAddModal(true)
                                        setEditId(co.id)
                                    }} 
                                    className="px-3 py-1.5 text-xs font-medium border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition"
                                >
                                    Tahrirlash
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })
        }
    </div>

    <button
        onClick={() => {
            setAddModal(true)
            setEditId(false)
        }}
        className="dark:bg-white bg-gray-900 dark:text-gray-950 text-white w-12 h-12 text-center border rounded-full text-2xl mx-auto mt-5 flex items-center justify-center hover:opacity-95 shadow-md transition"
        title="Yangi kurs qo'shish"
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