const fs = require('fs');

const targetFile = 'src/components/AdminORG.jsx';
let content = fs.readFileSync(targetFile, 'utf-8');

const oldPhoneInput = `<div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Telefon raqami</label>
                            <input type="text" value={newStudentPhone} onChange={(e) => setNewStudentPhone(e.target.value)} placeholder="+998 90 123 45 67" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 text-gray-900 dark:text-white transition-colors" required />
                        </div>`;

const newPhoneInput = `<div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">Telefon raqami</label>
                            <div className="flex w-full bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl focus-within:border-indigo-500 transition-colors overflow-hidden">
                                <div className="px-4 py-3 bg-gray-100/50 dark:bg-gray-800/50 border-r border-gray-100 dark:border-gray-800 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300 text-sm">
                                    +998
                                </div>
                                <input type="text" value={newStudentPhone} onChange={(e) => {
                                    // Barcha raqam bo'lmagan belgilarni olib tashlaymiz
                                    let val = e.target.value.replace(/\\D/g, '');
                                    
                                    // 9 tadan ortiq raqam kiritilishiga yo'l qo'ymaymiz
                                    if(val.length > 9) val = val.substring(0, 9);
                                    
                                    // Formatlash: (XX) XXX-XX-XX
                                    let formatted = '';
                                    if(val.length > 0) {
                                        formatted += '(' + val.substring(0, 2);
                                    }
                                    if(val.length >= 3) {
                                        formatted += ') ' + val.substring(2, 5);
                                    }
                                    if(val.length >= 6) {
                                        formatted += '-' + val.substring(5, 7);
                                    }
                                    if(val.length >= 8) {
                                        formatted += '-' + val.substring(7, 9);
                                    }
                                    
                                    setNewStudentPhone(formatted);
                                }} placeholder="(90) 123-45-67" className="flex-1 px-4 py-3 bg-transparent text-sm font-medium focus:outline-none text-gray-900 dark:text-white" required />
                            </div>
                        </div>`;

content = content.replace(oldPhoneInput, newPhoneInput);

fs.writeFileSync(targetFile, content);
console.log("Phone input format updated successfully.");
