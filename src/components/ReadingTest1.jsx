import React, { useState } from "react";
import CdiReadingLayout from "./CdiReadingLayout";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { readingTest1Answers as answerKey } from "../data/readingTest1";
import { passage1, passage2, passage3 } from "../data/readingPassages";

export default function ReadingTest1({ onExit }) {
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
    <CdiReadingLayout
      onExit={onExit}
      testTitle="Practice Test 1"
      parts={[
        {
          id: 1,
          title: "Part 1",
          passage: passage1,
          questions: (
            <div className="space-y-10 pb-20">
              {/* Questions 1-8 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 1–8<br/>Do the following statements agree with the information in the IELTS reading text?<br/>Write TRUE, FALSE, or NOT GIVEN.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>1. Aphantasia is a condition, which describes people, for whom it is hard to visualise mental images.</p>
                <p>2. Niel Kenmuir was unable to count sheep in his head.</p>
                <p>3. People with aphantasia struggle to remember personal traits and clothes of different people.</p>
                <p>4. Niel regrets that he cannot portray an image of his fiancee in his mind.</p>
                <p>5. Inability to picture things in someone's head is often a cause of distress for a person.</p>
                <p>6. All people with aphantasia start to feel 'isolated' or 'alone' at some point of their lives.</p>
                <p>7. Lauren Beard's career depends on her imagination.</p>
                <p>8. The author met Lauren Beard when she was working on a comedy scene in her next book.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((q) => (
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

            {/* Questions 9-13 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 9–13<br/>Complete the sentences below.<br/>Write NO MORE THAN TWO WORDS from the passage for each answer.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>9. Only a small fraction of people have imagination as ________________ as Lauren does.</p>
                <p>10. Hyperphantasia is ________________ to aphantasia.</p>
                <p>11. There are a lot of subjectivity in comparing people's imagination - somebody's vivid scene could be another person's ________________.</p>
                <p>12. Prof Zeman is ________________ that aphantasia is not an illness.</p>
                <p>13. Many people spend their lives with ________________ somewhere in the mind's eye.</p>
              </div>

              <div className="space-y-4">
                {[9, 10, 11, 12, 13].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-8 text-right">{q}.</span>
                    <input type="text" className={`flex-1 max-w-sm px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>
            </div>
          )
        },
        {
          id: 2,
          title: "Part 2",
          passage: passage2,
          questions: (
            <div className="space-y-10 pb-20">
              {/* Questions 14-21 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 14–21<br/>Match the headings below with the paragraphs.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium">
                <p>14. Jailbreak with creative thinking</p>
                <p>15. Five common traits among rule-breakers</p>
                <p>16. Comparison between criminals and traditional businessmen</p>
                <p>17. Can drug baron's espace teach legitimate corporations?</p>
                <p>18. Great entrepreneur</p>
                <p>19. How criminal groups deceive the law</p>
                <p>20. The difference between legal and illegal organisations</p>
                <p>21. Similarity between criminals and start-up founders</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[14, 15, 16, 17, 18, 19, 20, 21].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-6 text-right">{q}.</span>
                    <input type="text" maxLength={1} className={`w-16 px-3 py-2 text-center bg-white dark:bg-slate-800 border-2 rounded-lg outline-none uppercase transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>
              {/* Questions 22-25 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 22–25<br/>Complete the sentences below.<br/>Write ONLY ONE WORD from the passage for each answer.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>22. To escape from prison, Joaquin Guzman had to use such traits as creative thinking, long-term planning and ________________.</p>
                <p>23. The Sinaloa cartel built a grand underground tunnel and even used a ________________ to avoid the fence.</p>
                <p>24. The main difference between the two groups is that criminals, unlike large corporations, often have ________________ encoded into their daily life.</p>
                <p>25. Due to being persuasive, Walid Abdul-Wahab found a ________________ of Amish camel milk farmers.</p>
              </div>

              <div className="space-y-4">
                {[22, 23, 24, 25].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-8 text-right">{q}.</span>
                    <input type="text" className={`flex-1 max-w-sm px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>

            {/* Question 26 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Question 26<br/>Choose the correct letter, A, B, C or D.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-4 font-medium">
                <div><p>26. What is the main difference between criminal organisations and large corporations?</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. Criminals are more violent</li><li>B. Large corporations are more successful</li><li>C. Criminals have improvisation encoded in their behaviour</li><li>D. Large corporations have better networks</li></ul></div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold w-8 text-right">26.</span>
                <select 
                  className={`w-24 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(26)}`} 
                  value={answers[26] || ""} 
                  onChange={(e) => handleInputChange(26, e.target.value)} 
                  disabled={submitted}
                >
                  <option value=""></option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
                {renderFeedback(26)}
              </div>
            </div>
            </div>
          )
        },
        {
          id: 3,
          title: "Part 3",
          passage: passage3,
          questions: (
            <div className="space-y-10 pb-20">
              {/* Questions 27-31 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 27–31<br/>Do the following statements agree with the information given?<br/>Write TRUE, FALSE, or NOT GIVEN.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>27. Armando Iannucci expressed a need of having more popular channels.</p>
                <p>28. John Whittingdale wanted to dismantle the BBC.</p>
                <p>29. Iannucci delivered the 30th annual MacTaggart Lecture.</p>
                <p>30. Ianucci believes that British television has contributed to the success of American TV-shows.</p>
                <p>31. There have been negotiations over the future of the BBC in July.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[27, 28, 29, 30, 31].map((q) => (
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

            {/* Questions 32-35 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 32–35<br/>Choose the correct letter, A, B, C or D.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-4 font-medium">
                <div><p>32. Ianucci praised everything EXCEPT:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. US shows</li><li>B. British shows</li><li>C. Corporation</li><li>D. British programming</li></ul></div>
                <div><p>33. To advise on the charter renewal Mr Whittingdale appointed a panel of:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. five people</li><li>B. two people</li><li>C. seven people</li><li>D. four people</li></ul></div>
                <div><p>34. Who of these people was NOT invited to the discussion concerning BBC renewal?</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. Armando Iannucci</li><li>B. Dawn Airey</li><li>C. John Whittingdale</li><li>D. Stewart Purvis</li></ul></div>
                <div><p>35. There panel of experts lacks:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. media owners</li><li>B. people who make enduring TV-shows</li><li>C. gurus of Television industry</li><li>D. top executives</li></ul></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[32, 33, 34, 35].map((q) => (
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

            {/* Questions 36-40 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 36–40<br/>Complete the sentences below.<br/>Write NO MORE THAN TWO WORDS from the passage for each answer.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>36. Iannucci suggested easing the strain on the licence fee by pushing ourselves ________________.</p>
                <p>37. He thinks they should sell shows through proper international ________________.</p>
                <p>38. He says they should not be modest and ________________ about making money.</p>
                <p>39. The money from abroad can be invested in ________________ quality shows.</p>
                <p>40. Mr Whittingdale said any ________________ about the Conservative Party wanting to change the BBC was absolute nonsense.</p>
              </div>

              <div className="space-y-4">
                {[36, 37, 38, 39, 40].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-8 text-right">{q}.</span>
                    <input type="text" className={`flex-1 max-w-sm px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>
            </div>
          )
        }
      ]}
      answers={answers}
      answerKey={answerKey}
      submitted={submitted}
      score={score}
      showAnswers={showAnswers}
      setShowAnswers={setShowAnswers}
      onClearAll={() => {
        setAnswers({});
        setSubmitted(false);
        setScore(null);
      }}
      onSubmit={() => {
        let s = 0;
        Object.keys(answerKey).forEach((key) => {
          const validAnswers = answerKey[key].map((ans) => String(ans).toLowerCase().trim());
          const userAnswer = String(answers[key] || "").toLowerCase().trim();
          if (validAnswers.includes(userAnswer)) s++;
        });
        setScore(s);
        setSubmitted(true);
      }}
    />
  );
}
