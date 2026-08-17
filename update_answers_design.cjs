const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.startsWith('ReadingTest') && f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  const regex = /\{\/\* ANSWERS TABLE \*\/\}[\s\S]*?<\/motion\.div>/;

  const newBlock = `{/* ANSWERS TABLE */}
          {submitted && (
            <div className="p-6 md:p-8 bg-slate-50/50 dark:bg-slate-800/20">
              <div className="flex flex-col items-center justify-center space-y-6">
                <button 
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="w-full md:w-auto px-8 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                >
                  {showAnswers ? "Javoblarni yashirish" : "To'g'ri javoblarni ko'rish"}
                </button>

                {showAnswers && (
                  <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                        <thead className="bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200">
                          <tr>
                            <th className="p-4 font-bold border-b border-slate-200 dark:border-slate-700 w-24 text-center">Savol</th>
                            <th className="p-4 font-bold border-b border-slate-200 dark:border-slate-700">To'g'ri javob(lar)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(answerKey).map((q) => (
                            <tr key={q} className="border-b last:border-0 border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                              <td className="p-4 font-bold bg-slate-50/50 dark:bg-slate-800/50 text-center border-r border-slate-100 dark:border-slate-700/50">{q}</td>
                              <td className="p-4 font-mono text-green-600 dark:text-green-400 font-medium tracking-wide">
                                {answerKey[q].join('  /  ')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>`;

  content = content.replace(regex, newBlock);
  fs.writeFileSync(filePath, content);
});

console.log('Updated answers table design.');
