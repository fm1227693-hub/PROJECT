const fs = require('fs');

// 1. Add translations to JSON files
const langs = ['uz', 'ru', 'en'];

const newTranslations = {
    uz: {
        "schedulesTab": "Dars jadvali",
        "groupsTab": "Guruhlar",
        "daysAndTime": "Kunlar \\ Vaqt",
        "addBtn": "+ qo'shish",
        "editTitle": "Tahrirlash",
        "deleteTitle": "O'chirish",
        "viewStudents": "O'quvchilarni ko'rish",
        "addNewGroup": "Yangi guruh qo'shish",
        "editGroup": "Guruh nomini tahrirlash",
        "groupName": "Guruh nomi",
        "groupPlaceholder": "Masalan: Pre-IELTS 1",
        "cancel": "Bekor qilish",
        "save": "Saqlash",
        "studentsList": "O'quvchilar ro'yxati",
        "addStudentBtn": "O'quvchi qo'shish",
        "editStudent": "O'quvchini tahrirlash",
        "addNewStudent": "Yangi o'quvchi qo'shish",
        "noStudents": "Bu guruhda hali o'quvchilar yo'q.",
        "fio": "F.I.O",
        "fioPlaceholder": "Masalan: Alisherov Ali",
        "phone": "Telefon raqami",
        "boy": "O'g'il bola",
        "girl": "Qiz bola",
        "deleteStudentConfirm": "O'quvchini o'chirmoqchimisiz?",
        "deleteGroupConfirm": "Guruhni o'chirmoqchimisiz?",
        "deleteConfirmBtn": "O'chirish",
        "toast": {
            "fillAllFields": "Barcha maydonlarni to'ldiring!",
            "timeConflict": "Xatolik! Bu vaqt va kunda boshqa guruhga dars belgilangan.",
            "scheduleUpdated": "Jadval yangilandi!",
            "scheduleAdded": "Jadval qo'shildi!",
            "scheduleDeleted": "Jadval o'chirildi!",
            "studentUpdated": "O'quvchi yangilandi!",
            "studentAdded": "O'quvchi qo'shildi!",
            "studentDeleted": "O'quvchi o'chirildi!",
            "groupUpdated": "Guruh yangilandi!",
            "groupAdded": "Guruh qo'shildi!",
            "groupDeleted": "Guruh o'chirildi!",
            "fillNameAndPhone": "Iltimos, ism va telefon raqamni kiriting!",
            "enterGroupName": "Guruh nomini kiriting!"
        }
    },
    ru: {
        "schedulesTab": "Расписание занятий",
        "groupsTab": "Группы",
        "daysAndTime": "Дни \\ Время",
        "addBtn": "+ добавить",
        "editTitle": "Редактировать",
        "deleteTitle": "Удалить",
        "viewStudents": "Посмотреть студентов",
        "addNewGroup": "Добавить новую группу",
        "editGroup": "Редактировать название группы",
        "groupName": "Название группы",
        "groupPlaceholder": "Например: Pre-IELTS 1",
        "cancel": "Отмена",
        "save": "Сохранить",
        "studentsList": "Список студентов",
        "addStudentBtn": "Добавить студента",
        "editStudent": "Редактировать студента",
        "addNewStudent": "Добавить нового студента",
        "noStudents": "В этой группе пока нет студентов.",
        "fio": "Ф.И.О",
        "fioPlaceholder": "Например: Алишеров Али",
        "phone": "Номер телефона",
        "boy": "Мальчик",
        "girl": "Девочка",
        "deleteStudentConfirm": "Вы хотите удалить студента?",
        "deleteGroupConfirm": "Вы хотите удалить группу?",
        "deleteConfirmBtn": "Удалить",
        "toast": {
            "fillAllFields": "Заполните все поля!",
            "timeConflict": "Ошибка! На это время и день уже назначено занятие для другой группы.",
            "scheduleUpdated": "Расписание обновлено!",
            "scheduleAdded": "Расписание добавлено!",
            "scheduleDeleted": "Расписание удалено!",
            "studentUpdated": "Студент обновлен!",
            "studentAdded": "Студент добавлен!",
            "studentDeleted": "Студент удален!",
            "groupUpdated": "Группа обновлена!",
            "groupAdded": "Группа добавлена!",
            "groupDeleted": "Группа удалена!",
            "fillNameAndPhone": "Пожалуйста, введите имя и номер телефона!",
            "enterGroupName": "Введите название группы!"
        }
    },
    en: {
        "schedulesTab": "Class Schedule",
        "groupsTab": "Groups",
        "daysAndTime": "Days \\ Time",
        "addBtn": "+ add",
        "editTitle": "Edit",
        "deleteTitle": "Delete",
        "viewStudents": "View Students",
        "addNewGroup": "Add new group",
        "editGroup": "Edit group name",
        "groupName": "Group name",
        "groupPlaceholder": "e.g., Pre-IELTS 1",
        "cancel": "Cancel",
        "save": "Save",
        "studentsList": "Students List",
        "addStudentBtn": "Add Student",
        "editStudent": "Edit student",
        "addNewStudent": "Add new student",
        "noStudents": "There are no students in this group yet.",
        "fio": "Full Name",
        "fioPlaceholder": "e.g., Alisherov Ali",
        "phone": "Phone number",
        "boy": "Boy",
        "girl": "Girl",
        "deleteStudentConfirm": "Do you want to delete the student?",
        "deleteGroupConfirm": "Do you want to delete the group?",
        "deleteConfirmBtn": "Delete",
        "toast": {
            "fillAllFields": "Please fill in all fields!",
            "timeConflict": "Error! A class is already scheduled for another group at this time and day.",
            "scheduleUpdated": "Schedule updated!",
            "scheduleAdded": "Schedule added!",
            "scheduleDeleted": "Schedule deleted!",
            "studentUpdated": "Student updated!",
            "studentAdded": "Student added!",
            "studentDeleted": "Student deleted!",
            "groupUpdated": "Group updated!",
            "groupAdded": "Group added!",
            "groupDeleted": "Group deleted!",
            "fillNameAndPhone": "Please enter name and phone number!",
            "enterGroupName": "Enter group name!"
        }
    }
};

langs.forEach(lang => {
    const filePath = "public/localization/" + lang + "/global.json";
    if (fs.existsSync(filePath)) {
        let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (!data.adminDashboard) {
            data.adminDashboard = {};
        }
        // Merge translations
        data.adminDashboard = { ...data.adminDashboard, ...newTranslations[lang] };
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    }
});

// 2. Update AdminORG.jsx
const targetFile = 'src/components/AdminORG.jsx';
let content = fs.readFileSync(targetFile, 'utf-8');

const replacements = [
    { old: /"Dars jadvali"/g, new: "{t('adminDashboard.schedulesTab')}" },
    { old: />Dars jadvali</g, new: ">{t('adminDashboard.schedulesTab')}<" },
    { old: />Guruhlar</g, new: ">{t('adminDashboard.groupsTab')}<" },
    { old: /Kunlar \\ Vaqt/g, new: "{t('adminDashboard.daysAndTime')}" },
    { old: /\+ qo'shish/g, new: "{t('adminDashboard.addBtn')}" },
    { old: /title="Tahrirlash"/g, new: "title={t('adminDashboard.editTitle')}" },
    { old: /title="O'chirish"/g, new: "title={t('adminDashboard.deleteTitle')}" },
    { old: /title="O'quvchilarni ko'rish"/g, new: "title={t('adminDashboard.viewStudents')}" },
    { old: /"Yangi guruh qo'shish"/g, new: "t('adminDashboard.addNewGroup')" },
    { old: /"Guruh nomini tahrirlash"/g, new: "t('adminDashboard.editGroup')" },
    { old: />Guruh nomi</g, new: ">{t('adminDashboard.groupName')}<" },
    { old: /placeholder="Masalan: Pre-IELTS 1"/g, new: "placeholder={t('adminDashboard.groupPlaceholder')}" },
    { old: />Bekor qilish</g, new: ">{t('adminDashboard.cancel')}<" },
    { old: />Saqlash</g, new: ">{t('adminDashboard.save')}<" },
    { old: /O'quvchilar ro'yxati/g, new: "{t('adminDashboard.studentsList')}" },
    { old: /O'quvchi qo'shish/g, new: "{t('adminDashboard.addStudentBtn')}" },
    { old: /"O'quvchini tahrirlash"/g, new: "t('adminDashboard.editStudent')" },
    { old: /"Yangi o'quvchi qo'shish"/g, new: "t('adminDashboard.addNewStudent')" },
    { old: /Bu guruhda hali o'quvchilar yo'q\./g, new: "{t('adminDashboard.noStudents')}" },
    { old: />F\.I\.O</g, new: ">{t('adminDashboard.fio')}<" },
    { old: /placeholder="Masalan: Alisherov Ali"/g, new: "placeholder={t('adminDashboard.fioPlaceholder')}" },
    { old: />Telefon raqami</g, new: ">{t('adminDashboard.phone')}<" },
    { old: />O'g'il bola</g, new: ">{t('adminDashboard.boy')}<" },
    { old: />Qiz bola</g, new: ">{t('adminDashboard.girl')}<" },
    { old: /O'quvchini o'chirmoqchimisiz\?/g, new: "{t('adminDashboard.deleteStudentConfirm')}" },
    { old: /Guruhni o'chirmoqchimisiz\?/g, new: "{t('adminDashboard.deleteGroupConfirm')}" },
    { old: />O'chirish</g, new: ">{t('adminDashboard.deleteConfirmBtn')}<" },
    
    // Toast updates
    { old: /toast\.error\("Barcha maydonlarni to'ldiring!"\)/g, new: "toast.error(t('adminDashboard.toast.fillAllFields'))" },
    { old: /toast\.error\("Xatolik! Bu vaqt va kunda boshqa guruhga dars belgilangan\."\)/g, new: "toast.error(t('adminDashboard.toast.timeConflict'))" },
    { old: /toast\.success\("Jadval yangilandi!"\)/g, new: "toast.success(t('adminDashboard.toast.scheduleUpdated'))" },
    { old: /toast\.success\("Jadval qo'shildi!"\)/g, new: "toast.success(t('adminDashboard.toast.scheduleAdded'))" },
    { old: /toast\.success\("Jadval o'chirildi!"\)/g, new: "toast.success(t('adminDashboard.toast.scheduleDeleted'))" },
    { old: /toast\.success\(editingStudentId \? "O'quvchi yangilandi!" : "O'quvchi qo'shildi!"\)/g, new: "toast.success(editingStudentId ? t('adminDashboard.toast.studentUpdated') : t('adminDashboard.toast.studentAdded'))" },
    { old: /toast\.success\("O'quvchi o'chirildi!"\)/g, new: "toast.success(t('adminDashboard.toast.studentDeleted'))" },
    { old: /toast\.success\(editingGroupId \? "Guruh yangilandi!" : "Guruh qo'shildi!"\)/g, new: "toast.success(editingGroupId ? t('adminDashboard.toast.groupUpdated') : t('adminDashboard.toast.groupAdded'))" },
    { old: /toast\.success\("Guruh o'chirildi!"\)/g, new: "toast.success(t('adminDashboard.toast.groupDeleted'))" },
    { old: /toast\.error\("Iltimos, ism va telefon raqamni kiriting!"\)/g, new: "toast.error(t('adminDashboard.toast.fillNameAndPhone'))" },
    { old: /toast\.error\("Guruh nomini kiriting!"\)/g, new: "toast.error(t('adminDashboard.toast.enterGroupName'))" }
];

replacements.forEach(r => {
    content = content.replace(r.old, r.new);
});

fs.writeFileSync(targetFile, content);
console.log("i18n refactoring complete.");
