import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AddComment from './AddComment'
// ⬇️ TUZATISH 1: ikkita turli kutubxonadan import qilingan edi (react-toastify + react-hot-toast)
// Faqat react-hot-toast qoldirildi, ikkalasi ham shu yerdan olinadi
import toast, { Toaster } from 'react-hot-toast'

export default function Comments(setComment) {

    const [data, setData] = useState([])
    const [addModal, setAddModal] = useState(false)
    const [editId, setEditId] = useState(false)

    const GetData = async function () {
        try {
            const res = await axios.get('http://localhost:3000/products')
            console.log(res)
            setData(res.data)
        } catch (e) {
            console.log(e)
        }
    }
    const DeleteData = async function (id) {
        if (!id) return false
        try {
            await axios.delete(`http://localhost:3000/products/${id}`)
            toast.success('Muvaffaqqiyatli ochirildi')
            GetData()
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        GetData()
    }, [addModal])

    return (
        <div className=''>
            <div className="flex justify-center text-6xl mb-5">
                <h1 className='dark:text-white'>Add Product</h1>
            </div>
            <div className="text-center gap-6 max-w-5xl mx-auto p-6">
                {
                    data.filter(co => co.title).map((co, i) => {
                        return (
                            // ⬇️ TUZATISH 2: key shu yerga (tashqi divga) ko'chirildi
                            // Chunki React key'ni map qaytargan ENG TASHQI elementdan qidiradi
                            <div key={co.id} className="flex justify-center">
                                <div className="">
                                    <div className="flex items-center flex-col text-center mb-5 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow w-100 duration-300 p-4 border justify-between border-gray-100">
                                        <div className="">
                                            <img src={co.image} alt="" />
                                            <b className="text-gray-800 flex items-start line-clamp-1 text-sm md:text-base ">
                                                {co.title}
                                            </b>
                                        </div>
                                        <div className="flex justify-between gap-x-3">
                                            <button onClick={() => DeleteData(co.id)} className="px-2 border rounded">delete</button>
                                            <button onClick={() => {
                                                setAddModal(true)
                                                setEditId(co.id)
                                            }} className="px-2 border rounded">edit</button>
                                        </div>
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
                className="dark:bg-white w-40 text-center py-1 border rounded text-xl mx-auto mt-5 flex justify-center"
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