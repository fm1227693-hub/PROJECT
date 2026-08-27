const fs = require('fs');

const targetFile = 'src/components/AdminORG.jsx';
let content = fs.readFileSync(targetFile, 'utf-8');

const oldTableSection = `                            <div className="overflow-x-auto custom-scrollbar pb-2">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800 text-xs lg:text-sm font-bold text-gray-500 dark:text-gray-400">
                                            <th className="py-4 px-4 font-medium">Guruh Nomi</th>
                                            <th className="py-4 px-4 font-medium">Kunlar</th>
                                            <th className="py-4 px-4 font-medium">Vaqti</th>
                                            <th className="py-4 px-4 font-medium text-right">Amallar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedules.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="py-8 text-center text-gray-500">
                                                    Jadvallar topilmadi
                                                </td>
                                            </tr>
                                        ) : (
                                            schedules.map(schedule => (
                                                <tr key={schedule.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition text-sm">
                                                    <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">{schedule.group}</td>
                                                    <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{Array.isArray(schedule.days) ? schedule.days.join(', ') : schedule.days}</td>
                                                    <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                                                        <span className="inline-block px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                                                            {schedule.time}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button onClick={() => handleEditScheduleClick(schedule)} className="text-gray-400 hover:text-blue-500 transition-colors" title="Tahrirlash">
                                                                <FaRegEye className="text-lg" />
                                                            </button>
                                                            <button onClick={() => setDeleteModalSchedule(schedule)} className="text-rose-500 hover:text-rose-600 transition-colors" title="O'chirish">
                                                                <FaTimesCircle className="text-xl" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>`;

const newMatrixTable = `                            <div className="overflow-x-auto custom-scrollbar pb-4 relative">
                                <table className="w-full text-left border-collapse border border-gray-100 dark:border-gray-800 min-w-[1400px]">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400 text-center">
                                            <th className="py-4 px-3 border-r border-gray-100 dark:border-gray-800 sticky left-0 z-20 bg-gray-50 dark:bg-gray-800 shadow-[2px_0_5px_rgba(0,0,0,0.05)] w-32">Kunlar \\ Vaqt</th>
                                            {timesList.map(time => (
                                                <th key={time} className="py-4 px-2 border-r border-gray-100 dark:border-gray-800 min-w-[120px]">{time}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {daysList.map(day => (
                                            <tr key={day} className="border-b border-gray-100 dark:border-gray-800 transition text-sm">
                                                <td className="py-4 px-4 font-bold text-gray-900 dark:text-white border-r border-gray-100 dark:border-gray-800 sticky left-0 z-10 bg-white dark:bg-gray-900 shadow-[2px_0_5px_rgba(0,0,0,0.05)] text-center">
                                                    {day}
                                                </td>
                                                {timesList.map(time => {
                                                    const schedule = schedules.find(s => {
                                                        const sDays = Array.isArray(s.days) ? s.days : [s.days];
                                                        return sDays.includes(day) && s.time === time;
                                                    });
                                                    
                                                    return (
                                                        <td key={time} className="p-2 border-r border-gray-100 dark:border-gray-800 relative group min-w-[130px] align-middle hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                                            {schedule ? (
                                                                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-3 border border-indigo-100 dark:border-indigo-800/50 flex flex-col h-full items-center justify-center relative shadow-sm">
                                                                    <span className="font-bold text-indigo-700 dark:text-indigo-400 text-center leading-snug">{schedule.group}</span>
                                                                    
                                                                    {/* Hover Actions */}
                                                                    <div className="absolute inset-0 bg-indigo-900/90 rounded-xl flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                        <button onClick={() => handleEditScheduleClick(schedule)} className="text-white hover:scale-110 transition-transform" title="Tahrirlash">
                                                                            <FaRegEye className="text-xl" />
                                                                        </button>
                                                                        <button onClick={() => setDeleteModalSchedule(schedule)} className="text-rose-400 hover:scale-110 transition-transform" title="O'chirish">
                                                                            <FaTrash className="text-lg" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div 
                                                                    className="w-full h-[60px] rounded-xl border-2 border-dashed border-transparent hover:border-gray-200 dark:hover:border-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                                                    onClick={() => {
                                                                        setEditingScheduleId(null)
                                                                        setNewScheduleGroup('')
                                                                        setNewScheduleDays([day])
                                                                        setNewScheduleTime(time)
                                                                        setShowAddScheduleModal(true)
                                                                    }}
                                                                >
                                                                    <span className="text-xs font-bold text-gray-400">+ qo'shish</span>
                                                                </div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>`;

content = content.replace(oldTableSection, newMatrixTable);

fs.writeFileSync(targetFile, content);
console.log("Matrix table refactoring complete.");
