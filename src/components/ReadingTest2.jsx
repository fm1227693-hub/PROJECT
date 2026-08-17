import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { readingTest2Answers as answerKey } from "../data/readingTest2";
import { passageTest2_1, passageTest2_2, passageTest2_3 } from "../data/readingPassages";

export default function ReadingTest2() {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleInputChange = (qNum, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qNum]: value,
    }));
  };

  const calculateScore = () => {
    let currentScore = 0;
    Object.keys(answerKey).forEach((qNum) => {
      const validAnswers = answerKey[qNum].map((ans) => ans.toString().toLowerCase().trim());
      const userAnswer = (answers[qNum] || "").toString().toLowerCase().trim();

      if (validAnswers.includes(userAnswer)) {
        currentScore++;
      }
    });

    setScore(currentScore);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusClass = (qNum) => {
    if (!submitted) return "border-slate-300 dark:border-slate-600 focus:border-red-500";
    
    const validAnswers = answerKey[qNum].map((ans) => ans.toString().toLowerCase().trim());
    const userAnswer = (answers[qNum] || "").toString().toLowerCase().trim();
    const isCorrect = validAnswers.includes(userAnswer);

    return isCorrect
      ? "border-green-500 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-bold"
      : "border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400";
  };

  const renderFeedback = (qNum) => {
    if (!submitted) return null;
    
    const validAnswers = answerKey[qNum].map((ans) => ans.toString().toLowerCase().trim());
    const userAnswer = (answers[qNum] || "").toString().toLowerCase().trim();
    const isCorrect = validAnswers.includes(userAnswer);

    return (
      <span className="ml-2 inline-flex items-center gap-2">
        {isCorrect ? (
          <FaCheckCircle className="text-green-500" />
        ) : (
          <span className="flex items-center gap-2">
            <FaTimesCircle className="text-red-500" />
            <span className="hidden md:inline ml-1 text-xs text-slate-500 font-mono">
              ({answerKey[qNum][0]})
            </span>
          </span>
        )}
      </span>
    );
  };

    return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
              Academic Reading Practice Test 2
            </h1>
            {submitted && score !== null && (
              <div className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg">
                Score: {score} / 40
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">

          {/* ═══════════════ PASSAGE 1 + Q1-16 ═══════════════ */}
          <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black mb-1">READING PASSAGE 1</h2>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Questions 1–16</p>
            </div>

            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 prose dark:prose-invert max-w-none max-h-[50vh] lg:max-h-[75vh] overflow-y-auto overflow-x-hidden shadow-inner custom-scrollbar">
              {passageTest2_1}
            </div>

            {/* Questions 1-7 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 1–7<br/>Do the following statements agree with the information in the IELTS reading text?<br/>Write TRUE, FALSE, or NOT GIVEN.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
              <p>1. Matthias Classen is unsure about the possibility of monster's existence.</p>
              <p>2. Kraken is probably based on an imaginary animal.</p>
              <p>3. Previous attempts on filming the squid had failed due to the fact that the creature was scared.</p>
              <p>4. Giant squid was caught alive in 2004 and brought to the museum.</p>
              <p>5. Jon Ablett admits that he likes Archie.</p>
              <p>6. According to Classen, people can be scared both by imaginary and real monsters.</p>
              <p>7. Werner Herzog suggests that Kraken is essential to the ocean.</p>
            </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6, 7].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-6 text-right">{q}.</span>
                    <select 
                      className={`w-40 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} 
                      value={answers[q] || ""} 
                      onChange={(e) => handleInputChange(q, e.target.value)} 
                      disabled={submitted}
                    >
                      <option value=""></option>
                      <option value="TRUE">TRUE</option>
                      <option value="FALSE">FALSE</option>
                      <option value="NOT GIVEN">NOT GIVEN</option>
                    </select>
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>

            {/* Questions 8-12 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 8–12<br/>Choose the correct letter, A, B, C or D.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-4 font-medium">
              <div><p>8. Who wrote a novel about a giant squid?</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. Emily Alder</li><li>B. Stephen King</li><li>C. Alfred Lord Tennyson</li><li>D. Jules Verne</li></ul></div>
              <div><p>9. What, of the featuring body parts, mollusc DOESN'T have?</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. two tentacles</li><li>B. serrated suckers</li><li>C. beak</li><li>D. smooth suckers</li></ul></div>
              <div><p>10. Which of the following applies to the bookish Kraken?</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. notorious</li><li>B. scary</li><li>C. weird</li><li>D. harmless</li></ul></div>
              <div><p>11. Where can we see a giant squid?</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. at the museum</li><li>B. at a seaside</li><li>C. on TV</li><li>D. in supermarkets</li></ul></div>
              <div><p>12. The main purpose of the text is to:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. help us to understand more about both mythical and biological creatures of the deep</li><li>B. illustrate the difference between Kraken and squid</li><li>C. shed the light on the mythical creatures of the ocean</li><li>D. compare Kraken to its real relative</li></ul></div>
            </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[8, 9, 10, 11, 12].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-8 text-right">{q}.</span>
                    <select 
                      className={`w-20 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} 
                      value={answers[q] || ""} 
                      onChange={(e) => handleInputChange(q, e.target.value)} 
                      disabled={submitted}
                    >
                      <option value=""></option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>

            {/* Questions 13-16 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 13–16<br/>Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
              <p>13. According to the Victor Hugo's novel, the squid would ________________ if he had such opportunity.</p>
              <p>14. The real squid appeared to be ________________ and ________________.</p>
              <p>15. Archie must be the ________________ of its kind on Earth.</p>
              <p>16. We are able to encounter the Kraken's ________________ in a movie franchise.</p>
            </div>

              <div className="space-y-4">
                {[13, 14, 15, 16].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-8 text-right">{q}.</span>
                    <input type="text" className={`flex-1 max-w-sm px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════════ PASSAGE 2 + Q17-27 ═══════════════ */}
          <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black mb-1">READING PASSAGE 2</h2>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Questions 17–27</p>
            </div>

            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 prose dark:prose-invert max-w-none max-h-[50vh] lg:max-h-[75vh] overflow-y-auto overflow-x-hidden shadow-inner custom-scrollbar">
              {passageTest2_2}
            </div>

            {/* Questions 17-25 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 17–25<br/>Match the headings below with the paragraphs. Write ONE LETTER A-I.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium">
                <p>17. Scientific success</p>
                <p>18. Worsening relations</p>
                <p>19. The dawn of the new project</p>
                <p>20. Churchill's confusion</p>
                <p>21. Different perspectives</p>
                <p>22. Horrifying prediction</p>
                <p>23. Leaving Britain behind</p>
                <p>24. Long-lasting friendship</p>
                <p>25. The realization of the consequences</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[17, 18, 19, 20, 21, 22, 23, 24, 25].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-6 text-right">{q}.</span>
                    <input type="text" maxLength={1} className={`w-12 px-2 py-1 text-center bg-white dark:bg-slate-800 border-2 rounded-lg outline-none uppercase transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>

            {/* Questions 26-27 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 26–27<br/>Choose the correct letter, A, B, C or D.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-4 font-medium">
                <div><p>26. How can you describe the relations between Churchill and Wells throughout the years?</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. passionate – friendly – adverse</li><li>B. curious – friendly</li><li>C. respectful – friendly – inhospitable</li><li>D. friendly – respectful – hostile</li></ul></div>
                <div><p>27. What is the type of this text?</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. science-fiction story</li><li>B. article from the magazine</li><li>C. historical text</li><li>D. Wells autobiography</li></ul></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[26, 27].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-8 text-right">{q}.</span>
                    <select 
                      className={`w-20 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} 
                      value={answers[q] || ""} 
                      onChange={(e) => handleInputChange(q, e.target.value)} 
                      disabled={submitted}
                    >
                      <option value=""></option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════════ PASSAGE 3 + Q28-40 ═══════════════ */}
          <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black mb-1">READING PASSAGE 3</h2>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Questions 28–40</p>
            </div>

            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 prose dark:prose-invert max-w-none max-h-[50vh] lg:max-h-[75vh] overflow-y-auto overflow-x-hidden shadow-inner custom-scrollbar">
              {passageTest2_3}
            </div>

            {/* Questions 28-31 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 28–31<br/>Choose the correct letter, A, B, C or D.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-4 font-medium">
                <div><p>28. According to the first paragraph, what is the writer's main point?</p></div>
                <div><p>29. What does the writer suggest in the second paragraph?</p></div>
                <div><p>30. The writer uses the example to illustrate:</p></div>
                <div><p>31. In the final paragraph, the writer concludes that:</p></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[28, 29, 30, 31].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-8 text-right">{q}.</span>
                    <select 
                      className={`w-24 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} 
                      value={answers[q] || ""} 
                      onChange={(e) => handleInputChange(q, e.target.value)} 
                      disabled={submitted}
                    >
                      <option value=""></option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>

            {/* Questions 32-36 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 32–36<br/>Complete the sentences below. Write ONE WORD ONLY from the passage.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>32. The research was supported by leading ________________ in the field.</p>
                <p>33. One significant ________________ of the approach was discussed.</p>
                <p>34. They decided to implement a ________________ method.</p>
                <p>35. The main ________________ was difficult to resolve.</p>
                <p>36. Critics continue to ________________ upon this practice.</p>
              </div>

              <div className="space-y-4">
                {[32, 33, 34, 35, 36].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-8 text-right">{q}.</span>
                    <input type="text" className={`flex-1 max-w-sm px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>

            {/* Questions 37-40 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 37–40<br/>Do the following statements agree with the information given? Write TRUE, FALSE or NOT GIVEN.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>37. The initial predictions were accurate.</p>
                <p>38. Most participants agreed with the findings.</p>
                <p>39. The study received funding from the government.</p>
                <p>40. The researchers plan to repeat the experiment next year.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[37, 38, 39, 40].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-6 text-right">{q}.</span>
                    <select 
                      className={`w-40 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} 
                      value={answers[q] || ""} 
                      onChange={(e) => handleInputChange(q, e.target.value)} 
                      disabled={submitted}
                    >
                      <option value=""></option>
                      <option value="TRUE">TRUE</option>
                      <option value="FALSE">FALSE</option>
                      <option value="NOT GIVEN">NOT GIVEN</option>
                    </select>
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="p-6 md:p-8 flex justify-end gap-4">
            <button
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
                setScore(null);
              }}
              className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => {
                  let s = 0;
                  Object.keys(answerKey).forEach((key) => {
                    const validAnswers = answerKey[key].map((ans) => ans.toString().toLowerCase().trim());
                    const userAnswer = (answers[key] || "").toString().toLowerCase().trim();
                    if (validAnswers.includes(userAnswer)) s++;
                  });
                  setScore(s);
                  setSubmitted(true);
              }}
              disabled={submitted}
              className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
                submitted
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-blue-500/30"
              }`}
            >
              {submitted ? "Submitted" : "Submit Test"}
            </button>
          </div>

          {/* ANSWERS TABLE */}
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
    </motion.div>
  );
}
