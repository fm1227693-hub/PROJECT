const fs = require('fs');

const targetFile = 'src/components/AdminORG.jsx';
let content = fs.readFileSync(targetFile, 'utf-8');

// 1. Move Groups Table out of Schedules Tab
const oldGroupsTable = `                        
                        {/* GROUPS TABLE */}
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col relative mt-8">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Guruhlar</h2>
                                <button onClick={() => {
                                    setNewGroupNameInput('')
                                    setShowAddGroupModal(true)
                                }} className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-red-600/20 whitespace-nowrap">
                                    + Guruh qo'shish
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto custom-scrollbar pb-2">
                                <table className="w-full text-left border-collapse min-w-[500px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800 text-xs lg:text-sm font-bold text-gray-500 dark:text-gray-400">
                                            <th className="py-4 px-4 font-medium">Guruh Nomi</th>
                                            <th className="py-4 px-4 font-medium text-right">Amallar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groups.length === 0 ? (
                                            <tr>
                                                <td colSpan="2" className="py-8 text-center text-gray-500">
                                                    Guruhlar topilmadi
                                                </td>
                                            </tr>
                                        ) : (
                                            groups.map(group => (
                                                <tr key={group.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition text-sm">
                                                    <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">{group.name}</td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button onClick={() => setDeleteModalGroup(group)} className="text-rose-500 hover:text-rose-600 transition-colors" title="O'chirish">
                                                                <FaTimesCircle className="text-xl" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>`;

content = content.replace(oldGroupsTable, '');

// Insert it as a separate tab
const newTabContent = `
                {activeTab === 'groups' && (
                    <div className="space-y-8 max-w-[1400px] mx-auto">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col relative">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Guruhlar</h2>
                                <button onClick={() => {
                                    setNewGroupNameInput('')
                                    setShowAddGroupModal(true)
                                }} className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-red-600/20 whitespace-nowrap">
                                    + Guruh qo'shish
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto custom-scrollbar pb-2">
                                <table className="w-full text-left border-collapse min-w-[500px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800 text-xs lg:text-sm font-bold text-gray-500 dark:text-gray-400">
                                            <th className="py-4 px-4 font-medium">Guruh Nomi</th>
                                            <th className="py-4 px-4 font-medium text-right">Amallar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groups.length === 0 ? (
                                            <tr>
                                                <td colSpan="2" className="py-8 text-center text-gray-500">
                                                    Guruhlar topilmadi
                                                </td>
                                            </tr>
                                        ) : (
                                            groups.map(group => (
                                                <tr key={group.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition text-sm">
                                                    <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">{group.name}</td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button onClick={() => setDeleteModalGroup(group)} className="text-rose-500 hover:text-rose-600 transition-colors" title="O'chirish">
                                                                <FaTimesCircle className="text-xl" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
`;

content = content.replace(`{activeTab === 'CommentsORG' && (`, newTabContent + `                {activeTab === 'CommentsORG' && (` );

// 2. Add Sidebar Item
const oldSidebar = `<SidebarItem icon={<FaCalendarAlt />} label="Dars jadvali" isActive={activeTab === 'schedules'} onClick={() => setActiveTab('schedules')} />`;
const newSidebar = `<SidebarItem icon={<FaCalendarAlt />} label="Dars jadvali" isActive={activeTab === 'schedules'} onClick={() => setActiveTab('schedules')} />
                    <SidebarItem icon={<FaUsers />} label="Guruhlar" isActive={activeTab === 'groups'} onClick={() => setActiveTab('groups')} />`;

content = content.replace(oldSidebar, newSidebar);

// 3. Update Header Title
const oldTitle = `{activeTab === 'leads' ? t('adminPanel.murojaatlarTab', 'Murojaatlar').toUpperCase() : activeTab === 'schedules' ? "DARS JADVALI" : t('adminPanel.CommentsORGTab', "O'quvchilar Izohlari").toUpperCase()}`;
const newTitle = `{activeTab === 'leads' ? t('adminPanel.murojaatlarTab', 'Murojaatlar').toUpperCase() : activeTab === 'schedules' ? "DARS JADVALI" : activeTab === 'groups' ? "GURUHLAR" : t('adminPanel.CommentsORGTab', "O'quvchilar Izohlari").toUpperCase()}`;

content = content.replace(oldTitle, newTitle);

fs.writeFileSync(targetFile, content);
console.log("Refactoring complete.");
