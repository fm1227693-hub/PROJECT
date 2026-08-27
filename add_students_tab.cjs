const fs = require('fs');

const langs = ['uz', 'ru', 'en'];
const translations = {
    uz: { "studentsTab": "O'quvchilar", "studentName": "O'quvchi ismi" },
    ru: { "studentsTab": "Студенты", "studentName": "Имя студента" },
    en: { "studentsTab": "Students", "studentName": "Student name" }
};

langs.forEach(lang => {
    const filePath = "public/localization/" + lang + "/global.json";
    if (fs.existsSync(filePath)) {
        let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (data.adminDashboard) {
            data.adminDashboard = { ...data.adminDashboard, ...translations[lang] };
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
        }
    }
});

const targetFile = 'src/components/AdminORG.jsx';
let content = fs.readFileSync(targetFile, 'utf-8');

// 1. Add FaUserGraduate to imports
content = content.replace('FaUserCircle, FaUser', 'FaUserCircle, FaUser, FaUserGraduate');

// 2. Add SidebarItem
const sidebarGroup = `<SidebarItem icon={<FaUsers />} label={t('adminDashboard.groupsTab', "Guruhlar")} isActive={activeTab === 'groups'} onClick={() => setActiveTab('groups')} />`;
const newSidebarGroup = `<SidebarItem icon={<FaUsers />} label={t('adminDashboard.groupsTab', "Guruhlar")} isActive={activeTab === 'groups'} onClick={() => setActiveTab('groups')} />
                    <SidebarItem icon={<FaUserGraduate />} label={t('adminDashboard.studentsTab', "O'quvchilar")} isActive={activeTab === 'students'} onClick={() => setActiveTab('students')} />`;
content = content.split(sidebarGroup).join(newSidebarGroup);

// 3. Update Title text
const headerTitle = `activeTab === 'groups' ? t('adminDashboard.groupsTab', "GURUHLAR").toUpperCase() :`;
const newHeaderTitle = `activeTab === 'groups' ? t('adminDashboard.groupsTab', "GURUHLAR").toUpperCase() : activeTab === 'students' ? t('adminDashboard.studentsTab', "O'QUVCHILAR").toUpperCase() :`;
content = content.split(headerTitle).join(newHeaderTitle);

// 4. Add Students Tab Content
// Where to insert? Right before `{activeTab === 'CommentsORG' && (`
const commentsOrgTab = `{activeTab === 'CommentsORG' && (`;

const studentsTabContent = `
                {activeTab === 'students' && (
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                {t('adminDashboard.studentsTab')}
                            </h2>
                        </div>

                        {groups.flatMap(g => (g.students || []).map(s => ({...s, groupName: g.name, groupId: g.id}))).length === 0 ? (
                            <div className="text-center py-16">
                                <FaUserGraduate className="text-6xl text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Hali o'quvchilar yo'q</h3>
                                <p className="text-gray-500">Guruhlarga kirib o'quvchi qo'shishingiz mumkin.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {groups.flatMap(g => (g.students || []).map(s => ({...s, groupName: g.name, groupId: g.id}))).map(student => (
                                    <div key={student.id} className="bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex flex-col gap-4 hover:shadow-md hover:bg-white dark:hover:bg-gray-800 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className={\`w-14 h-14 rounded-full shrink-0 border-2 border-gray-100 dark:border-gray-600 flex items-center justify-center text-3xl shadow-sm \${student.gender === 'ayol' ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-500' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'}\`}>
                                                <FaUser />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 dark:text-white truncate" title={student.name}>{student.name}</h4>
                                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 truncate">{student.phone}</p>
                                            </div>
                                        </div>
                                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                            <span className="inline-block px-3 py-1.5 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 truncate max-w-[150px]">
                                                {student.groupName}
                                            </span>
                                            
                                            <button onClick={() => {
                                                const group = groups.find(g => g.id === student.groupId);
                                                setSelectedGroupDetails(group);
                                                setActiveTab('groups');
                                                // We can also trigger editing the student, but viewing the group is good enough
                                            }} className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-blue-900/40 flex items-center justify-center transition-colors">
                                                <FaRegEye className="text-xs" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                {activeTab === 'CommentsORG' && (`;

content = content.split(commentsOrgTab).join(studentsTabContent);

// Wait, the headerTitle has a bug, it's missing 'activeTab === "groups"' replacement correctly because it was hardcoded differently.
// Let's fix the header Title using regex
const headerTitleRegex = /\{activeTab === 'leads' \? t\('adminPanel\.murojaatlarTab', 'Murojaatlar'\)\.toUpperCase\(\) : activeTab === 'schedules' \? t\('adminDashboard\.schedulesTab'\)\.toUpperCase\(\) : activeTab === 'groups' \? t\('adminDashboard\.groupsTab'\)\.toUpperCase\(\) : t\('adminPanel\.CommentsORGTab', "O'quvchilar Izohlari"\)\.toUpperCase\(\)\}/g;

const newHeaderTitleRegex = "{activeTab === 'leads' ? t('adminPanel.murojaatlarTab', 'Murojaatlar').toUpperCase() : activeTab === 'schedules' ? t('adminDashboard.schedulesTab').toUpperCase() : activeTab === 'groups' ? t('adminDashboard.groupsTab').toUpperCase() : activeTab === 'students' ? t('adminDashboard.studentsTab').toUpperCase() : t('adminPanel.CommentsORGTab', \"O'quvchilar Izohlari\").toUpperCase()}";

content = content.replace(headerTitleRegex, newHeaderTitleRegex);

fs.writeFileSync(targetFile, content);
console.log("Students tab added.");
