import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const mentors = [
  { id: 1, name: 'Zamirgor Omiqova', role: 'IELTS 8.5 Expert' },
  { id: 2, name: 'Gulasal', role: 'IELTS 9.0 Certified' },
  { id: 3, name: 'Ruxillo Asrorov', role: 'English Teacher & IELTS Expert' }
];

const timeSlots = ['10:00 - 10:15', '11:00 - 11:15', '14:00 - 14:15', '16:00 - 16:15', '18:00 - 18:15'];

export default function ConsultationBooking() {
  const { t } = useTranslation();
  const [selectedMentor, setSelectedMentor] = useState(mentors[0].name);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  const BOT_TOKEN = "8800216213:AAGmRhvFeu0bmzYcGxVAgMT-LEiqAEJ1WnI";
  const ADMIN_CHAT_IDS = ["6383523156", "334572168"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !studentName || !studentPhone) {
      toast.error(t('consultationBooking.fillAllError', "Iltimos, barcha maydonlarni to'ldiring!"));
      return;
    }

    const newLead = {
      id: Date.now(),
      isLead: true,
      name: studentName,
      phone: studentPhone.startsWith('+') ? studentPhone : `+998 ${studentPhone.replace(/\D/g, '')}`,
      type: `Konsultatsiya (${selectedMentor} - ${selectedDate} ${selectedTime})`,
      date: new Date().toLocaleString('uz-UZ'),
      status: 'Kutilmoqda'
    };

    try {
      const res = await axios.get('https://optimum-a2d13-default-rtdb.firebaseio.com/leads.json')
      let currentLeads = []
      if (res.data !== null) {
          currentLeads = Array.isArray(res.data) ? res.data : Object.values(res.data)
      }
      const updatedLeads = [newLead, ...currentLeads]
      await axios.put('https://optimum-a2d13-default-rtdb.firebaseio.com/leads.json', updatedLeads)
      localStorage.setItem('admin_leads', JSON.stringify(updatedLeads))
    } catch (err) {
      console.error("API error:", err)
      const existingLeads = JSON.parse(localStorage.getItem('admin_leads') || '[]')
      localStorage.setItem('admin_leads', JSON.stringify([newLead, ...existingLeads]))
    }

    const message = `Yangi Konsultatsiya Bron Qilindi:\n\nIsm: ${studentName}\nTel: ${studentPhone}\nMentor: ${selectedMentor}\nSana: ${selectedDate}\nVaqt: ${selectedTime}`;

    try {
      ADMIN_CHAT_IDS.forEach(chatId => {
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: message })
        }).catch(err => console.error(err));
      });
    } catch (err) {
      console.error(err);
    }

    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      setSelectedDate('');
      setSelectedTime('');
      setStudentName('');
      setStudentPhone('');
    }, 4000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#0f1016] text-white rounded-2xl border border-gray-800 shadow-xl my-10 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">{t('consultationBooking.title', "Bepul 15 daqiqalik konsultatsiya")}</h2>
        <p className="text-gray-400 text-sm">{t('consultationBooking.subtitle', "Ustozni tanlang, o'zingizga qulay vaqtni belgilang va bepul maslahat oling.")}</p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-950 border border-emerald-600 text-emerald-300 rounded-lg text-center animate-fade-in">
          {t('consultationBooking.successMessage', "Tabriklaymiz! Konsultatsiyaga muvaffaqiyatli yozildingiz. Tez orada siz bilan bog'lanamiz.")}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mentorlar */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('consultationBooking.selectMentor', "Ustozni tanlang")}</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {mentors.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => setSelectedMentor(m.name)}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedMentor === m.name
                    ? 'border-red-600 bg-red-600/10 text-white'
                    : 'border-gray-800 bg-[#161821] text-gray-400 hover:border-gray-700'
                }`}
              >
                <div className="font-semibold text-sm">{m.name}</div>
                <div className="text-xs text-gray-500 mt-1">{m.role}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sana va Vaqt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('consultationBooking.selectDateTime', "Sanani tanlang")}</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#161821] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('consultationBooking.selectDateTime', "Vaqtni tanlang (15 daqiqa)")}</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full bg-[#161821] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600"
            >
              <option value="">{t('consultationBooking.selectDateTime', "Vaqtni tanlang")}</option>
              {timeSlots.map((time, index) => (
                <option key={index} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Shaxsiy ma'lumotlar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('consultationBooking.nameLabel', "Ismingiz")}</label>
            <input
              type="text"
              placeholder="Alisher"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full bg-[#161821] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('consultationBooking.phoneLabel', "Telefon raqamingiz")}</label>
            <input
              type="tel"
              placeholder="+998 90 123 45 67"
              value={studentPhone}
              onChange={(e) => setStudentPhone(e.target.value)}
              className="w-full bg-[#161821] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        {/* Tugma */}
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-red-600/20 cursor-pointer"
        >
          {t('consultationBooking.submitBtn', "Bron qilish")}
        </button>
      </form>
      <Toaster position="top-right" />
    </div>
  );
}