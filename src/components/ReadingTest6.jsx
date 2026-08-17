import { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { readingTest6Answers as answerKey, passageTest6_1, passageTest6_2, passageTest6_3 } from "../data/readingTest6";

const ReadingTest6 = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
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
              Academic Reading Practice Test 6
            </h1>
            {submitted && (
              <div className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg">
                Score: {score} / 40
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          {/* LEFT SIDE - READING PASSAGES */}
          <div className="p-6 md:p-8 bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-200 dark:border-slate-700">
            <div className="prose dark:prose-invert max-w-none max-h-[50vh] lg:max-h-[75vh] overflow-y-auto overflow-x-hidden shadow-inner custom-scrollbar">
              
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black mb-2">READING PASSAGE 1</h2>
              </div>

              <div className="bg-white dark:bg-slate-800/80 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 mb-12">
                {passageTest6_1}
              </div>
              
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black mb-2">READING PASSAGE 2</h2>
              </div>

              <div className="bg-white dark:bg-slate-800/80 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 mb-12">
                {passageTest6_2}
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-black mb-2">READING PASSAGE 3</h2>
              </div>

              <div className="bg-white dark:bg-slate-800/80 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 mb-12">
                {passageTest6_3}
              </div>

            </div>
          </div>

          {/* RIGHT SIDE - QUESTIONS */}
          <div className="p-6 md:p-8 bg-white dark:bg-slate-800">
            
            {/* Questions 1-8 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 1–8<br/>Complete the sentences below using ONLY ONE WORD for each answer.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>1. Conducted poll in December says that most Americans are _______________ with the way that hing are going.</p>
                <p>2. Many people are angrier than a year ago, particulary _______________.</p>
                <p>3. The economical rates are decreasing, even though the country has recovered from the _______________.</p>
                <p>4. Billionaires and immigrants are the two sides of one political _______________.</p>
                <p>5. It is expected that the _______________ will be the biggest ethnic group to move in the USA by the year 2055.</p>
                <p>6. It has been an era of demographic, racial, cultural, religious and _______________ change.</p>
                <p>7. Roberto Suro says that migrants might become a _______________ of anger.</p>
                <p>8. Six to ten Americans believe that government has too much _______________.</p>
              </div>

              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-6 text-right">{q}.</span>
                    <input type="text" className={`w-48 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>

            {/* Questions 9-16 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 9–16<br/>Do the following statements agree with the information given in Reading Passage 1? Write TRUE, FALSE, or NOT GIVEN.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>9. The Congress has more responsibilities now than in 1970s.</p>
                <p>10. William Galston believes that the appeal of Donald Trump and Bernie Sanders is growing bigger each day.</p>
                <p>11. Ted Cruz is running as an anti-establishment candidate.</p>
                <p>12. The number of Americans who think that the US "stands above all other countries in the world" increased by 10% in 2014 compared to 2012.</p>
                <p>13. Since 9/11 there's been a feeling of war in America and it's still here.</p>
                <p>14. The Americans had the same reaction to the San Bernardino shooting as French to the Paris attacks.</p>
                <p>15. The ideological diversity between the Democrats and the Republicans is stronger than ever now.</p>
                <p>16. The pragmatic mass consists of a lot of young people.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[9, 10, 11, 12, 13, 14, 15, 16].map((q) => (
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

            {/* SECTION 2 */}
            
            {/* Questions 17-25 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 17–25<br/>Reading Passage 2 has nine paragraphs A-I. What paragraph has the following information? Write the correct letter, A-I.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>17. Possible damage</p>
                <p>18. Shocking news</p>
                <p>19. Mix of different studies</p>
                <p>20. Misleading information</p>
                <p>21. Types of e-cigarettes</p>
                <p>22. A place where the controversial research was written</p>
                <p>23. The defence of the article</p>
                <p>24. A research by an e-cigarette industry</p>
                <p>25. The consistent evidence</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[17, 18, 19, 20, 21, 22, 23, 24, 25].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-6 text-right">{q}.</span>
                    <select 
                      className={`w-20 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} 
                      value={answers[q] || ""} 
                      onChange={(e) => handleInputChange(q, e.target.value)} 
                      disabled={submitted}
                    >
                      <option value=""></option>
                      {['A','B','C','D','E','F','G','H','I'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>

            {/* Questions 26-28 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 26–28<br/>Choose the correct letter, A, B, C or D.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-4 font-medium">
                <div><p>26. New controversial research suggests that e-cigarettes:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. make it easier to quit smoking</li><li>B. make it harder to quit smoking</li><li>C. don't play a major role in quitting smoking</li><li>D. the research doesn't answer this question</li></ul></div>
                <div><p>27. Ann McNeill critisized the research because:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. the majority of other researches disagree with this review</li><li>B. the definition of e-cigarettes is a bit loose</li><li>C. some information is either inaccurate or misleading</li><li>D. the analysis mashed together some very different studies</li></ul></div>
                <div><p>28. This article aims at:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. finding the truth about e-cigarettes, providing facts</li><li>B. showing that the e-cigarettes are worthless</li><li>C. promoting the use of e-cigarettes</li><li>D. analyzing different scientific researches</li></ul></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[26, 27, 28].map((q) => (
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

            {/* SECTION 3 */}

            {/* Questions 29-35 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 29–35<br/>Who's responsible for what? Choose A, B, C or D.<br/>A: Stevie Wise, B: Mark Billige, C: Jemima Olchawski, D: Nobody from the above</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>29. Called a debate on the issue</p>
                <p>30. Launched the petition</p>
                <p>31. States that women are willing to pay more</p>
                <p>32. Says that women are more careful shoppers than men</p>
                <p>33. Says that companies should keep in mind gender equality while making products</p>
                <p>34. Was told that there are many problems with prices, especially with toys and clothes</p>
                <p>35. States that women are getting ripped off twice</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[29, 30, 31, 32, 33, 34, 35].map((q) => (
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

            {/* Questions 36-40 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 36–40<br/>Write TRUE, FALSE, or NOT GIVEN.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>36. "Pink tax" means that women are being charged more than men for the same products.</p>
                <p>37. Due to the fact that the petition gathered more than 43,000 signatures the issue has been raised in Parliament.</p>
                <p>38. After comparing the prices of 800 products., it was concluded that women's versions were 7% more expensive than men's.</p>
                <p>39. It is hard for the retailers to pretend that the gender price gap is an innocent mistake.</p>
                <p>40. If male and female products are situated in different sections, it makes it harder to examine the prices.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[36, 37, 38, 39, 40].map((q) => (
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

export default ReadingTest6;
