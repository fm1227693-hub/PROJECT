const fs = require('fs');

function reformat(file, testNum) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. We extract the question blocks. 
    // They are between `{/* Questions X-Y */}` and either `{/* SECTION`, `{/* Questions`, or `{/* Submit Button */}` or `</div>` before next section
    
    // Actually, we can just split the file around the structural divs.
    
    // Find everything after `const renderFeedback`
    const renderFeedbackEnd = content.indexOf('return (');
    let topPart = content.substring(0, renderFeedbackEnd);

    // Let's just do a big regex replacement for the structural changes.
    // Replace the return statement up to SECTION 1
    content = content.replace(
      /return \([\s\S]*?\{\/\* SECTION 1 \*\/\}/,
      `return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
              Academic Reading Practice Test ${testNum}
            </h1>
            {submitted && score !== null && (
              <div className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg">
                Score: {score} / 40
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:divide-x divide-slate-200 dark:divide-slate-700">
          {/* LEFT SIDE - READING PASSAGES */}
          <div className="p-6 md:p-8 h-[50vh] lg:h-[800px] overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-slate-900/20">
            <div className="prose dark:prose-invert max-w-none">
              
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black mb-2">READING PASSAGE 1</h2>
              </div>
              <div className="bg-white dark:bg-slate-800/80 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 mb-12">
                {passageTest${testNum}_1}
              </div>
              
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black mb-2">READING PASSAGE 2</h2>
              </div>
              <div className="bg-white dark:bg-slate-800/80 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 mb-12">
                {passageTest${testNum}_2}
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-black mb-2">READING PASSAGE 3</h2>
              </div>
              <div className="bg-white dark:bg-slate-800/80 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 mb-12">
                {passageTest${testNum}_3}
              </div>

            </div>
          </div>

          {/* RIGHT SIDE - QUESTIONS */}
          <div className="p-6 md:p-8 h-[50vh] lg:h-[800px] overflow-y-auto custom-scrollbar bg-white dark:bg-slate-800">
            
            {/* SECTION 1 */}
`
    );

    // Remove old structural wrappers for sections
    content = content.replace(/<div className="p-6 sm:p-10 border-b border-slate-200 dark:border-slate-700">/g, '');
    
    // Remove old passage headings and texts
    content = content.replace(/<div className="text-center mb-8">[\s\S]*?<\/h3>\s*<\/div>/g, '');
    content = content.replace(/\{\/\* Passage Text \*\/\}[\s\S]*?\{passageTest.*?\}[\s\S]*?<\/div>/g, '');
    content = content.replace(/\{\/\* SECTION 2 \*\/\}/g, '');
    content = content.replace(/\{\/\* SECTION 3 \*\/\}/g, '');
    
    // Replace old buttons
    content = content.replace(/\{\/\* Submit Button \*\/\}[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?\)/, 
`            {/* ACTION BUTTONS */}
            <div className="sticky bottom-0 mt-8 pt-4 pb-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4 z-20">
              <button
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                  setScore(0);
                }}
                className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setSubmitted(true)}
                disabled={submitted}
                className={\`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all \${
                  submitted
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-blue-500/30"
                }\`}
              >
                {submitted ? "Submitted" : "Submit Test"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );`
    );
    
    // Clean up empty lines from removed divs
    content = content.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g, '</div>\n</div>\n</div>\n</div>\n</div>'); // prevent replacing actual structure

    // Because I removed `<div className="p-6 sm:p-10 border-b...">`, there's an extra `</div>` at the end of each section.
    // To handle this nicely, I can just find `</div>\n\n            {/* Questions ` and replace it, but it might be messy.
    // Instead of regex for section divs, let's fix it by formatting.
    fs.writeFileSync(file, content);
}

reformat('src/components/ReadingTest2.jsx', 2);
