import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'

export default function Sec3() {
     const [data, setData] = useState([])
    const [addModal, setAddModal] = useState(false)

    const GetData = async function () {
        try {
            const res = await axios.get('http://localhost:3000/products')
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
            <div className="max-w-5xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Mahsulotlar ro'yxati</h2>
                </div>

                {data && data.length > 0 ? (
                    data.map((item) => (
                        <div key={item.id} className="p-4 mb-3 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800 flex justify-between items-center transition-colors">
                           <img src={item.image} alt="" />
                            <span className="font-medium text-gray-800 dark:text-gray-200">{item.title}</span>
                           
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 dark:text-gray-500 text-center py-6">Hozircha mahsulotlar yo'q</p>
                )}
            </div>

            {addModal && <AddComment getdata={GetData} setAddModal={setAddModal} editId={editId} />}
            <Toaster  />
        </div>
    )
}
