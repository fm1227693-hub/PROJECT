import { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { readingTest3Answers as answerKey, passageTest3_1 as passage1, passageTest3_2 as passage2, passageTest3_3 as passage3 } from "../data/readingTest3";

export default function ReadingTest3({ onExit }) {
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
      const correctAnswer = answerKey[key].toString().toLowerCase();

      // Check for alternatives
      const correctAnswersList = correctAnswer.split('/').map(a => a.trim().replace(/[()]/g, ''));
      
      let isCorrect = false;
      for (const possibleAnswer of correctAnswersList) {
         if (userAnswer === possibleAnswer) {
             isCorrect = true;
             break;
         }
         // for words in brackets like (effectively) paralysed
         if (correctAnswer.includes('(')) {
             const withoutBrackets = correctAnswer.replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim();
             const justBrackets = correctAnswer.match(/\((.*?)\)/)?.[1]?.trim();
             
             if (userAnswer === withoutBrackets || (justBrackets && userAnswer === justBrackets)) {
                 isCorrect = true;
                 break;
             }
         }
      }
      
      if (isCorrect) currentScore += 1;
    });
    setScore(currentScore);
    setSubmitted(true);
  };

  const getStatusClass = (questionNumber) => {
    if (!submitted) return "border-slate-300 dark:border-slate-600 focus:border-blue-500";
    
    const userAnswer = (answers[questionNumber] || "").toString().trim().toLowerCase();
    const correctAnswer = answerKey[questionNumber].toString().toLowerCase();
    
    const correctAnswersList = correctAnswer.split('/').map(a => a.trim().replace(/[()]/g, ''));
    let isCorrect = false;
    for (const possibleAnswer of correctAnswersList) {
        if (userAnswer === possibleAnswer) isCorrect = true;
        if (correctAnswer.includes('(')) {
             const withoutBrackets = correctAnswer.replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim();
             const justBrackets = correctAnswer.match(/\((.*?)\)/)?.[1]?.trim();
             if (userAnswer === withoutBrackets || (justBrackets && userAnswer === justBrackets)) {
                 isCorrect = true;
             }
         }
    }
    
    return isCorrect 
      ? "border-green-500 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400"
      : "border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400";
  };

  const renderFeedback = (questionNumber) => {
    if (!submitted) return null;
    
    const userAnswer = (answers[questionNumber] || "").toString().trim().toLowerCase();
    const correctAnswer = answerKey[questionNumber].toString().toLowerCase();
    
    const correctAnswersList = correctAnswer.split('/').map(a => a.trim().replace(/[()]/g, ''));
    let isCorrect = false;
    for (const possibleAnswer of correctAnswersList) {
        if (userAnswer === possibleAnswer) isCorrect = true;
        if (correctAnswer.includes('(')) {
             const withoutBrackets = correctAnswer.replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim();
             const justBrackets = correctAnswer.match(/\((.*?)\)/)?.[1]?.trim();
             if (userAnswer === withoutBrackets || (justBrackets && userAnswer === justBrackets)) {
                 isCorrect = true;
             }
         }
    }

    if (isCorrect) {
      return <FaCheckCircle className="text-green-500 ml-2 shrink-0" />;
    } else {
      return (
        <div className="flex items-center ml-2 shrink-0">
          <FaTimesCircle className="text-red-500" />
          <span className="ml-2 text-sm font-medium text-red-600 dark:text-red-400">
            {answerKey[questionNumber]}
          </span>
        </div>
      );
    }
  };

  return (
    <CdiReadingLayout
      onExit={onExit}
      testTitle="Practice Test 3"
      parts={[
        {
          id: 1,
          title: "Part 1",
          passage: passage1,
          questions: (
            <div className="space-y-10 pb-20">
              {/* Questions 1-8 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 1вЂ“8<br/>Choose the most suitable paragraph headings from the list of headings and write the correct letter, AвЂ“H, in boxes 1вЂ“8.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium">
                <p>1. Cons of the commuting</p>
                <p>2. Thing that students have to go through</p>
                <p>3. Commutes have become common in Ireland nowadays</p>
                <p>4. Danger of the overflow</p>
                <p>5. Cause of the problems</p>
                <p>6. Pricing data</p>
                <p>7. Regression</p>
                <p>8. Eyeless choice</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-6 text-right">{q}.</span>
                    <input type="text" maxLength={1} className={`w-12 px-2 py-1 text-center bg-white dark:bg-slate-800 border-2 rounded-lg outline-none uppercase transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>

            {/* Questions 9-14 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 9вЂ“14<br/>Do the following statements agree with the information given? Write TRUE, FALSE, or NOT GIVEN.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>9. The accommodation problem in Ireland is especially bad in Dublin.</p>
                <p>10. Commutes are considered ridiculous.</p>
                <p>11. The number of students in Ireland is not likely to increase in the future.</p>
                <p>12. Due to the opening of the new offices around Dublin, the number of local restaurants will go up significantly over the next 3 to 10 years.</p>
                <p>13. The rent price went up by 15% last year.</p>
                <p>14. Michael Martin stated that crisis could have been omitted if the government reacted properly.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[9, 10, 11, 12, 13, 14].map((q) => (
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
            </div>
          )
        },
        {
          id: 2,
          title: "Part 2",
          passage: passage2,
          questions: (
            <div className="space-y-10 pb-20">
              {/* Questions 1-8 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 1вЂ“8<br/>Choose the most suitable paragraph headings from the list of headings and write the correct letter, AвЂ“H, in boxes 1вЂ“8.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium">
                <p>1. Cons of the commuting</p>
                <p>2. Thing that students have to go through</p>
                <p>3. Commutes have become common in Ireland nowadays</p>
                <p>4. Danger of the overflow</p>
                <p>5. Cause of the problems</p>
                <p>6. Pricing data</p>
                <p>7. Regression</p>
                <p>8. Eyeless choice</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-6 text-right">{q}.</span>
                    <input type="text" maxLength={1} className={`w-12 px-2 py-1 text-center bg-white dark:bg-slate-800 border-2 rounded-lg outline-none uppercase transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>

            {/* Questions 9-14 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 9вЂ“14<br/>Do the following statements agree with the information given? Write TRUE, FALSE, or NOT GIVEN.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>9. The accommodation problem in Ireland is especially bad in Dublin.</p>
                <p>10. Commutes are considered ridiculous.</p>
                <p>11. The number of students in Ireland is not likely to increase in the future.</p>
                <p>12. Due to the opening of the new offices around Dublin, the number of local restaurants will go up significantly over the next 3 to 10 years.</p>
                <p>13. The rent price went up by 15% last year.</p>
                <p>14. Michael Martin stated that crisis could have been omitted if the government reacted properly.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[9, 10, 11, 12, 13, 14].map((q) => (
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
            
            {/* Questions 15-22 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 15вЂ“22<br/>Write TRUE, FALSE, or NOT GIVEN.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>15. Thomas Edison slept 4 hours a night.</p>
                <p>16. Scientists don't have a certain answer for why we have to sleep.</p>
                <p>17. Lack of sleep might cause various problems.</p>
                <p>18. Sleep-deprivation may be the cause of anorexia.</p>
                <p>19. There are four stages of the REM sleep.</p>
                <p>20. According to Jim Horne, we need to sleep as much as it takes to not be sleepy during the day.</p>
                <p>21. Giraffes require less sleep than dogs.</p>
                <p>22. After four sleepless days, Randy had a delusion about him being a football celebrity.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[15, 16, 17, 18, 19, 20, 21, 22].map((q) => (
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

            {/* Questions 23-27 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 23вЂ“27<br/>Choose the correct letter, A, B, C or D.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-4 font-medium">
                <div><p>23. During the Light Sleep stage:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. Muscle activity increases</li><li>B. Jiggling might occur</li><li>C. It is not easy to be woken up</li><li>D. After waking up, one may experience slight disorientation</li></ul></div>
                <div><p>24. Heart rate is at the lowest level during:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. Light Sleep stage</li><li>B. Rem Sleep</li><li>C. True Sleep stage</li><li>D. Third Sleep stage</li></ul></div>
                <div><p>25. The brain activity is really high:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. During REM sleep</li><li>B. During the stage of True Sleep</li><li>C. When we are awake</li><li>D. During the Deep sleep stage</li></ul></div>
                <div><p>26. Humans require at least:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. 7.75 hours of sleep</li><li>B. 5 hours of sleep</li><li>C. 8 hours</li><li>D. There is no set amount of time</li></ul></div>
                <div><p>27. Pythons need:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. Less sleep than tigers</li><li>B. Twice as much sleep as cats</li><li>C. Almost ten times more sleep than giraffes</li><li>D. More sleep than any other animal in the world</li></ul></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[23, 24, 25, 26, 27].map((q) => (
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

            {/* Questions 28-30 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 28вЂ“30<br/>Complete the sentences below. Write NO MORE THAN THREE WORDS from the passage.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>28. If we continually lack sleep, the specific part of our brain that controls language, is ________________.</p>
                <p>29. True Sleep lasts approximately ________________.</p>
                <p>30. Although during REM sleep our breathing rate and blood pressure rise, our bodies ________________.</p>
              </div>

              <div className="space-y-4">
                {[28, 29, 30].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-8 text-right">{q}.</span>
                    <input type="text" className={`w-48 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
                    {renderFeedback(q)}
                  </div>
                ))}
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
              {/* Questions 1-8 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 1вЂ“8<br/>Choose the most suitable paragraph headings from the list of headings and write the correct letter, AвЂ“H, in boxes 1вЂ“8.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium">
                <p>1. Cons of the commuting</p>
                <p>2. Thing that students have to go through</p>
                <p>3. Commutes have become common in Ireland nowadays</p>
                <p>4. Danger of the overflow</p>
                <p>5. Cause of the problems</p>
                <p>6. Pricing data</p>
                <p>7. Regression</p>
                <p>8. Eyeless choice</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-6 text-right">{q}.</span>
                    <input type="text" maxLength={1} className={`w-12 px-2 py-1 text-center bg-white dark:bg-slate-800 border-2 rounded-lg outline-none uppercase transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>

            {/* Questions 9-14 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 9вЂ“14<br/>Do the following statements agree with the information given? Write TRUE, FALSE, or NOT GIVEN.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>9. The accommodation problem in Ireland is especially bad in Dublin.</p>
                <p>10. Commutes are considered ridiculous.</p>
                <p>11. The number of students in Ireland is not likely to increase in the future.</p>
                <p>12. Due to the opening of the new offices around Dublin, the number of local restaurants will go up significantly over the next 3 to 10 years.</p>
                <p>13. The rent price went up by 15% last year.</p>
                <p>14. Michael Martin stated that crisis could have been omitted if the government reacted properly.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[9, 10, 11, 12, 13, 14].map((q) => (
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
            
            {/* Questions 15-22 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 15вЂ“22<br/>Write TRUE, FALSE, or NOT GIVEN.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>15. Thomas Edison slept 4 hours a night.</p>
                <p>16. Scientists don't have a certain answer for why we have to sleep.</p>
                <p>17. Lack of sleep might cause various problems.</p>
                <p>18. Sleep-deprivation may be the cause of anorexia.</p>
                <p>19. There are four stages of the REM sleep.</p>
                <p>20. According to Jim Horne, we need to sleep as much as it takes to not be sleepy during the day.</p>
                <p>21. Giraffes require less sleep than dogs.</p>
                <p>22. After four sleepless days, Randy had a delusion about him being a football celebrity.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[15, 16, 17, 18, 19, 20, 21, 22].map((q) => (
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

            {/* Questions 23-27 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 23вЂ“27<br/>Choose the correct letter, A, B, C or D.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-4 font-medium">
                <div><p>23. During the Light Sleep stage:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. Muscle activity increases</li><li>B. Jiggling might occur</li><li>C. It is not easy to be woken up</li><li>D. After waking up, one may experience slight disorientation</li></ul></div>
                <div><p>24. Heart rate is at the lowest level during:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. Light Sleep stage</li><li>B. Rem Sleep</li><li>C. True Sleep stage</li><li>D. Third Sleep stage</li></ul></div>
                <div><p>25. The brain activity is really high:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. During REM sleep</li><li>B. During the stage of True Sleep</li><li>C. When we are awake</li><li>D. During the Deep sleep stage</li></ul></div>
                <div><p>26. Humans require at least:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. 7.75 hours of sleep</li><li>B. 5 hours of sleep</li><li>C. 8 hours</li><li>D. There is no set amount of time</li></ul></div>
                <div><p>27. Pythons need:</p><ul className="pl-6 list-disc text-sm mt-1 text-slate-500"><li>A. Less sleep than tigers</li><li>B. Twice as much sleep as cats</li><li>C. Almost ten times more sleep than giraffes</li><li>D. More sleep than any other animal in the world</li></ul></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[23, 24, 25, 26, 27].map((q) => (
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

            {/* Questions 28-30 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 28вЂ“30<br/>Complete the sentences below. Write NO MORE THAN THREE WORDS from the passage.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>28. If we continually lack sleep, the specific part of our brain that controls language, is ________________.</p>
                <p>29. True Sleep lasts approximately ________________.</p>
                <p>30. Although during REM sleep our breathing rate and blood pressure rise, our bodies ________________.</p>
              </div>

              <div className="space-y-4">
                {[28, 29, 30].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-8 text-right">{q}.</span>
                    <input type="text" className={`w-48 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
                    {renderFeedback(q)}
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3 */}

            {/* Questions 31-35 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 31вЂ“35<br/>Write TRUE, FALSE, or NOT GIVEN.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>31. Both Easter and Wester societies presume that kissing is essential for any part of the world.</p>
                <p>32. Our ancestors were not likely to kiss.</p>
                <p>33. Chimpanzees and bonobos kiss not for the romance.</p>
                <p>34. There are other animal, rather than apes, that kiss.</p>
                <p>35. Scent might be important in choosing your partner.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[31, 32, 33, 34, 35].map((q) => (
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

            {/* Questions 36-39 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 36вЂ“39<br/>Complete the sentences below. Write NO MORE THAN TWO WORDS.</div>
              
              <div className="text-slate-700 dark:text-slate-300 mb-6 space-y-3 font-medium">
                <p>36. According to the Mehinaku tribe, kissing is ________________.</p>
                <p>37. Human tradition is to ________________ when they meet.</p>
                <p>38. A male black widow will mate with the female if only she is ________________.</p>
                <p>39. Humans benefit from getting close due to the fact that we have an ________________ of smell.</p>
              </div>

              <div className="space-y-4">
                {[36, 37, 38, 39].map((q) => (
                  <div key={q} className="flex items-center gap-3">
                    <span className="font-bold w-8 text-right">{q}.</span>
                    <input type="text" className={`w-48 px-3 py-2 bg-white dark:bg-slate-800 border-2 rounded-lg outline-none transition-colors ${getStatusClass(q)}`} value={answers[q] || ""} onChange={(e) => handleInputChange(q, e.target.value)} disabled={submitted} />
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
                  <p>40. Passage 3 can be described as:</p>
                  <ul className="pl-6 list-disc text-sm mt-1 text-slate-500">
                    <li>A. Strictly scientific text</li>
                    <li>B. Historical article</li>
                    <li>C. Article from a magazine</li>
                    <li>D. Dystopian sketch</li>
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
