import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export default function Sec3() {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const [addModal, setAddModal] = useState(false)
    const [modal, setModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

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

    // Rasmlar yo'li Vercel'da ishlashi uchun to'g'irlandi (boshidagi "public/" olib tashlandi)
    const students = [
        {
            id: 1,
            name: "Javohir",
            age: 17,
            startingLevel: "Pre-Intermediate",
            prepTime: "6 months",
            teacher: "Mehrangiz",
            obs: "7.5",
            image: "/photo_2026-07-14_23-35-27.jpg"
        },
        {
            id: 2,
            name: "Zayniddinov Jahongir",
            age: 14,
            startingLevel: "Starter",
            prepTime: "13 months",
            teacher: "Ruhillo Asrorov",
            obs: "7.0",
            image: "/photo_2026-07-14_23-35-01.jpg"
        },
        {
            id: 3,
            name: "Umidova Mehrangiz",
            age: 15,
            startingLevel: "Beginner",
            prepTime: "9 months",
            teacher: "Ruhillo Asrorov",
            obs: "7.0",
            image: "/photo_2026-07-14_23-35-06.jpg"
        }
    ];

    return (
        <div className="max-w-7xl w-full mx-auto px-6 lg:px-8 pt-24 mb-24 select-none font-sans transition-colors duration-200 bg-gray-50 dark:bg-gray-950 min-h-screen">
            <div className="max-w-5xl mx-auto p-4 sm:p-6">
                <div className="flex justify-between items-center mb-8 border-b border-gray-200/60 dark:border-gray-800 pb-4">
                    <div className="flex items-center gap-3">
                        <span className="w-4 h-[9px] md:w-3 md:h-3 bg-red-600 rounded-full animate-ping"></span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
                            Yuqori yutuqqa erishgan o'quvchilar
                        </h2>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full">
                        {t('students.badge')}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 dark:bg-gray-950">
                {students.map((student) => (
                    <div key={student.id} className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
                        <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img
                                src={student.image}
                                alt="Student"
                                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-5">
                            <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {student.name}
                            </h3>
                            <div className="space-y-1.5 text-sm mb-4">
                                <p className="text-gray-600 dark:text-gray-400">
                                    <span className="font-medium text-gray-900 dark:text-gray-200">{t('students.ageLabel')}:</span> {student.age}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    <span className="font-medium text-gray-900 dark:text-gray-200">{t('students.levelLabel')}:</span> {student.startingLevel}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    <span className="font-medium text-gray-900 dark:text-gray-200">{t('students.timeLabel')}:</span> {student.prepTime}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    <span className="font-medium text-gray-900 dark:text-gray-200">{t('students.teacherLabel')}:</span> {student.teacher}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">OBS: {student.obs}</p>
                                <span
                                    onClick={() => {
                                        setSelectedStudent(student);
                                        setModal(true);
                                    }}
                                    className="text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 cursor-pointer">
                                    {t('students.viewBtn')}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {modal && selectedStudent && (
                <div className="fixed inset-0 w-screen h-screen z-50 bg-white dark:bg-gray-950 flex flex-col overflow-y-auto">
                    <div className="flex justify-between items-center px-8 py-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10 shadow-sm">
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                            O'quvchi haqida to'liq ma'lumot
                        </h2>
                        <button
                            onClick={() => {
                                setModal(false);
                                setSelectedStudent(null);
                            }}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-md"
                        >
                            {t('students.closeBtn')}
                        </button>
                    </div>
                    <div className="flex-1 max-w-7xl w-full mx-auto p-8 lg:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            <div className="w-full h-96 lg:h-[500px] bg-gray-100 dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800">
                                <img
                                    src={selectedStudent.image}
                                    alt="Student"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="space-y-6">
                                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{selectedStudent.name}</h1>
                                <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300">
                                    <p className="border-b border-gray-200 dark:border-gray-800 pb-3">
                                        <strong className="text-gray-900 dark:text-white">{t('students.ageLabel')}:</strong> {selectedStudent.age}
                                    </p>
                                    <p className="border-b border-gray-200 dark:border-gray-800 pb-3">
                                        <strong className="text-gray-900 dark:text-white">{t('students.levelLabel')}:</strong> {selectedStudent.startingLevel}
                                    </p>
                                    <p className="border-b border-gray-200 dark:border-gray-800 pb-3">
                                        <strong className="text-gray-900 dark:text-white">{t('students.timeLabel')}:</strong> {selectedStudent.prepTime}
                                    </p>
                                    <p className="border-b border-gray-200 dark:border-gray-800 pb-3">
                                        <strong className="text-gray-900 dark:text-white">{t('students.teacherLabel')}:</strong> {selectedStudent.teacher}
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                                        OBS: {selectedStudent.obs}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {addModal && <AddComment getdata={GetData} setAddModal={setAddModal} editId={editId} />}
            <Toaster />
        </div>
    )
}
{/* <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
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
</div> */}
{/* <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
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
</div> */}
{/* <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
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
</div> */}
{/* <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
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
</div> */}
{/* <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
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
</div> */}
{/* <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
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
</div> */}
{/* <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
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
</div> */}
{/* <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
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
</div> */}
{/* <div className="group border dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
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
</div> */}
