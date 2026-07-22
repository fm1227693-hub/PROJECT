import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./public/localization/en/global.json";
import ru from "./public/localization/ru/global.json";
import uz from "./public/localization/uz/global.json";

const resources = {
    en: { translation: en },
    uz: { translation: uz },
    ru: { translation: ru },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem("lng") || "en",
        fallbackLng: "en", // <--- SHU YERNI TO'G'RILANG

        interpolation: {
            escapeValue: false
        }
    });

i18n.on("languageChanged", (lng) => {
    localStorage.setItem("lng", lng);
});

export default i18n;