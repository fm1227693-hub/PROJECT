import { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { readingTest5Answers as answerKey, passageTest5_1, passageTest5_2, passageTest5_3 } from "../data/readingTest5";

const ReadingTest5 = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleInputChange = (questionNumber, value) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionNumber]: value,
    }));
  };

  const calculateScore = () => {
    let currentScore = 0;
    Object.keys(answerKey).forEach((key) => {
      const userAnswer = (answers[key] || "").toString().trim().toLowerCase();
      const validAnswers = answerKey[key].map((ans) => ans.toString().toLowerCase().trim());
      if (validAnswers.includes(userAnswer)) currentScore += 1;
    });
    setScore(currentScore);
    setSubmitted(true);
  };

  const getStatusClass = (questionNumber) => {
    if (!submitted) return "border-slate-300 dark:border-slate-600 focus:border-blue-500";
    
    const userAnswer = (answers[questionNumber] || "").toString().trim().toLowerCase();
    const validAnswers = answerKey[questionNumber].map((ans) => ans.toString().toLowerCase().trim());
    const isCorrect = validAnswers.includes(userAnswer);
    
    return isCorrect 
      ? "border-green-500 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-bold"
      : "border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400";
  };

  const renderFeedback = (questionNumber) => {
    if (!submitted) return null;
    
    const userAnswer = (answers[questionNumber] || "").toString().trim().toLowerCase();
    const validAnswers = answerKey[questionNumber].map((ans) => ans.toString().toLowerCase().trim());
    const isCorrect = validAnswers.includes(userAnswer);

    if (isCorrect) {
      return <FaCheckCircle className="text-green-500 ml-2 shrink-0" />;
    } else {
      return (
        <div className="flex items-center ml-2 shrink-0">
          <FaTimesCircle className="text-red-500" />
          <span className="ml-2 text-sm font-medium text-red-600 dark:text-red-400">
            {answerKey[questionNumber][0]}
          </span>
        </div>
      );
    }
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
              Academic Reading Practice Test 5
            </h1>
            {submitted && (
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
                {passageTest5_1}
              </div>
              
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black mb-2">READING PASSAGE 2</h2>
              </div>

              <div className="bg-white dark:bg-slate-800/80 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 mb-12">
                {passageTest5_2}
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-black mb-2">READING PASSAGE 3</h2>
              </div>

              <div className="bg-white dark:bg-slate-800/80 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 mb-12">
                {passageTest5_3}
              </div>

            </div>
          </div>

          {/* RIGHT SIDE - QUESTIONS */}
          <div className="p-6 md:p-8 h-[50vh] lg:h-[800px] overflow-y-auto custom-scrollbar bg-white dark:bg-slate-800">
            
            {/* Questions 1-8 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 1–8<br/>Reading Passage 1 has eight paragraphs, A-H. What paragraph has the following information? Write the correct letter, A-H.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>1. Possible explanation of the differences between parts of the mountain</p>
                <p>2. Size data</p>
                <p>3. A new way of looking</p>
                <p>4. Problem with sharks</p>
                <p>5. Uncertainty of the anomalies</p>
                <p>6. Equipment which measures magnetic fields</p>
                <p>7. The start of making maps</p>
                <p>8. A working theory</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-6 text-right">{q}.</span>
                    <select 
                      className={`w-20 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} 
                      value={answers[q] || ""} 
                      onChange={(e) => handleInputChange(q, e.target.value)} 
                      disabled={submitted}
                    >
                      <option value=""></option>
                      {['A','B','C','D','E','F','G','H'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>

            {/* Questions 9-12 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 9–12<br/>Complete the sentences using NO MORE THAN TWO WORDS.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>9. A large plume of _______________ rock may have contributed additional heat and material.</p>
                <p>10. Tamu Massif is a _______________, or shield volcano.</p>
                <p>11. Replacing the device with a _______________ didn't help, as that unit was nearly ripped off by more sharks.</p>
                <p>12. Sager believes that the magnetic anomalies were caused by something more than _______________ from the ridges.</p>
              </div>

              <div className="space-y-4">
                {[9, 10, 11, 12].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-6 text-right">{q}.</span>
                    <input type="text" className={`w-48 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2 */}
            
            {/* Questions 13-20 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 13–20<br/>Write TRUE, FALSE, or NOT GIVEN.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>13. AIDS were first encountered 35 years ago.</p>
                <p>14. The most important role in developing AIDS as a pandemia was played by sex workers.</p>
                <p>15. It is believed that HIV appeared out of nowhere.</p>
                <p>16. Humans are not closely related to monkey.</p>
                <p>17. HIV-1 group O originated in 1920s.</p>
                <p>18. HIV-1 group M has something special.</p>
                <p>19. Human DNA evolves approximately 1 million times slower than HIV.</p>
                <p>20. Scientists believe that HIV already existed in 1920s.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[13, 14, 15, 16, 17, 18, 19, 20].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-6 text-right">{q}.</span>
                    <select 
                      className={`w-32 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} 
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

            {/* Questions 21-28 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 21–28<br/>Complete the sentences below. Write NO MORE THAN TWO WORDS.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>21. Scientists can place the origin of _______________ in a specific city.</p>
                <p>22. Kinshasa was a very _______________ for young working men and many others willing to spend their money.</p>
                <p>23. In just 20 years virus managed to _______________ to cities 900 miles away.</p>
                <p>24. Belgian Congo became an attractive source of employment to French speakers when it gained _______________.</p>
                <p>25. HIV has spread quickly through the US and Europe because of the _______________.</p>
                <p>26. It is said that outbreak in Indiana was associated with _______________.</p>
                <p>27. The same approach as for HIV can work for _______________.</p>
                <p>28. The form of gonorrhoea that is drug-resistant appeared to have _______________ in men who have sex with men.</p>
              </div>

              <div className="space-y-4">
                {[21, 22, 23, 24, 25, 26, 27, 28].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-6 text-right">{q}.</span>
                    <input type="text" className={`w-48 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3 */}

            {/* Questions 29-33 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 29–33<br/>Choose the correct letter, A, B, C or D.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-4 font-medium">
                <div><p>29. Penguins stay ice free due to:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. A combination of nano-sized pores</li><li>B. An extra water repelling preening oil</li><li>C. A combination of nano-sized pores and an extra water repelling preening oil</li><li>D. A combination of various factors</li></ul></div>
                <div><p>30. Antarctic penguins experience extreme weather conditions, including:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. Low temperature, that can drop to -40</li><li>B. Severe wind, up to 40 metres per second</li><li>C. Below zero water temperature</li><li>D. All of the above</li></ul></div>
                <div><p>31. In line 5 words engineering marvels mean:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. That penguins are very intelligent</li><li>B. That penguins are good swimmers</li><li>C. That penguis are well prepared to living in severe conditions</li><li>D. Both B and C</li></ul></div>
                <div><p>32. Penguis feather has everything, EXCEPT:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. Hydrophobic properties</li><li>B. Extra ice repelling</li><li>C. Soft structures</li><li>D. Oil structures</li></ul></div>
                <div><p>33. The gentoo penguin:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. Is less superhydrophobic compared to the Magellanic penguin</li><li>B. Has feathers that contain tiny pores</li><li>C. Can't swim</li><li>D. Lives in Argentinian desert</li></ul></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[29, 30, 31, 32, 33].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-6 text-right">{q}.</span>
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

            {/* Questions 34-40 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 34–40<br/>Complete the sentences below. Write ONLY ONE WORD from the passage.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>34. Formations like _______________ could provide geometry that delays ice formation.</p>
                <p>35. The delay in freezing is dictated by the _______________ of the droplet.</p>
                <p>36. Penguins in Antarctic are highly evolved to be able to cope with _______________ conditions.</p>
                <p>37. Penguins are insulated by a _______________ layer of fat.</p>
                <p>38. On the land, penguins appear much more _______________ than in the sea.</p>
                <p>39. The inspiration came to Kavehpour after watching a _______________ about penguins.</p>
                <p>40. Kavehpour would like to see _______________ surfaces which minimise frost formation.</p>
              </div>

              <div className="space-y-4">
                {[34, 35, 36, 37, 38, 39, 40].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-6 text-right">{q}.</span>
                    <input type="text" className={`w-48 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>


            {/* ACTION BUTTONS */}
            <div className="mt-8 pt-4 pb-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-4">
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
                onClick={calculateScore}
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
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReadingTest5;
