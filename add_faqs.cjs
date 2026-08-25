const fs = require('fs');

const faqs = {
  uz: {
    q5: "Kurs narxlari qancha?",
    a5: "Kurs narxlari darajangizga va guruh yoki yakka tartibdagi darslarga qarab o'zgaradi. Aniq ma'lumot olish uchun narxlar sahifasiga o'ting yoki biz bilan bog'laning.",
    q6: "Darslar qaysi kunlari bo'ladi?",
    a6: "Darslar haftada 3 kun asosiy va 1 kun qo'shimcha Speaking Club sifatida o'tiladi. Sizga mos vaqtni tanlash imkoniyati mavjud.",
    q7: "Bepul sinov darsi bormi?",
    a7: "Ha, markazimizda barcha yangi o'quvchilar uchun birinchi sinov darsi butunlay bepul. Bu orqali siz dars jarayoni va o'qituvchi bilan yaqindan tanishishingiz mumkin.",
    q8: "Uy vazifalari qanday tekshiriladi?",
    a8: "Uy vazifalari har dars oldidan o'qituvchilar va ularning yordamchilari tomonidan qat'iy tekshiriladi. Vazifalarni bajarmaslik o'quv jarayoniga salbiy ta'sir ko'rsatganligi uchun ularga jiddiy yondashamiz.",
    q9: "Online o'qish imkoniyati bormi?",
    a9: "Albatta, bizda ham an'anaviy oflayn, ham onlayn formatda darslar mavjud. Onlayn darslar ham oflayn darslar kabi interaktiv va samarali o'tiladi.",
    q10: "Ustozni almashtirish mumkinmi?",
    a10: "Agar sizga dars uslubi tushunarsiz bo'lsa yoki boshqa guruhga o'tishni xohlasangiz, ma'muriyatimizga murojaat qilib bemalol o'qituvchini yoki vaqtni o'zgartirishingiz mumkin."
  },
  en: {
    q1: "How long do your courses last?",
    a1: "Depending on the direction, our courses last from 3 to 12 months. Classes are held 4 times a week by qualified teachers.",
    q2: "What is required to start classes?",
    a2: "To get started, you only need a laptop (computer), necessary books, internet, and a strong desire. Basic knowledge is taught from scratch.",
    q3: "What happens if I miss a class?",
    a3: "Active participation in every class is recommended. If you miss a class or struggle with a topic, our experienced assistant teachers will help you outside of class times, explaining the topics again and assisting with practical exercises.",
    q4: "Will I get a certificate after completing the course?",
    a4: "Yes, graduates who successfully complete the course will receive a special certificate, and the best students will receive practical help in finding a job.",
    q5: "What are the course prices?",
    a5: "Course prices vary depending on your level and whether you choose group or individual lessons. For precise information, please visit the pricing page or contact us.",
    q6: "What days are the classes held?",
    a6: "Classes are held 3 days a week with 1 additional day for the Speaking Club. You can choose a time that suits you best.",
    q7: "Is there a free trial lesson?",
    a7: "Yes, the first trial lesson is completely free for all new students at our center. This allows you to get acquainted with the learning process and the teacher.",
    q8: "How is homework checked?",
    a8: "Homework is strictly checked by teachers and their assistants before each lesson. Since not doing homework negatively affects the learning process, we take it very seriously.",
    q9: "Is online study available?",
    a9: "Of course, we offer both traditional offline and online classes. Online classes are just as interactive and effective as offline ones.",
    q10: "Can I change my teacher?",
    a10: "If you do not understand the teaching style or wish to switch to another group, you can freely change your teacher or schedule by contacting our administration."
  },
  ru: {
    q1: "Как долго длятся ваши курсы?",
    a1: "В зависимости от направления наши курсы длятся от 3 до 12 месяцев. Занятия проводятся 4 раза в неделю квалифицированными преподавателями.",
    q2: "Что требуется для начала занятий?",
    a2: "Для начала вам понадобится только ноутбук (компьютер), необходимые книги, интернет и сильное желание. Базовые знания преподаются с нуля.",
    q3: "Что будет, если я пропущу занятие?",
    a3: "Рекомендуется активное участие в каждом занятии. Если вы пропустите урок или не поймете тему, наши опытные ассистенты помогут вам во внеурочное время, заново объяснив темы и помогая с практическими заданиями.",
    q4: "Получу ли я сертификат после окончания курса?",
    a4: "Да, выпускники, успешно окончившие курс, получают специальный сертификат, а лучшим студентам оказывается практическая помощь в поиске работы.",
    q5: "Каковы цены на курсы?",
    a5: "Цены на курсы зависят от вашего уровня и формата обучения (групповые или индивидуальные занятия). Для получения точной информации посетите страницу цен или свяжитесь с нами.",
    q6: "В какие дни проводятся занятия?",
    a6: "Занятия проводятся 3 раза в неделю в качестве основных и 1 дополнительный день в виде Speaking Club. Вы можете выбрать удобное для вас время.",
    q7: "Есть ли бесплатный пробный урок?",
    a7: "Да, первый пробный урок абсолютно бесплатен для всех новых студентов нашего центра. Это позволяет вам ознакомиться с процессом обучения и преподавателем.",
    q8: "Как проверяются домашние задания?",
    a8: "Домашние задания строго проверяются преподавателями и их помощниками перед каждым уроком. Поскольку невыполнение заданий негативно влияет на процесс обучения, мы относимся к этому очень серьезно.",
    q9: "Возможно ли онлайн-обучение?",
    a9: "Конечно, у нас есть как традиционные, так и онлайн-занятия. Онлайн-уроки такие же интерактивные и эффективные, как и оффлайн.",
    q10: "Могу ли я сменить преподавателя?",
    a10: "Если вам непонятен стиль преподавания или вы хотите перейти в другую группу, вы можете свободно сменить преподавателя или время, обратившись в администрацию."
  }
};

['uz', 'en', 'ru'].forEach(lang => {
  const path = `./public/localization/${lang}/global.json`;
  if (fs.existsSync(path)) {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    
    if (!data.faq) data.faq = {};
    Object.assign(data.faq, faqs[lang]);
    
    fs.writeFileSync(path, JSON.stringify(data, null, 4));
    console.log(`Updated ${lang}`);
  }
});
