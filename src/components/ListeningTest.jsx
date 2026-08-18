import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { answerKey } from "../data/listeningTest1";
import AudioPlayer from "./AudioPlayer";

export default function ListeningTest() {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleInputChange = (qNum, value) => {
    setAnswers((prev) => ({ ...prev, [qNum]: value }));
  };

  const calculateScore = () => {
    let currentScore = 0;
    for (let i = 1; i <= 40; i++) {
      const userAnswer = (answers[i] || "").toLowerCase().trim();
      const validAnswers = answerKey[i] || [];
      if (validAnswers.includes(userAnswer)) {
        currentScore++;
      }
    }
    setScore(currentScore);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusClass = (qNum) => {
    if (!submitted) return "border-slate-300 dark:border-slate-600 focus:border-red-500";
    const userAnswer = (answers[qNum] || "").toLowerCase().trim();
    const validAnswers = answerKey[qNum] || [];
    if (validAnswers.includes(userAnswer)) {
      return "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
    }
    return "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
  };

  const renderFeedback = (qNum) => {
    if (!submitted) return null;
    const userAnswer = (answers[qNum] || "").toLowerCase().trim();
    const validAnswers = answerKey[qNum] || [];
    const isCorrect = validAnswers.includes(userAnswer);
    
    return (
      <span className="ml-2 inline-flex items-center">
        {isCorrect ? (
          <FaCheckCircle className="text-green-500" />
        ) : (
          <span className="flex items-center gap-2">
            <FaTimesCircle className="text-red-500" />
            <span className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded">
              Answer: {validAnswers[0]}
            </span>
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="w-full">
      {/* Sticky Audio Player */}
      <AudioPlayer src="/audios/LISTENING1.mp3" title="Practice Test 1 Audio" />
      <div className="max-w-4xl mx-auto px-4">
        
        {submitted && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl mb-8 text-center border-2 border-red-500"
          >
            <h2 className="text-3xl font-bold mb-2">Your Score: {score} / 40</h2>
            <p className="text-slate-500 dark:text-slate-400">
              Review your answers below. Correct answers are highlighted in green.
            </p>
          </motion.div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          
          {/* SECTION 1 */}
          <div className="p-6 sm:p-10 border-b border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black mb-2">SECTION 1</h2>
              <h3 className="text-lg font-bold text-slate-500">QUESTIONS 1–10</h3>
            </div>

            {/* Questions 1-4 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 1–4<br/>Complete the schedule below.<br/>Write NO MORE THAN THREE WORDS for each answer.</div>
              
              <div className="border-2 border-slate-300 dark:border-slate-600 p-4 sm:p-6 bg-white dark:bg-slate-800">
                <div className="text-center font-bold mb-6">
                  <div>Example: <span className="underline italic text-slate-500">Globetrotters</span> Language School</div>
                  <div>Class Schedule</div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="font-bold">Chinese</div>
                    <div>Level: Advanced</div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span>Days: <b>1</b></span>
                      <input type="text" className={`w-48 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(1)}`} value={answers[1] || ""} onChange={(e) => handleInputChange(1, e.target.value)} disabled={submitted} />
                      <span>evenings</span>
                      {renderFeedback(1)}
                    </div>
                  </div>

                  <div>
                    <div className="font-bold">Japanese</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span>Level: <b>2</b></span>
                      <input type="text" className={`w-40 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(2)}`} value={answers[2] || ""} onChange={(e) => handleInputChange(2, e.target.value)} disabled={submitted} />
                      {renderFeedback(2)}
                    </div>
                    <div className="mt-1">Days: Tuesday and Thursday mornings</div>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span>Level: <b>3</b></span>
                      <input type="text" className={`w-40 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(3)}`} value={answers[3] || ""} onChange={(e) => handleInputChange(3, e.target.value)} disabled={submitted} />
                      {renderFeedback(3)}
                    </div>
                    <div className="mt-1">Days: Monday, Wednesday, and Friday mornings</div>
                  </div>

                  <div>
                    <div className="font-bold">French</div>
                    <div>Level: Intermediate</div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span>Days: Friday <b>4</b></span>
                      <input type="text" className={`w-48 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(4)}`} value={answers[4] || ""} onChange={(e) => handleInputChange(4, e.target.value)} disabled={submitted} />
                      {renderFeedback(4)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions 5-8 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 5–8<br/>Complete the information below.<br/>Write NO MORE THAN ONE NUMBER for each answer.</div>
              
              <div className="border-2 border-slate-300 dark:border-slate-600 p-4 sm:p-6 bg-white dark:bg-slate-800 max-w-sm">
                <div className="mb-4">Tuition Information</div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>One week</span>
                    <span className="flex items-center gap-2"><b>5</b> $<input type="text" className={`w-20 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(5)}`} value={answers[5] || ""} onChange={(e) => handleInputChange(5, e.target.value)} disabled={submitted} />{renderFeedback(5)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Four weeks</span>
                    <span className="flex items-center gap-2"><b>6</b> $<input type="text" className={`w-20 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(6)}`} value={answers[6] || ""} onChange={(e) => handleInputChange(6, e.target.value)} disabled={submitted} />{renderFeedback(6)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Six weeks</span>
                    <span className="flex items-center gap-2"><b>7</b> $<input type="text" className={`w-20 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(7)}`} value={answers[7] || ""} onChange={(e) => handleInputChange(7, e.target.value)} disabled={submitted} />{renderFeedback(7)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Twelve weeks</span>
                    <span className="flex items-center gap-2"><b>8</b> $<input type="text" className={`w-20 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(8)}`} value={answers[8] || ""} onChange={(e) => handleInputChange(8, e.target.value)} disabled={submitted} />{renderFeedback(8)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions 9-10 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 9 and 10<br/>Complete the sentences below.<br/>Write NO MORE THAN THREE WORDS for each answer.</div>
              
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span><b>9</b> Students can register for a class by visiting</span>
                  <input type="text" className={`flex-1 min-w-[200px] px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(9)}`} value={answers[9] || ""} onChange={(e) => handleInputChange(9, e.target.value)} disabled={submitted} />.
                  {renderFeedback(9)}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span><b>10</b></span>
                  <input type="text" className={`w-48 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(10)}`} value={answers[10] || ""} onChange={(e) => handleInputChange(10, e.target.value)} disabled={submitted} />
                  <span>is in charge of student registration.</span>
                  {renderFeedback(10)}
                </div>
              </div>
            </div>
          </div>


          {/* SECTION 2 */}
          <div className="p-6 sm:p-10 border-b border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black mb-2">SECTION 2</h2>
              <h3 className="text-lg font-bold text-slate-500">QUESTIONS 11–20</h3>
            </div>

            {/* Questions 11-15 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-6 italic text-slate-600 dark:text-slate-400">Questions 11–15<br/>Label the map below.<br/>Write the correct letter, A–J, next to questions 11–15.</div>
              
              <div className="flex flex-col gap-10 items-center justify-center">
                
                {/* CSS Map */}
                <div className="relative w-full max-w-[320px] sm:max-w-[550px] aspect-square bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 p-4 shrink-0 shadow-sm mx-auto">
                  <div className="text-center font-bold mb-4 sm:mb-8 text-sm sm:text-xl">City Shopping District</div>
                  
                  {/* Pear Street (Vertical) */}
                  <div className="absolute left-1/2 top-[15%] bottom-[5%] w-12 sm:w-20 -ml-6 sm:-ml-10 border-l-2 border-r-2 border-slate-400 flex items-center justify-center bg-slate-100 dark:bg-slate-900/50">
                    <span className="rotate-90 whitespace-nowrap text-xs sm:text-lg text-slate-500 font-bold">Pear Street</span>
                  </div>

                  {/* Cherry Street (Horizontal) */}
                  <div className="absolute top-1/2 left-[5%] right-[5%] h-12 sm:h-20 -mt-6 sm:-mt-10 border-t-2 border-b-2 border-slate-400 flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 z-10">
                    <span className="text-xs sm:text-lg text-slate-500 font-bold">Cherry Street</span>
                  </div>

                  {/* Top Left E */}
                  <div className="absolute top-[20%] left-[15%] border border-slate-400 w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center font-bold bg-white dark:bg-slate-800 text-lg sm:text-2xl shadow-sm z-20">E</div>
                  
                  {/* Top Right G, H, I */}
                  <div className="absolute top-[20%] right-[10%] flex gap-2 sm:gap-4 z-20">
                    <div className="border border-slate-400 w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center font-bold bg-white dark:bg-slate-800 text-lg sm:text-2xl shadow-sm">G</div>
                    <div className="border border-slate-400 w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center font-bold bg-white dark:bg-slate-800 text-lg sm:text-2xl shadow-sm">H</div>
                    <div className="border border-slate-400 w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center font-bold bg-white dark:bg-slate-800 text-lg sm:text-2xl shadow-sm">I</div>
                  </div>

                  {/* Bottom Left C, A */}
                  <div className="absolute bottom-[10%] left-[15%] flex flex-col gap-2 sm:gap-4 z-20">
                    <div className="border border-slate-400 w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center font-bold bg-white dark:bg-slate-800 text-lg sm:text-2xl shadow-sm">C</div>
                    <div className="relative">
                      <span className="absolute -left-6 sm:-left-10 top-1 sm:top-2 text-lg sm:text-3xl text-yellow-500">★</span>
                      <div className="border border-slate-400 w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center font-bold bg-white dark:bg-slate-800 text-lg sm:text-2xl shadow-sm">A</div>
                    </div>
                  </div>

                  {/* Bottom Right D, F, B */}
                  <div className="absolute bottom-[10%] right-[10%] flex flex-col gap-2 sm:gap-4 z-20">
                    <div className="flex gap-2 sm:gap-4">
                      <div className="border border-slate-400 w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center font-bold bg-white dark:bg-slate-800 text-lg sm:text-2xl shadow-sm">D</div>
                      <div className="border border-slate-400 w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center font-bold bg-white dark:bg-slate-800 text-lg sm:text-2xl shadow-sm">F</div>
                    </div>
                    <div className="border border-slate-400 w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center font-bold bg-white dark:bg-slate-800 text-lg sm:text-2xl shadow-sm">B</div>
                  </div>

                </div>

                {/* Questions */}
                <div className="space-y-4 w-full max-w-sm mx-auto">
                  {[
                    { q: 11, text: "Harbor View Bookstore" },
                    { q: 12, text: "Pear Café" },
                    { q: 13, text: "Souvenir Store" },
                    { q: 14, text: "Art Gallery" },
                    { q: 15, text: "Harbor Park" }
                  ].map((item) => (
                    <div key={item.q} className="flex items-center gap-4 justify-between md:justify-start">
                      <span className="font-bold w-6">{item.q}</span>
                      <span className="w-48">{item.text}</span>
                      <select 
                        className={`w-16 px-2 py-1 bg-white dark:bg-slate-800 border-2 outline-none rounded ${getStatusClass(item.q)}`}
                        value={answers[item.q] || ""}
                        onChange={(e) => handleInputChange(item.q, e.target.value)}
                        disabled={submitted}
                      >
                        <option value=""></option>
                        {['A','B','C','D','E','F','G','H','I','J'].map(letter => (
                          <option key={letter} value={letter.toLowerCase()}>{letter}</option>
                        ))}
                      </select>
                      {renderFeedback(item.q)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Questions 16-20 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 16–20<br/>Complete the sentences below.<br/>Write ONE WORD ONLY for each answer.</div>
              <div className="font-bold mb-4">Harbor Park</div>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span><b>16</b> The park was built in</span>
                  <input type="text" className={`w-32 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(16)}`} value={answers[16] || ""} onChange={(e) => handleInputChange(16, e.target.value)} disabled={submitted} />.
                  {renderFeedback(16)}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span><b>17</b> A</span>
                  <input type="text" className={`w-32 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(17)}`} value={answers[17] || ""} onChange={(e) => handleInputChange(17, e.target.value)} disabled={submitted} />
                  <span>stands in the center of the park.</span>
                  {renderFeedback(17)}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span><b>18</b> Take the path through the</span>
                  <input type="text" className={`w-32 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(18)}`} value={answers[18] || ""} onChange={(e) => handleInputChange(18, e.target.value)} disabled={submitted} />.
                  {renderFeedback(18)}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span><b>19</b> In the middle of the garden is a</span>
                  <input type="text" className={`w-32 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(19)}`} value={answers[19] || ""} onChange={(e) => handleInputChange(19, e.target.value)} disabled={submitted} />.
                  {renderFeedback(19)}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span><b>20</b> A</span>
                  <input type="text" className={`w-32 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(20)}`} value={answers[20] || ""} onChange={(e) => handleInputChange(20, e.target.value)} disabled={submitted} />
                  <span>takes you down to the harbor and a view of the boats.</span>
                  {renderFeedback(20)}
                </div>
              </div>
            </div>
          </div>


          {/* SECTION 3 */}
          <div className="p-6 sm:p-10 border-b border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black mb-2">SECTION 3</h2>
              <h3 className="text-lg font-bold text-slate-500">QUESTIONS 21–30</h3>
            </div>

            {/* Questions 21-24 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 21–24<br/>Complete the information about the archives.<br/>Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.</div>
              
              <div className="border-2 border-slate-300 dark:border-slate-600 p-4 sm:p-6 bg-white dark:bg-slate-800">
                <div className="text-center font-bold mb-6">Welcome to City Archives</div>
                <div className="mb-4">The following people may use the archives:</div>
                <ul className="list-disc pl-6 space-y-4 mb-6">
                  <li className="flex flex-wrap items-center gap-2">
                    <span>University students with a valid <b>21</b></span>
                    <input type="text" className={`w-48 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(21)}`} value={answers[21] || ""} onChange={(e) => handleInputChange(21, e.target.value)} disabled={submitted} />
                    {renderFeedback(21)}
                  </li>
                  <li className="flex flex-wrap items-center gap-2">
                    <span>City residents with payment of <b>22</b></span>
                    <input type="text" className={`w-48 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(22)}`} value={answers[22] || ""} onChange={(e) => handleInputChange(22, e.target.value)} disabled={submitted} />
                    {renderFeedback(22)}
                  </li>
                  <li>All others: Special permission from the director is required.</li>
                </ul>

                <div>Hours:</div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span>Days: <b>23</b></span>
                  <input type="text" className={`w-48 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(23)}`} value={answers[23] || ""} onChange={(e) => handleInputChange(23, e.target.value)} disabled={submitted} />
                  <span>through</span>
                  <div className="w-24 border-b border-slate-400"></div>
                  {renderFeedback(23)}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span>Hours: <b>24</b> 9:30 A.M. until</span>
                  <input type="text" className={`w-32 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(24)}`} value={answers[24] || ""} onChange={(e) => handleInputChange(24, e.target.value)} disabled={submitted} />
                  <span>P.M.</span>
                  {renderFeedback(24)}
                </div>
              </div>
            </div>

            {/* Questions 25-30 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 25–30<br/>What can be found on each floor of the archives building?<br/>Write the correct letter, A–G next to questions 25–30.</div>
              
              <div className="flex flex-col md:flex-row gap-8 items-start">
                
                <div className="border-2 border-slate-300 dark:border-slate-600 p-4 sm:p-6 bg-slate-100 dark:bg-slate-800/80 w-full md:w-auto">
                  <div className="text-center font-bold mb-4">CITY ARCHIVES</div>
                  <ul className="space-y-2">
                    <li><b>A</b> nineteenth-century documents</li>
                    <li><b>B</b> maps</li>
                    <li><b>C</b> personal papers</li>
                    <li><b>D</b> photographs</li>
                    <li><b>E</b> books about the city</li>
                    <li><b>F</b> newspapers</li>
                    <li><b>G</b> information about the woolen mill</li>
                  </ul>
                </div>

                <div className="flex-1">
                  <div className="font-bold mb-4">Floor of the building</div>
                  <div className="space-y-4">
                    {[
                      { q: 25, text: "basement" },
                      { q: 26, text: "ground floor" },
                      { q: 27, text: "second floor" },
                      { q: 28, text: "third floor" },
                      { q: 29, text: "fourth floor" },
                      { q: 30, text: "fifth floor" }
                    ].map((item) => (
                      <div key={item.q} className="flex items-center gap-4">
                        <span className="font-bold w-6">{item.q}</span>
                        <span className="w-28">{item.text}</span>
                        <select 
                          className={`w-16 px-2 py-1 bg-white dark:bg-slate-800 border-2 outline-none rounded ${getStatusClass(item.q)}`}
                          value={answers[item.q] || ""}
                          onChange={(e) => handleInputChange(item.q, e.target.value)}
                          disabled={submitted}
                        >
                          <option value=""></option>
                          {['A','B','C','D','E','F','G'].map(letter => (
                            <option key={letter} value={letter.toLowerCase()}>{letter}</option>
                          ))}
                        </select>
                        {renderFeedback(item.q)}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>


          {/* SECTION 4 */}
          <div className="p-6 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black mb-2">SECTION 4</h2>
              <h3 className="text-lg font-bold text-slate-500">QUESTIONS 31–40</h3>
            </div>

            {/* Questions 31-33 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 31–33<br/>Complete the notes below.<br/>Write NO MORE THAN TWO WORDS for each answer.</div>
              
              <div className="border-2 border-slate-300 dark:border-slate-600 p-4 sm:p-6 bg-white dark:bg-slate-800">
                <div className="text-center font-bold mb-6">Historical Uses of Wind Power</div>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-40 font-medium">Ancient China</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span>Windmills were used to <b>31</b></span>
                      <input type="text" className={`w-40 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(31)}`} value={answers[31] || ""} onChange={(e) => handleInputChange(31, e.target.value)} disabled={submitted} />
                      {renderFeedback(31)}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-40 font-medium">Ancient Persia</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span>Farmers used wind power to <b>32</b></span>
                      <input type="text" className={`w-40 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(32)}`} value={answers[32] || ""} onChange={(e) => handleInputChange(32, e.target.value)} disabled={submitted} />
                      {renderFeedback(32)}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="w-40 font-medium">The Netherlands</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span>People used windmills to <b>33</b></span>
                      <input type="text" className={`w-40 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(33)}`} value={answers[33] || ""} onChange={(e) => handleInputChange(33, e.target.value)} disabled={submitted} />
                      {renderFeedback(33)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions 34-40 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 34–40<br/>Complete the chart below.<br/>Write NO MORE THAN TWO WORDS for each answer.</div>
              
              <table className="w-full min-w-[600px] border-collapse border-2 border-slate-400">
                <thead>
                  <tr>
                    <th colSpan="2" className="border border-slate-400 p-3 bg-white dark:bg-slate-800 text-left text-xl">Wind Power</th>
                  </tr>
                  <tr>
                    <th className="border border-slate-400 p-3 bg-slate-500 text-white w-1/2 text-left">Advantages</th>
                    <th className="border border-slate-400 p-3 bg-slate-500 text-white w-1/2 text-left">Disadvantages</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-400 p-3 align-top bg-white dark:bg-slate-800">
                      Unlike oil and coal, wind power does not cause <b>34</b> <input type="text" className={`w-24 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(34)}`} value={answers[34] || ""} onChange={(e) => handleInputChange(34, e.target.value)} disabled={submitted} />
                      {renderFeedback(34)}
                    </td>
                    <td className="border border-slate-400 p-3 align-top bg-slate-100 dark:bg-slate-900">
                      The cost of the initial investment is high.
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 p-3 align-top bg-white dark:bg-slate-800">
                      There are limited supplies of oil and coal, but wind is a <b>35</b> <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(35)}`} value={answers[35] || ""} onChange={(e) => handleInputChange(35, e.target.value)} disabled={submitted} />
                      {renderFeedback(35)}
                    </td>
                    <td className="border border-slate-400 p-3 align-top bg-slate-100 dark:bg-slate-900">
                      The <b>37</b> <input type="text" className={`w-24 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(37)}`} value={answers[37] || ""} onChange={(e) => handleInputChange(37, e.target.value)} disabled={submitted} /> of the wind is not constant.
                      {renderFeedback(37)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 p-3 align-top bg-white dark:bg-slate-800">
                      It <b>36</b> <input type="text" className={`w-24 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(36)}`} value={answers[36] || ""} onChange={(e) => handleInputChange(36, e.target.value)} disabled={submitted} /> to generate electricity with the wind.
                      {renderFeedback(36)}
                    </td>
                    <td className="border border-slate-400 p-3 align-top bg-slate-100 dark:bg-slate-900">
                      Wind turbines are usually located far from <b>38</b> <input type="text" className={`w-24 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(38)}`} value={answers[38] || ""} onChange={(e) => handleInputChange(38, e.target.value)} disabled={submitted} />
                      {renderFeedback(38)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 p-3 align-top bg-white dark:bg-slate-800">
                      Wind turbines do not take up much land.
                    </td>
                    <td className="border border-slate-400 p-3 align-top bg-slate-100 dark:bg-slate-900">
                      <div className="mb-2">Wind turbines may spoil <b>39</b> <input type="text" className={`w-24 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(39)}`} value={answers[39] || ""} onChange={(e) => handleInputChange(39, e.target.value)} disabled={submitted} />{renderFeedback(39)}</div>
                      <div>Wind turbines are as <b>40</b> <input type="text" className={`w-24 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(40)}`} value={answers[40] || ""} onChange={(e) => handleInputChange(40, e.target.value)} disabled={submitted} /> as a high-speed car.{renderFeedback(40)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-center pb-12">
          {!submitted ? (
            <button 
              onClick={calculateScore}
              className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white text-xl font-black rounded-full shadow-lg shadow-red-600/30 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3"
            >
              <FaCheckCircle />
              {t("listeningTest.checkAnswers", "Check Answers")}
            </button>
          ) : (
            <button 
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
                setScore(0);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-10 py-4 bg-slate-800 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xl font-black rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              {t("listeningTest.retakeTest", "Retake Test")}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
