const fs = require('fs');

const targetFile = 'src/components/AdminORG.jsx';
let content = fs.readFileSync(targetFile, 'utf-8');

// 1. Add FaUser import
const oldImports = `FaGlobe, FaShieldAlt, FaExclamationTriangle, FaRegEye, FaEnvelope, FaUserEdit, FaUserPlus, FaCamera, FaPen, FaUserCircle`;
const newImports = `FaGlobe, FaShieldAlt, FaExclamationTriangle, FaRegEye, FaEnvelope, FaUserEdit, FaUserPlus, FaCamera, FaPen, FaUserCircle, FaUser`;
content = content.replace(oldImports, newImports);

// 2. Replace emojis in Modal
const oldErkakEmoji = `                                <div className={\`w-20 h-20 rounded-full flex items-center justify-center text-5xl bg-blue-50 dark:bg-blue-900/20 border-2 \${newStudentGender === 'erkak' ? 'border-blue-500 shadow-md' : 'border-transparent'}\`}>
                                    👨‍🎓
                                </div>`;
const newErkakIcon = `                                <div className={\`w-20 h-20 rounded-full flex items-center justify-center text-4xl bg-blue-50 dark:bg-blue-900/20 border-2 \${newStudentGender === 'erkak' ? 'border-blue-500 shadow-md text-blue-500' : 'border-transparent text-gray-400'}\`}>
                                    <FaUser />
                                </div>`;
content = content.replace(oldErkakEmoji, newErkakIcon);

const oldAyolEmoji = `                                <div className={\`w-20 h-20 rounded-full flex items-center justify-center text-5xl bg-pink-50 dark:bg-pink-900/20 border-2 \${newStudentGender === 'ayol' ? 'border-pink-500 shadow-md' : 'border-transparent'}\`}>
                                    👩‍🎓
                                </div>`;
const newAyolIcon = `                                <div className={\`w-20 h-20 rounded-full flex items-center justify-center text-4xl bg-pink-50 dark:bg-pink-900/20 border-2 \${newStudentGender === 'ayol' ? 'border-pink-500 shadow-md text-pink-500' : 'border-transparent text-gray-400'}\`}>
                                    <FaUser />
                                </div>`;
content = content.replace(oldAyolEmoji, newAyolIcon);

// 3. Replace emojis in List
const oldListEmoji = `<div className="w-16 h-16 rounded-full shrink-0 bg-gray-50 dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 flex items-center justify-center text-4xl shadow-sm">
                                            {student.gender === 'ayol' ? '👩‍🎓' : '👨‍🎓'}
                                        </div>`;
const newListIcon = `<div className={\`w-16 h-16 rounded-full shrink-0 border-2 border-gray-100 dark:border-gray-600 flex items-center justify-center text-3xl shadow-sm \${student.gender === 'ayol' ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-500' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'}\`}>
                                            <FaUser />
                                        </div>`;
content = content.replace(oldListEmoji, newListIcon);

fs.writeFileSync(targetFile, content);
console.log("Emoji replacement complete.");
