import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

export default function Register() {
    const [formData, setFormData] = useState({ name: '', phone: '' })
    const [loading, setLoading] = useState(false)

    // 👇 Haqiqiy tokenni shu yerga yozing
    const BOT_TOKEN = "HAQIQIY_TOKENINGIZNI_SHU_YERGA_YOZING"
    const CHAT_ID = "6383523156"

    const handlePhoneChange = (e) => {
        const val = e.target.value
        if (/^[0-9+\s()]*$/.test(val)) {
            setFormData({ ...formData, phone: val })
        } else {
            toast.error("Faqat raqam yozing!", {
                id: 'phone-error',
                position: 'top-right',
                duration: 2000,
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (BOT_TOKEN.includes("HAQIQIY") || BOT_TOKEN.length < 10) {
            toast.error("Iltimos, haqiqiy token yozing!")
            return
        }

        setLoading(true)
        const text = encodeURIComponent(`🔔 Yangi o'quvchi!\n\n👤 Ism: ${formData.name}\n📞 Tel: ${formData.phone}`)
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${text}`

        try {
            const res = await fetch(url)
            const data = await res.json()

            if (data.ok) {
                toast.success("Muvaffaqiyatli yuborildi!", { position: 'top-right' })
                setFormData({ name: '', phone: '' })
            } else {
                toast.error(`Xato: ${data.description}`)
            }
        } catch (err) {
            toast.error("Tarmoqda xatolik!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 pt-16">
            <Toaster />
            <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Kursga ro'yxatdan o'tish</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Ismingiz</label>
                        <input 
                            type="text" 
                            placeholder="Masalan: Alisher" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-600"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Telefon raqamingiz</label>
                        <input 
                            type="text" 
                            placeholder="+998 90 123 45 67" 
                            required
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-600"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full mt-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition text-sm shadow-sm"
                    >
                        {loading ? "Yuborilmoqda..." : "Ro'yxatdan o'tish"}
                    </button>
                </form>
            </div>
        </div>
    )
}