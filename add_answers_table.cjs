const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.startsWith('ReadingTest') && f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. Add state variable if not exists
  if (!content.includes('setShowAnswers')) {
    content = content.replace(
      /const \[submitted, setSubmitted\] = useState\(false\);/,
      `const [submitted, setSubmitted] = useState(false);\n  const [showAnswers, setShowAnswers] = useState(false);`
    );
  }

  // 2. Hide inline answers on mobile
  content = content.replace(
    /<span className="text-xs text-slate-500 font-mono">/g,
    `<span className="hidden md:inline ml-1 text-xs text-slate-500 font-mono">`
  );

  // 3. Add the answers table after the Clear All / Submit Test buttons div
  if (!content.includes("Javoblarni ko'rish")) {
    content = content.replace(
      /<\/button>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/motion\.div>/,
      `</button>
          </div>

          {/* ANSWERS TABLE */}
          {submitted && (
            <div className="p-6 md:p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30">
              <button 
                onClick={() => setShowAnswers(!showAnswers)}
                className="w-full md:w-auto px-6 py-3 rounded-xl font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                {showAnswers ? "Javoblarni yashirish" : "Javoblarni ko'rish"}
              </button>

              {showAnswers && (
                <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200">
                      <tr>
                        <th className="p-4 font-bold border-b border-slate-200 dark:border-slate-700 w-24">Savol</th>
                        <th className="p-4 font-bold border-b border-slate-200 dark:border-slate-700">To'g'ri javob(lar)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(answerKey).map((q) => (
                        <tr key={q} className="border-b last:border-0 border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-4 font-bold bg-slate-50 dark:bg-slate-800/20">{q}</td>
                          <td className="p-4 font-mono text-green-700 dark:text-green-400 font-medium">
                            {answerKey[q].join(' / ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>`
    );
  }

  fs.writeFileSync(filePath, content);
});

console.log('Done injecting answers table.');
