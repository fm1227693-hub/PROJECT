# Optimum Student Portal — Amalga Oshirish va Xavfsizlik Jurnali

Ushbu hujjat loyihada amalga oshirilgan audit, qilingan o'zgarishlar, xavfsizlik talablari va bosqichma-bosqich bajarilgan amallarni konsolidatsiyalangan holda saqlaydi.

---

## 1. Loyihaning Hozirgi Arxitekturasi (Tasdiqlangan Faktlar)

- **Frontend:** React 19.2.7, Vite 8.1.1, Tailwind CSS v4, i18next ko'p tillilik tizimi (`uz`, `ru`, `en`).
- **Marshrutlash (Routing):**
  - `/login` -> [`src/components/Login.jsx`](../src/components/Login.jsx)
  - `/student/register` -> [`src/components/StudentRegister.jsx`](../src/components/StudentRegister.jsx)
  - `/student/dashboard` -> [`src/components/StudentDashboard.jsx`](../src/components/StudentDashboard.jsx)
  - `/enter` -> [`src/components/Admin.jsx`](../src/components/Admin.jsx) -> [`src/components/AdminORG.jsx`](../src/components/AdminORG.jsx)
- **Supabase Mijozi:**
  - Kutubxona: `@supabase/supabase-js` o'rnatilgan.
  - Fayl: [`src/lib/supabase.js`](../src/lib/supabase.js) mavjud.
  - Env o'zgaruvchilari: `.env` faylida `VITE_SUPABASE_URL` va `VITE_SUPABASE_ANON_KEY` sozlangan.
- **Admin Autentifikatsiyasi:**
  - Rasmiy Supabase Auth admin hisobi yaratilgan: `admin@optimum.uz` (UID: `c74aad9e-0047-472d-9474-21287efb623c`).
  - `public.profiles` jadvaliga `role = 'admin'`, `status = 'active'` qilib biriktirilgan.
  - Admin login qilganda haqiqiy Supabase JWT token oladi, bu esa RLS da `is_admin() = true` bo'lishini ta'minlaydi.
- **Talaba Ro'yxatdan O'tishi va Tasdiqlanishi:**
  - `supabase.auth.signUp()` orqali ro'yxatdan o'tadi (parollar serverda bcrypt/argon2 bilan shifrlanadi).
  - PostgreSQL triggeri `on_auth_user_created` avtomatik ravishda `role = 'student'`, `status = 'pending'` qilib yozadi.
  - Talaba tasdiqlanmaguncha darslar jadvalini ko'ra olmaydi (RLS orqali himoyalangan).
  - Admin panelda "Tasdiqlash" (Approve) tugmasi orqali talaba faollashtiriladi (`status = 'active'`).

---

## 2. Bajarilgan Ishlar Ro'yxati (Checklist)

- [x] `@supabase/supabase-js` o'rnatildi va `src/lib/supabase.js` mijozi yaratildi.
- [x] Baza holati faqat o'quvchi SQL orqali tekshirildi (0 ta eski profil, 4 ta toza RLS policy).
- [x] Supabase Auth'da `admin@optimum.uz` admin hisobi ochildi.
- [x] Enterprise darajasidagi Zero-Trust SQL migratsiyasi Supabase bazasida muvaffaqiyatli ishga tushirildi:
  - `profiles_id_fkey` mustahkamlandi;
  - `profiles_username_lower_idx` unikal case-insensitive indeksi qo'yildi;
  - `is_admin()` va `is_username_available()` funksiyalari `SET search_path = public, pg_temp` bilan himoyalandi;
  - `on_auth_user_created` triggeri orqali guruh kodi va `pending` holati serverda nazoratga olindi;
  - Barcha jadvallarda least-privilege RLS siyosatlari o'rnatildi.
- [x] `authService.js` Supabase Auth va bazaviy triggerlar bilan to'liq bog'landi.
- [x] `Admin.jsx` rasmiy admin sessiyasi va orqaga moslik (legacy PIN) bilan ta'minlandi.
- [x] `npm run build` 0 ta xato bilan muvaffaqiyatli tekshirildi.
