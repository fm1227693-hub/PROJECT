import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { answerKey2 as answerKey } from "../data/listeningTest2";
import CdiListeningLayout from "./CdiListeningLayout";

export default function ListeningTest2({ onExit }) {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleInputChange = (qNum, value) => {
    setAnswers((prev) => ({ ...prev, [qNum]: value }));
  };

  const calculateScore = () => {let currentScore = 0;
    
    // Check questions 1-20, 25-40
    const regularQuestions = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40];
    
    regularQuestions.forEach(i => {
      const userAnswer = (answers[i] || "").toLowerCase().trim();
      const validAnswers = answerKey[i] || [];
      if (validAnswers.includes(userAnswer)) {
        currentScore++;
      }
    });

    // Handle questions 21-24 (Choose FOUR letters A-G in any order)
    const valid21to24 = ["a", "b", "d", "f"];
    const userAnswers21to24 = [
      (answers[21] || "").toLowerCase().trim(),
      (answers[22] || "").toLowerCase().trim(),
      (answers[23] || "").toLowerCase().trim(),
      (answers[24] || "").toLowerCase().trim()
    ];
    
    let matchedLetters = [];
    userAnswers21to24.forEach(ans => {
      if (valid21to24.includes(ans) && !matchedLetters.includes(ans)) {
        matchedLetters.push(ans);
        currentScore++;
      }
    });

    setScore(currentScore);
    setSubmitted(true);
    
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
          <FaTimesCircle className="text-red-500" />
        )}
      </span>
    );
  };

  const parts = [
    
    {
      id: 1,
      title: "Part 1",
      questions: "1-10",
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          <>
{/* Questions 1-5 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 1–5<br/>Complete the chart below.<br/>Write NO MORE THAN TWO WORDS for each answer.</div>
              
              <div className="min-w-[600px] border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm sm:text-base">
                <div className="flex border-b border-slate-300 dark:border-slate-600 p-2 sm:p-4">
                  <div className="w-1/3">Example</div>
                  <div className="w-2/3">Plainfield <span className="underline italic text-slate-500">Community Center</span></div>
                </div>
                <div className="flex border-b border-slate-300 dark:border-slate-600 p-2 sm:p-4 font-bold bg-slate-100 dark:bg-slate-700">
                  <div className="w-1/3">Days</div>
                  <div className="w-1/3">Class/Activity</div>
                  <div className="w-1/3">Age Group</div>
                </div>
                <div className="flex border-b border-slate-300 dark:border-slate-600 p-2 sm:p-4 items-center">
                  <div className="w-1/3">Wednesday, Saturday</div>
                  <div className="w-1/3 flex flex-wrap items-center gap-2">
                    <b>1</b> <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(1)}`} value={answers[1] || ""} onChange={(e) => handleInputChange(1, e.target.value)} disabled={submitted} />{renderFeedback(1)}
                  </div>
                  <div className="w-1/3">children, teens</div>
                </div>
                <div className="flex border-b border-slate-300 dark:border-slate-600 p-2 sm:p-4 items-center">
                  <div className="w-1/3 flex flex-wrap items-center gap-2">
                    <b>2</b> <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(2)}`} value={answers[2] || ""} onChange={(e) => handleInputChange(2, e.target.value)} disabled={submitted} />{renderFeedback(2)}
                  </div>
                  <div className="w-1/3">Tennis</div>
                  <div className="w-1/3 flex flex-wrap items-center gap-2">
                    <b>3</b> <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(3)}`} value={answers[3] || ""} onChange={(e) => handleInputChange(3, e.target.value)} disabled={submitted} />{renderFeedback(3)}
                  </div>
                </div>
                <div className="flex border-b border-slate-300 dark:border-slate-600 p-2 sm:p-4 items-center">
                  <div className="w-1/3">Tuesday, Thursday</div>
                  <div className="w-1/3 flex flex-wrap items-center gap-2">
                    <b>4</b> <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(4)}`} value={answers[4] || ""} onChange={(e) => handleInputChange(4, e.target.value)} disabled={submitted} />{renderFeedback(4)}
                  </div>
                  <div className="w-1/3">children, teens, adults</div>
                </div>
                <div className="flex p-2 sm:p-4 items-center">
                  <div className="w-1/3">Friday</div>
                  <div className="w-1/3">Book club</div>
                  <div className="w-1/3 flex flex-wrap items-center gap-2">
                    <b>5</b> <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(5)}`} value={answers[5] || ""} onChange={(e) => handleInputChange(5, e.target.value)} disabled={submitted} />{renderFeedback(5)}
                  </div>
                </div>
              </div>
            </div>

            {/* Questions 6-10 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 6–10<br/>Complete the notes below.<br/>Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.</div>
              
              <div className="space-y-4 text-lg">
                <div className="flex flex-wrap items-center gap-2">
                  <span>Membership fees</span> 
                  <span><b>6</b> $</span>
                  <input type="text" className={`w-24 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(6)}`} value={answers[6] || ""} onChange={(e) => handleInputChange(6, e.target.value)} disabled={submitted} />
                  <span>(individual)</span>
                  {renderFeedback(6)}
                </div>
                <div className="flex flex-wrap items-center gap-2 ml-40">
                  <span><b>7</b> $</span>
                  <input type="text" className={`w-24 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(7)}`} value={answers[7] || ""} onChange={(e) => handleInputChange(7, e.target.value)} disabled={submitted} />
                  <span>(family)</span>
                  {renderFeedback(7)}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span>Located at 107 <b>8</b></span>
                  <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(8)}`} value={answers[8] || ""} onChange={(e) => handleInputChange(8, e.target.value)} disabled={submitted} />
                  <span>Street</span>
                  {renderFeedback(8)}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span>Parking is located <b>9</b></span>
                  <input type="text" className={`w-56 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(9)}`} value={answers[9] || ""} onChange={(e) => handleInputChange(9, e.target.value)} disabled={submitted} />
                  {renderFeedback(9)}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span>The Center is closed on <b>10</b></span>
                  <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(10)}`} value={answers[10] || ""} onChange={(e) => handleInputChange(10, e.target.value)} disabled={submitted} />
                  {renderFeedback(10)}
                </div>
              </div>
            </div>
</>
        </div>
      )
    },
    {
      id: 2,
      title: "Part 2",
      questions: "11-20",
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          <>
{/* Questions 11-15 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-6 italic text-slate-600 dark:text-slate-400">Questions 11–15<br/>Choose FIVE letters, A–J.<br/>Which FIVE things should hikers take on the hiking trip?</div>
              
              <div className="flex flex-col md:flex-row gap-12">
                <div className="grid grid-cols-2 gap-4 text-lg">
                  <div><b>A</b> sleeping bag</div>
                  <div><b>F</b> backpack</div>
                  <div><b>B</b> tent</div>
                  <div><b>G</b> walking poles</div>
                  <div><b>C</b> food</div>
                  <div><b>H</b> maps</div>
                  <div><b>D</b> dishes</div>
                  <div><b>I</b> jacket</div>
                  <div><b>E</b> hiking boots</div>
                  <div><b>J</b> first-aid kit</div>
                </div>

                <div className="flex flex-col gap-4">
                  {[11,12,13,14,15].map(q => (
                    <div key={q} className="flex items-center gap-4">
                      <span className="font-bold w-6">{q}</span>
                      <select 
                        className={`w-16 px-2 py-1 bg-white dark:bg-slate-800 border-2 outline-none rounded ${getStatusClass(q)}`}
                        value={answers[q] || ""}
                        onChange={(e) => handleInputChange(q, e.target.value)}
                        disabled={submitted}
                      >
                        <option value=""></option>
                        {['A','B','C','D','E','F','G','H','I','J'].map(letter => (
                          <option key={letter} value={letter.toLowerCase()}>{letter}</option>
                        ))}
                      </select>
                      {renderFeedback(q)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Questions 16-20 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 16–20<br/>Complete the sentences below.<br/>Write NO MORE THAN TWO WORDS for each answer.</div>
              
              <div className="border-2 border-slate-300 dark:border-slate-600 p-6 bg-white dark:bg-slate-800 max-w-2xl text-lg space-y-4">
                <div className="text-center font-bold text-xl mb-6">Safety Rules for Hiking</div>

                <div className="flex flex-wrap items-center gap-2">
                  <span>Always stay ahead of the <b>16</b></span>
                  <input type="text" className={`flex-1 min-w-[150px] max-w-[200px] px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(16)}`} value={answers[16] || ""} onChange={(e) => handleInputChange(16, e.target.value)} disabled={submitted} />.
                  {renderFeedback(16)}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span>Stop and wait at any <b>17</b></span>
                  <input type="text" className={`flex-1 min-w-[150px] max-w-[200px] px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(17)}`} value={answers[17] || ""} onChange={(e) => handleInputChange(17, e.target.value)} disabled={submitted} />.
                  {renderFeedback(17)}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span>Don't try to climb <b>18</b></span>
                  <input type="text" className={`flex-1 min-w-[150px] max-w-[200px] px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(18)}`} value={answers[18] || ""} onChange={(e) => handleInputChange(18, e.target.value)} disabled={submitted} />.
                  {renderFeedback(18)}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span>Don't <b>19</b></span>
                  <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(19)}`} value={answers[19] || ""} onChange={(e) => handleInputChange(19, e.target.value)} disabled={submitted} />
                  <span>wild animals.</span>
                  {renderFeedback(19)}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span>Always carry <b>20</b></span>
                  <input type="text" className={`flex-1 min-w-[150px] max-w-[200px] px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(20)}`} value={answers[20] || ""} onChange={(e) => handleInputChange(20, e.target.value)} disabled={submitted} />
                  <span>with you.</span>
                  {renderFeedback(20)}
                </div>
              </div>
            </div>
</>
        </div>
      )
    },
    {
      id: 3,
      title: "Part 3",
      questions: "21-30",
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          <>
{/* Questions 21-24 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-6 italic text-slate-600 dark:text-slate-400">Questions 21–24<br/>Choose FOUR letters A–G.<br/>Which FOUR of the following are required of student teachers?</div>
              
              <div className="flex flex-col md:flex-row gap-12">
                <div className="space-y-2 text-lg">
                  <div><b>A</b> weekly journal</div>
                  <div><b>B</b> sample lesson plans</div>
                  <div><b>C</b> meetings with other student teachers</div>
                  <div><b>D</b> observing other teachers</div>
                  <div><b>E</b> evaluation from supervising teacher</div>
                  <div><b>F</b> portfolio</div>
                  <div><b>G</b> final exam</div>
                </div>

                <div className="flex flex-col gap-4">
                  {[21,22,23,24].map(q => (
                    <div key={q} className="flex items-center gap-4">
                      <span className="font-bold w-6">{q}</span>
                      <select 
                        className={`w-16 px-2 py-1 bg-white dark:bg-slate-800 border-2 outline-none rounded ${getStatusClass(q)}`}
                        value={answers[q] || ""}
                        onChange={(e) => handleInputChange(q, e.target.value)}
                        disabled={submitted}
                      >
                        <option value=""></option>
                        {['A','B','C','D','E','F','G'].map(letter => (
                          <option key={letter} value={letter.toLowerCase()}>{letter}</option>
                        ))}
                      </select>
                      {renderFeedback(q)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Question 25 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-6 italic text-slate-600 dark:text-slate-400">Question 25<br/>Choose the correct letter, A, B, or C.</div>
              
              <div className="space-y-4">
                <div className="font-bold text-lg">25 &nbsp; Who has to sign the agreement form?</div>
                <div className="space-y-2 ml-8 text-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="q25" value="a" checked={answers[25] === "a"} onChange={(e) => handleInputChange(25, e.target.value)} disabled={submitted} className="w-5 h-5 accent-red-600" />
                    <span><b>A</b> the student teacher</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="q25" value="b" checked={answers[25] === "b"} onChange={(e) => handleInputChange(25, e.target.value)} disabled={submitted} className="w-5 h-5 accent-red-600" />
                    <span><b>B</b> the supervising teacher</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="q25" value="c" checked={answers[25] === "c"} onChange={(e) => handleInputChange(25, e.target.value)} disabled={submitted} className="w-5 h-5 accent-red-600" />
                    <span><b>C</b> the advisor</span>
                  </label>
                </div>
                <div className="ml-8">{renderFeedback(25)}</div>
              </div>
            </div>

            {/* Questions 26-30 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 26–30<br/>Complete the schedule below.<br/>Write NO MORE THAN THREE WORDS for each answer.</div>
              
              <div className="min-w-[400px] border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-base">
                {[
                  { q: 26, left: "First week", right: "due" },
                  { q: 27, left: "Fourth week", right: "meeting" },
                  { q: 28, left: "Seventh week", right: "" },
                  { q: 29, left: "Fourteenth week", right: "due" },
                  { q: 30, left: "Fifteenth week", right: "" }
                ].map((item, idx) => (
                  <div key={item.q} className={`flex border-slate-300 dark:border-slate-600 p-3 sm:p-4 items-center ${idx !== 4 ? 'border-b' : ''}`}>
                    <div className="w-1/3 font-semibold">{item.left}</div>
                    <div className="w-2/3 flex flex-wrap items-center gap-2 border-l-2 border-slate-300 dark:border-slate-600 pl-4">
                      <b>{item.q}</b> <input type="text" className={`w-32 md:w-48 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(item.q)}`} value={answers[item.q] || ""} onChange={(e) => handleInputChange(item.q, e.target.value)} disabled={submitted} />
                      {item.right && <span>{item.right}</span>}
                      {renderFeedback(item.q)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
</>
        </div>
      )
    },
    {
      id: 4,
      title: "Part 4",
      questions: "31-40",
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          <>
{/* Questions 31-35 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-6 italic text-slate-600 dark:text-slate-400">Questions 31–35<br/>Choose the correct letter, A, B, or C.</div>
              
              <div className="space-y-8">
                {/* 31 */}
                <div className="space-y-4">
                  <div className="font-bold text-lg">31 &nbsp; Retailers place popular items</div>
                  <div className="space-y-2 ml-8 text-lg">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="q31" value="a" checked={answers[31] === "a"} onChange={(e) => handleInputChange(31, e.target.value)} disabled={submitted} className="w-5 h-5 accent-red-600" />
                      <span><b>A</b> in the back of the store.</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="q31" value="b" checked={answers[31] === "b"} onChange={(e) => handleInputChange(31, e.target.value)} disabled={submitted} className="w-5 h-5 accent-red-600" />
                      <span><b>B</b> near the front entrance.</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="q31" value="c" checked={answers[31] === "c"} onChange={(e) => handleInputChange(31, e.target.value)} disabled={submitted} className="w-5 h-5 accent-red-600" />
                      <span><b>C</b> at the end of the aisle.</span>
                    </label>
                  </div>
                  <div className="ml-8">{renderFeedback(31)}</div>
                </div>

                {/* 32 */}
                <div className="space-y-4">
                  <div className="font-bold text-lg">32 &nbsp; Carpet patterns are used to</div>
                  <div className="space-y-2 ml-8 text-lg">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="q32" value="a" checked={answers[32] === "a"} onChange={(e) => handleInputChange(32, e.target.value)} disabled={submitted} className="w-5 h-5 accent-red-600" />
                      <span><b>A</b> help shoppers feel comfortable.</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="q32" value="b" checked={answers[32] === "b"} onChange={(e) => handleInputChange(32, e.target.value)} disabled={submitted} className="w-5 h-5 accent-red-600" />
                      <span><b>B</b> appeal to shoppers' decorative sense.</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="q32" value="c" checked={answers[32] === "c"} onChange={(e) => handleInputChange(32, e.target.value)} disabled={submitted} className="w-5 h-5 accent-red-600" />
                      <span><b>C</b> encourage shoppers to walk in certain directions.</span>
                    </label>
                  </div>
                  <div className="ml-8">{renderFeedback(32)}</div>
                </div>

                {/* 33 */}
                <div className="space-y-4">
                  <div className="font-bold text-lg">33 &nbsp; Retailers can keep customers in the store longer by</div>
                  <div className="space-y-2 ml-8 text-lg">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="q33" value="a" checked={answers[33] === "a"} onChange={(e) => handleInputChange(33, e.target.value)} disabled={submitted} className="w-5 h-5 accent-red-600" />
                      <span><b>A</b> providing places to sit.</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="q33" value="b" checked={answers[33] === "b"} onChange={(e) => handleInputChange(33, e.target.value)} disabled={submitted} className="w-5 h-5 accent-red-600" />
                      <span><b>B</b> keeping the doors closed.</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="q33" value="c" checked={answers[33] === "c"} onChange={(e) => handleInputChange(33, e.target.value)} disabled={submitted} className="w-5 h-5 accent-red-600" />
                      <span><b>C</b> lowering the prices.</span>
                    </label>
                  </div>
                  <div className="ml-8">{renderFeedback(33)}</div>
                </div>

                {/* 34 */}
                <div className="space-y-4">
                  <div className="font-bold text-lg">34 &nbsp; Music is used in stores to</div>
                  <div className="space-y-2 ml-8 text-lg">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="q34" value="a" checked={answers[34] === "a"} onChange={(e) => handleInputChange(34, e.target.value)} disabled={submitted} className="w-5 h-5 accent-red-600" />
                      <span><b>A</b> entertain customers.</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="q34" value="b" checked={answers[34] === "b"} onChange={(e) => handleInputChange(34, e.target.value)} disabled={submitted} className="w-5 h-5 accent-red-600" />
                      <span><b>B</b> slow customers down.</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="q34" value="c" checked={answers[34] === "c"} onChange={(e) => handleInputChange(34, e.target.value)} disabled={submitted} className="w-5 h-5 accent-red-600" />
                      <span><b>C</b> make customers shop faster.</span>
                    </label>
                  </div>
                  <div className="ml-8">{renderFeedback(34)}</div>
                </div>

                {/* 35 */}
                <div className="space-y-4">
                  <div className="font-bold text-lg">35 &nbsp; The scent of vanilla has been used in</div>
                  <div className="space-y-2 ml-8 text-lg">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="q35" value="a" checked={answers[35] === "a"} onChange={(e) => handleInputChange(35, e.target.value)} disabled={submitted} className="w-5 h-5 accent-red-600" />
                      <span><b>A</b> ice cream shops.</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="q35" value="b" checked={answers[35] === "b"} onChange={(e) => handleInputChange(35, e.target.value)} disabled={submitted} className="w-5 h-5 accent-red-600" />
                      <span><b>B</b> bakeries.</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="q35" value="c" checked={answers[35] === "c"} onChange={(e) => handleInputChange(35, e.target.value)} disabled={submitted} className="w-5 h-5 accent-red-600" />
                      <span><b>C</b> clothing stores.</span>
                    </label>
                  </div>
                  <div className="ml-8">{renderFeedback(35)}</div>
                </div>

              </div>
            </div>

            {/* Questions 36-40 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 36–40<br/>Complete the chart about the effects of color.<br/>Write NO MORE THAN TWO WORDS for each answer.</div>
              
              <div className="min-w-[600px] border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-lg">
                <div className="flex border-b border-slate-300 dark:border-slate-600 p-3 sm:p-4 font-bold bg-slate-800 text-white rounded-t-sm">
                  <div className="w-1/3 pl-4">Color</div>
                  <div className="w-2/3 border-l-2 border-white/30 pl-4">Effect</div>
                </div>
                
                <div className="flex border-b border-slate-300 dark:border-slate-600 p-3 sm:p-4 items-center bg-slate-50 dark:bg-slate-800">
                  <div className="w-1/3 pl-4">Purple</div>
                  <div className="w-2/3 border-l-2 border-slate-300 dark:border-slate-600 pl-4 flex flex-wrap items-center gap-2">
                    <span>encourages people to</span>
                    <b>36</b> <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(36)}`} value={answers[36] || ""} onChange={(e) => handleInputChange(36, e.target.value)} disabled={submitted} />
                    {renderFeedback(36)}
                  </div>
                </div>

                <div className="flex border-b border-slate-300 dark:border-slate-600 p-3 sm:p-4 items-center">
                  <div className="w-1/3 pl-4">Orange</div>
                  <div className="w-2/3 border-l-2 border-slate-300 dark:border-slate-600 pl-4 flex flex-wrap items-center gap-2">
                    <span>makes restaurant customers</span>
                    <b>37</b> <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(37)}`} value={answers[37] || ""} onChange={(e) => handleInputChange(37, e.target.value)} disabled={submitted} />
                    {renderFeedback(37)}
                  </div>
                </div>

                <div className="flex border-b border-slate-300 dark:border-slate-600 p-3 sm:p-4 items-center bg-slate-50 dark:bg-slate-800">
                  <div className="w-1/3 pl-4">Blue</div>
                  <div className="w-2/3 border-l-2 border-slate-300 dark:border-slate-600 pl-4 flex flex-wrap items-center gap-2">
                    <span>conveys a sense of</span>
                    <b>38</b> <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(38)}`} value={answers[38] || ""} onChange={(e) => handleInputChange(38, e.target.value)} disabled={submitted} />
                    {renderFeedback(38)}
                  </div>
                </div>

                <div className="flex border-b border-slate-300 dark:border-slate-600 p-3 sm:p-4 items-center">
                  <div className="w-1/3 pl-4">Bright colors</div>
                  <div className="w-2/3 border-l-2 border-slate-300 dark:border-slate-600 pl-4 flex flex-wrap items-center gap-2">
                    <span>appeal to</span>
                    <b>39</b> <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(39)}`} value={answers[39] || ""} onChange={(e) => handleInputChange(39, e.target.value)} disabled={submitted} />
                    {renderFeedback(39)}
                  </div>
                </div>

                <div className="flex p-3 sm:p-4 items-center bg-slate-50 dark:bg-slate-800">
                  <div className="w-1/3 pl-4">Soft colors</div>
                  <div className="w-2/3 border-l-2 border-slate-300 dark:border-slate-600 pl-4 flex flex-wrap items-center gap-2">
                    <span>appeal to</span>
                    <b>40</b> <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(40)}`} value={answers[40] || ""} onChange={(e) => handleInputChange(40, e.target.value)} disabled={submitted} />
                    {renderFeedback(40)}
                  </div>
                </div>

</div>
</div>
</>
        </div>
      )
    }
  ];

  return (
    <CdiListeningLayout
      testTitle="Practice Test 2"
      audioSrc="/audios/LISTENING2.mp3"
      parts={parts}
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
      onSubmit={calculateScore}
      onExit={onExit}
    />
  );
}
