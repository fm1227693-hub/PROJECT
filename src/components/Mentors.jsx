import React, { useState } from "react";
const mentorsData = [
  {
    id: 1,
    name: "Madina Hakimova",
    role: "Senior English Instructor (IELTS 8.5)",
    experience: "6+ yil tajriba",
    skills: ["General English", "IELTS", "Speaking"],
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    bio: "Ingliz tilini Zero dan boshlagan o'quvchilarga tez fursatda erkin gapirishni o'rgatadi. 200+ dan ortiq IELTS 7+ egalarini tayyorlagan.",
    telegram: "https://t.me/username",
  },
  {
    id: 2,
    name: "Jasurbek Sobirov",
    role: "ESL & Speaking Coach",
    experience: "4+ yil tajriba",
    skills: ["Grammar", "Listening", "Vocabulary"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    bio: "Aksent ustida ishlash va til to'sig'ini (tili chiqishini) yengish bo'yicha mutaxassis. Darslarni interaktiv tarzda olib boradi.",
    telegram: "https://t.me/username",
  },
];

export default function Mentors() {
  const [modal, setModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [toast, setToast] = useState(false);

  // Formani yuborish funksiyasi
  const handleSubmit = (e) => {
    e.preventDefault();
    setModal(false);

    // Toastni chiqarish va 3 sekunddan keyin yopish
    setToast(true);
    setTimeout(() => {
      setToast(false);
    }, 3000);
  };

  return (
    <section className="bg-slate-950 py-16 px-4 md:px-8 text-white relative">
      <div className="max-w-6xl mx-auto">
        {/* Sarlavha qismi */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Bizning Ingliz Tili Mentorlarimiz</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Xalqaro sertifikatlarga ega tajribali ustozlar yordamida ingliz tilini mukammal o'rganing.
          </p>
        </div>

        {/* Kartochkalar grid qismi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mentorsData.slice(0, 2).map((mentor) => (
            <div
              key={mentor.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-center hover:border-slate-700 transition"
            >
              {/* Rasm qismi */}
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-32 h-32 rounded-xl object-cover border-2 border-red-500/20"
              />

              {/* Ma'lumotlar qismi */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                  <h3 className="text-xl font-semibold">{mentor.name}</h3>
                  <span className="text-xs bg-red-500/10 text-red-400 px-3 py-1 rounded-full font-medium w-fit mx-auto sm:mx-0">
                    {mentor.experience}
                  </span>
                </div>
                <p className="text-red-400 text-sm font-medium mb-3">{mentor.role}</p>
                <p className="text-slate-300 text-sm mb-4">{mentor.bio}</p>

                {/* Yo'nalishlar (Skills) */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-5">
                  {mentor.skills.map((skill, index) => (
                    <span key={index} className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Tugma */}
                <button
                  onClick={() => {
                    setSelectedMentor(mentor.name);
                    setModal(true);
                  }}
                  className="inline-block bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition w-full sm:w-auto text-center cursor-pointer"
                >
                  Bog'lanish
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Oyna */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md relative text-white shadow-2xl">
            {/* Yopish tugmasi (X) */}
            <button
              onClick={() => setModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold mb-2">Mentor bilan bog'lanish</h3>
            <p className="text-slate-400 text-sm mb-4">
              Tanlangan ustoz: <span className="text-red-400 font-medium">{selectedMentor}</span>
            </p>

            {/* Forma */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Ismingiz</label>
                <input
                  type="text"
                  required
                  placeholder="Ismingizni kiriting"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Telefon raqamingiz</label>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-xl transition cursor-pointer"
              >
                Yuborish
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-bounce">
          <span>✅ Ma'lumot muvaffaqiyatli yuborildi!</span>
        </div>
      )}
    </section>
  );
}