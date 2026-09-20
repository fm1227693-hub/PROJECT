import {useState} from 'react'
import { useTranslation } from 'react-i18next'
import { FaCheckCircle, FaSpinner, FaArrowRight, FaTimes } from 'react-icons/fa'
import { HiArrowLeft } from 'react-icons/hi'
import axios from 'axios'
import { IMaskInput } from 'react-imask';

export default function LeadForm() {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN_2

    // Ikkita admin chat ID lari massiv ko'rinishida
    const CHAT_IDS = ["334572168", "6383523156"]

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim() || !phone.trim()) {
            setError(t('leadForm.errorAllFields', "Iltimos, barcha maydonlarni to'ldiring!"))
            return
        }

        const digitsOnly = phone.replace(/\D/g, '')
        if (digitsOnly.length < 9) {
            setError(t('leadForm.errorPhoneDigits', "Iltimos, 9 ta raqamni to'liq kiriting!"))
            return
        }

        setError('')
        setLoading(true)

        const message = `Yangi murojaat (Optimum):\n\nIsm: ${name}\nTel: +998${digitsOnly}`

        try {
            const promises = CHAT_IDS.map(chatId =>
                fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: message,
                        parse_mode: 'HTML'
                    }),
                })
            )

            const responses = await Promise.all(promises)
            const allSuccess = responses.every(res => res.ok)

            if (allSuccess) {
                const newLead = {
                    id: Date.now(),
                    isLead: true,
                    name: name,
                    phone: `+998 ${digitsOnly}`,
                    type: t('leadForm.badge', 'Bepul maslahat'),
                    date: new Date().toLocaleString('uz-UZ'),
                    status: 'Kutilmoqda'
                }

                try {
                    const res = await axios.get(import.meta.env.VITE_FIREBASE_DB_URL)
                    let currentLeads = []
                    if (res.data !== null) {
                        currentLeads = Array.isArray(res.data) ? res.data : Object.values(res.data)
                    }
                    const updatedLeads = [newLead, ...currentLeads]
                    await axios.put(import.meta.env.VITE_FIREBASE_DB_URL, updatedLeads)
                    localStorage.setItem('admin_leads', JSON.stringify(updatedLeads))
                } catch (err) {
                    console.error("API error:", err)
                    const existingLeads = JSON.parse(localStorage.getItem('admin_leads') || '[]')
                    localStorage.setItem('admin_leads', JSON.stringify([newLead, ...existingLeads]))
                }

                setSuccess(true)
                setName('')
                setPhone('')
                setTimeout(() => {
                    setSuccess(false)
                    setIsOpen(false)
                }, 4000)
            } else {
                setError(t('leadForm.errorGeneric', "Xatolik yuz berdi. Qaytadan urinib ko'ring."))
            }
        } catch {
            setError(t('leadForm.errorNetwork', "Internet aloqasini tekshiring."))
        } finally {
            setLoading(false)
        }
    }

    const handleGoBack = () => {
        window.history.back()
    }

    return (
        <section className="min-h-screen flex items-center select-none pt-[110px] pb-16">
            <div className="container-site relative">

                {/* Orqaga qaytish tugmasi */}
                <button
                    onClick={handleGoBack}
                    aria-label={t('common.back', 'Orqaga')}
                    className="absolute -top-6 left-0 sm:-left-2 group flex items-center justify-center w-11 h-11 hover:w-auto hover:px-5 overflow-hidden bg-raised hover:bg-ink hover:text-bg rounded-full border border-line transition-all duration-400 cursor-pointer z-50"
                >
                    <HiArrowLeft className="w-4.5 h-4.5 shrink-0 mx-auto group-hover:mx-0 group-hover:mr-2.5 transition-all" />
                    <span className="text-[13px] font-semibold whitespace-nowrap max-w-0 group-hover:max-w-[80px] transition-all duration-400 overflow-hidden">
                        {t('common.back', 'Orqaga')}
                    </span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-10">

                    {/* Chap — matn */}
                    <div className="lg:col-span-6" data-reveal>
                        <span className="eyebrow">{t('leadForm.badge', 'Bepul maslahat')}</span>
                        <h1 className="display-1 !text-[clamp(2.4rem,5.2vw,4.2rem)] mt-5 text-ink">
                            {t('leadForm.titlePrefix', "Ingliz tilini o'rganishni")}{' '}
                            <span className="serif-accent">{t('leadForm.titleHighlight', 'bugun boshlang!')}</span>
                        </h1>
                        <p className="lede mt-5 max-w-[48ch]">
                            {t('leadForm.description', "Ismingiz va telefon raqamingizni qoldiring. Mutaxassislarimiz siz bilan tezda bog'lanib, bepul darsga yozishadi va barcha savollaringizga javob berishadi.")}
                        </p>

                        {!isOpen && (
                            <div className="pt-6">
                                <button
                                    onClick={() => setIsOpen(true)}
                                    className="btn btn-primary"
                                >
                                    <span>{t('leadForm.applyNowBtn', 'Hozirdan yozilish')}</span>
                                    <FaArrowRight className="w-3.5 h-3.5 btn-arrow" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* O'ng — forma */}
                    <div className="lg:col-span-5 lg:col-start-8" data-reveal="right" data-reveal-delay="120">
                        <div className={`card !rounded-[20px] p-6 sm:p-8 transition-all duration-500 ${isOpen ? 'opacity-100 block' : 'hidden'}`}>
                            {success ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                                    <FaCheckCircle className="text-accent text-5xl" />
                                    <h3 className="font-display text-[24px] font-semibold text-ink">{t('leadForm.successTitle', 'Murojaatingiz qabul qilindi!')}</h3>
                                    <p className="text-muted text-[14px]">{t('leadForm.successDesc', 'Tez orada operatorlarimiz siz bilan bog\'lanishadi.')}</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-display text-[24px] font-semibold text-ink">{t('leadForm.formTitle', 'Bepul darsga yozilish')}</h3>
                                        <button
                                            type="button"
                                            onClick={() => setIsOpen(false)}
                                            aria-label={t('common.close', 'Yopish')}
                                            className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-muted hover:text-ink hover:border-linestrong transition-colors cursor-pointer"
                                        >
                                            <FaTimes className="w-3 h-3" />
                                        </button>
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-accentsoft border border-accent/25 text-accent text-[12.5px] rounded-xl font-medium">
                                            {error}
                                        </div>
                                    )}

                                    <div>
                                        <label htmlFor="lead-name" className="block text-[12px] font-semibold text-muted mb-1.5">{t('leadForm.nameLabel', 'Ismingiz')}</label>
                                        <input
                                            id="lead-name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder={t('leadForm.namePlaceholder', 'Masalan: Aziz')}
                                            className="glass-input w-full px-4 py-3 text-[14px] placeholder:text-muted"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="lead-phone" className="block text-[12px] font-semibold text-muted mb-1.5">{t('leadForm.phoneLabel', 'Telefon raqamingiz')}</label>
                                        <div id="lead-phone" className="glass-input flex items-center rounded-[12px] overflow-hidden focus-within:border-accent">
                                            <span className="pl-4 pr-3 text-soft text-[14px] font-semibold select-none border-r border-line py-3">
                                                +998
                                            </span>
                                            <IMaskInput
                                                mask="(00) 000-00-00"
                                                value={phone}
                                                onAccept={(value) => setPhone(value)}
                                                placeholder="(90) 123-45-67"
                                                className="w-full px-4 py-3 bg-transparent text-ink placeholder:text-muted text-[14px] focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary w-full !py-3.5 disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        {loading ? (
                                            <>
                                                <FaSpinner className="w-4 h-4 animate-spin" />
                                                <span>{t('leadForm.submitting', 'Yuborilmoqda...')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>{t('leadForm.submitBtn', 'Joy band qilish')}</span>
                                                <FaArrowRight className="w-3 h-3 btn-arrow" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        {!isOpen && (
                            <div className="card !rounded-[20px] p-6 sm:p-8 flex items-center gap-5">
                                <span className="font-display text-[44px] font-semibold text-accent leading-none">5+</span>
                                <p className="text-[13px] leading-relaxed text-muted">
                                    {t('about.goalDesc')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
