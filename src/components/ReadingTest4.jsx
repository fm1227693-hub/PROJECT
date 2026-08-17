import { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { readingTest4Answers as answerKey, passageTest4_1, passageTest4_2, passageTest4_3 } from "../data/readingTest4";

const ReadingTest4 = () => {
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
              Academic Reading Practice Test 4
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
                {passageTest4_1}
              </div>
              
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black mb-2">READING PASSAGE 2</h2>
              </div>

              <div className="bg-white dark:bg-slate-800/80 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 mb-12">
                {passageTest4_2}
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-black mb-2">READING PASSAGE 3</h2>
              </div>

              <div className="bg-white dark:bg-slate-800/80 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 mb-12">
                {passageTest4_3}
              </div>

            </div>
          </div>

          {/* RIGHT SIDE - QUESTIONS */}
          <div className="p-6 md:p-8 bg-white dark:bg-slate-800">
            
            {/* Questions 1-5 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 1–5<br/>Do the following statements agree with the information given? Write TRUE, FALSE, or NOT GIVEN.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>1. You can have a specific smell even due to simple cold.</p>
                <p>2. Human sense of taste is 10,000 less sensetive than human sense of smell.</p>
                <p>3. Dogs and cats can sniff out different diseases.</p>
                <p>4. Doctors believe that different cancers might have the same specific smell.</p>
                <p>5. There are more than 20 dogs in the UK trained to detect cancer.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5].map((q) => (
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

            {/* Questions 6-9 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 6–9<br/>Choose the correct letter, A, B, C or D.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-4 font-medium">
                <div><p>6. All the studies suggest that dogs:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. Can be 93% accurate</li><li>B. Can detect very small tumours</li><li>C. Can't detect tumours at all</li><li>D. Different studies have shown different results</li></ul></div>
                <div><p>7. What scientists give dogs to detect cancer?</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. Urine samples</li><li>B. Bacterias</li><li>C. Different odours</li><li>D. Nothing</li></ul></div>
                <div><p>8. What's an electronic nose?</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. A specific tool for dogs</li><li>B. A gadget to diagnose diseases</li><li>C. A recovery tool for ill patients</li><li>D. An artificial nose</li></ul></div>
                <div><p>9. The main objective of this passage is to:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. Bring awareness to the cancer problem</li><li>B. Show us how good dogs are at detecting cancer</li><li>C. Show us how important it can be to be able to diagnose a disease by an odour</li><li>D. Tell us about new technologies</li></ul></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[6, 7, 8, 9].map((q) => (
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

            {/* Questions 10-12 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 10–12<br/>Complete the sentences below. Write NO MORE THAN TWO WORDS.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>10. Scientists hope that one day an _______________ will be on every desk.</p>
                <p>11. Electronic nose would help to detect the _______________.</p>
                <p>12. Dogs can _______________ a new way of diagnosing diseases.</p>
              </div>

              <div className="space-y-4">
                {[10, 11, 12].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-6 text-right">{q}.</span>
                    <input type="text" className={`w-48 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>


            {/* SECTION 2 */}
            
            {/* Questions 13-16 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 13–16<br/>Reading Passage 2 has four paragraphs A-D. Which paragraph contains what information? Write the correct letter, A-D.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium">
                <p>13. Questions about the Roman economy</p>
                <p>14. A unique feature</p>
                <p>15. Description of the dump</p>
                <p>16. Dialogue with a professor</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[13, 14, 15, 16].map((q) => (
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

            {/* Questions 17-21 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 17–21<br/>Write TRUE, FALSE, or NOT GIVEN.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>17. World's biggest garbage dump is surrounded by restaurants and nightclubs.</p>
                <p>18. The garbage dump is as popular as the Colosseum in Rome.</p>
                <p>19. Ancient Roman economy depended on oil.</p>
                <p>20. There is no information on how many amphoras are there.</p>
                <p>21. Remesal says that Monte Testaccio is a great place to study economics.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[17, 18, 19, 20, 21].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-8 text-right">{q}.</span>
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

            {/* Questions 22-26 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 22–26<br/>Complete the sentences below. Write NO MORE THAN THREE WORDS.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>22. It is unknown for _______________ what's underneath the grass, dust, and scattering of trees.</p>
                <p>23. Monte Testaccio stands near the ancient Rome's _______________.</p>
                <p>24. Remesal doesn't believe that the whole mountain is made of _______________ without any soil or rubble.</p>
                <p>25. Remesal's team washes and sorts thousands of amphoras each year's two-week _______________.</p>
                <p>26. _______________ started working at Monte Testaccio in the late 19th century.</p>
              </div>

              <div className="space-y-4">
                {[22, 23, 24, 25, 26].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-8 text-right">{q}.</span>
                    <input type="text" className={`w-48 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3 */}

            {/* Questions 27-34 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 27–34<br/>Complete the sentences below. Write NO MORE THAN TWO WORDS.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>27. One of the greatest mysteries in science is the nature of the _______________.</p>
                <p>28. All known material have been mostly _______________ as candidates for dark matter.</p>
                <p>29. Dark matter is a lot more _______________ than normal matter.</p>
                <p>30. Due to high temperature, both ordinary and dark matter were 'melted' in a _______________.</p>
                <p>31. Quarks are confined within protons and neutrons by the so-called _______________.</p>
                <p>32. Stealth dark matter particles themselves would only have a _______________.</p>
                <p>33. Experiments at the LHC may soon find _______________ of, or rule out, this new stealth dark matter theory.</p>
                <p>34. To answer questions we require _______________ resources.</p>
              </div>

              <div className="space-y-4">
                {[27, 28, 29, 30, 31, 32, 33, 34].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-8 text-right">{q}.</span>
                    <input type="text" className={`w-48 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>

            {/* Questions 35-39 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 35–39<br/>Write TRUE, FALSE, or NOT GIVEN.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>35. The nature of dark matter is a mystery.</p>
                <p>36. It is likely that dark matter consists of ordinary materials.</p>
                <p>37. Quarks have neither positive nor negative charge.</p>
                <p>38. Protons are not stable.</p>
                <p>39. Dark matter has a serious impact on the cosmos.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[35, 36, 37, 38, 39].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-8 text-right">{q}.</span>
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

            {/* Question 40 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Question 40<br/>Choose the correct letter, A, B, C or D.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-4 font-medium">
                <div>
                  <p>40. Passage 3 is:</p>
                  <ul className="pl-6 list-disc text-sm mt-1 text-slate-500">
                    <li>A. a scientific article</li>
                    <li>B. a sci-fi article</li>
                    <li>C. a short sketch</li>
                    <li>D. an article from a magazine</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold w-8 text-right">40.</span>
                <select 
                  className={`w-20 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(40)}`} 
                  value={answers[40] || ""} 
                  onChange={(e) => handleInputChange(40, e.target.value)} 
                  disabled={submitted}
                >
                  <option value=""></option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
                {renderFeedback(40)}
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

export default ReadingTest4;
