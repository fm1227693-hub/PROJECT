import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { listeningTest6Answers as answerKey } from "../data/listeningTest6";
import CdiListeningLayout from "./CdiListeningLayout";

export default function ListeningTest6({ onExit }) {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleInputChange = (qNum, value) => {
    setAnswers((prev) => ({ ...prev, [qNum]: value }));
  };

  const calculateScore = () => {let currentScore = 0;
    
    // Arrays for special multi-answer logic
    const userAnswers11to15 = [
      (answers[11] || "").toLowerCase().trim(),
      (answers[12] || "").toLowerCase().trim(),
      (answers[13] || "").toLowerCase().trim(),
      (answers[14] || "").toLowerCase().trim(),
      (answers[15] || "").toLowerCase().trim()
    ].filter(a => a);

    const userAnswers21to23 = [
      (answers[21] || "").toLowerCase().trim(),
      (answers[22] || "").toLowerCase().trim(),
      (answers[23] || "").toLowerCase().trim()
    ].filter(a => a);

    const userAnswers34to38 = [
      (answers[34] || "").toLowerCase().trim(),
      (answers[35] || "").toLowerCase().trim(),
      (answers[36] || "").toLowerCase().trim(),
      (answers[37] || "").toLowerCase().trim(),
      (answers[38] || "").toLowerCase().trim()
    ].filter(a => a);
    
    // Check all questions 1-40
    const regularQuestions = Array.from({ length: 40 }, (_, i) => i + 1);
    
    regularQuestions.forEach(i => {
      const userAnswer = (answers[i] || "").toLowerCase().trim();
      const validAnswers = answerKey[i] || [];
      
      // Special logic for 11-15 (any 5 of the correct options)
      if (i >= 11 && i <= 15) {
        if (validAnswers.includes(userAnswer)) {
          const firstOccurrence = userAnswers11to15.indexOf(userAnswer);
          const currentOccurrence = [11,12,13,14,15].indexOf(i);
          if (firstOccurrence === currentOccurrence) {
            currentScore++;
          }
        }
      }
      // Special logic for 21-23 (any 3 of the correct options)
      else if (i >= 21 && i <= 23) {
        if (validAnswers.includes(userAnswer)) {
          const firstOccurrence = userAnswers21to23.indexOf(userAnswer);
          const currentOccurrence = [21,22,23].indexOf(i);
          if (firstOccurrence === currentOccurrence) {
            currentScore++;
          }
        }
      }
      // Special logic for 34-38 (any 5 of the correct options)
      else if (i >= 34 && i <= 38) {
        if (validAnswers.includes(userAnswer)) {
          const firstOccurrence = userAnswers34to38.indexOf(userAnswer);
          const currentOccurrence = [34,35,36,37,38].indexOf(i);
          if (firstOccurrence === currentOccurrence) {
            currentScore++;
          }
        }
      }
      // Standard logic
      else if (validAnswers.includes(userAnswer)) {
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
              <div className="flex justify-between items-start mb-4 gap-4">
                <div className="font-bold italic text-slate-600 dark:text-slate-400">
                  Questions 1–5<br/>
                  Complete the information below.<br/>
                  Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.
                </div>
                <div className="bg-white dark:bg-slate-800 border-2 border-slate-800 dark:border-slate-200 p-4 max-w-[200px] text-sm">
                  <div className="font-bold border-b border-slate-800 dark:border-slate-200 pb-1 mb-2">Note</div>
                  If you do not have access to an audio CD player, refer to the audioscripts starting on page 432 when prompted to listen to an audio passage.
                </div>
              </div>
              
              <div className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 min-w-[500px]">
                <div className="p-4 border-b border-slate-300 dark:border-slate-600 space-y-4">
                  <div className="font-bold">City Library</div>
                  <div className="flex gap-4 items-center">
                    <span className="w-40 shrink-0">Head Librarian</span>
                    <span>Example: <span className="underline italic text-slate-500">Mrs. Phillips</span></span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="w-40 shrink-0">Hours</span>
                    <span><b>1</b></span>
                    <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(1)}`} value={answers[1] || ""} onChange={(e) => handleInputChange(1, e.target.value)} disabled={submitted} />
                    <span>to 4:30</span>
                    {renderFeedback(1)}
                  </div>
                </div>

                <div className="p-4 border-b border-slate-300 dark:border-slate-600 space-y-4">
                  <div className="underline font-bold">Books</div>
                  <div className="flex gap-4 items-center">
                    <span className="w-40 shrink-0">Ground floor</span>
                    <span><b>2</b></span>
                    <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(2)}`} value={answers[2] || ""} onChange={(e) => handleInputChange(2, e.target.value)} disabled={submitted} />
                    {renderFeedback(2)}
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="w-40 shrink-0">Second floor</span>
                    <span>Adult collection</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="w-40 shrink-0">Third floor</span>
                    <span><b>3</b></span>
                    <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(3)}`} value={answers[3] || ""} onChange={(e) => handleInputChange(3, e.target.value)} disabled={submitted} />
                    {renderFeedback(3)}
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <div className="underline font-bold">Book carts</div>
                  <div className="flex gap-4 items-center">
                    <span className="w-40 shrink-0">Brown cart</span>
                    <span>books to re-shelve</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="w-40 shrink-0">Black cart</span>
                    <span>books to <b>4</b></span>
                    <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(4)}`} value={answers[4] || ""} onChange={(e) => handleInputChange(4, e.target.value)} disabled={submitted} />
                    {renderFeedback(4)}
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="w-40 shrink-0">White cart</span>
                    <span>books to <b>5</b></span>
                    <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(5)}`} value={answers[5] || ""} onChange={(e) => handleInputChange(5, e.target.value)} disabled={submitted} />
                    {renderFeedback(5)}
                  </div>
                </div>
              </div>
            </div>

            {/* Questions 6-10 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 6–10<br/>Complete the library schedule below.<br/>Write NO MORE THAN ONE WORD AND/OR A NUMBER for each answer.</div>
              
              <table className="w-full text-left border-collapse border border-slate-300 dark:border-slate-600 min-w-[600px]">
                <thead>
                  <tr className="bg-slate-700 text-white dark:bg-slate-900">
                    <th className="p-3 border border-slate-300 dark:border-slate-600">Activity</th>
                    <th className="p-3 border border-slate-300 dark:border-slate-600">Location</th>
                    <th className="p-3 border border-slate-300 dark:border-slate-600">Day and Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800">
                  <tr>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">Story Time</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600 bg-slate-200/50 dark:bg-slate-700">Children's Room</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">
                      <b>6</b> <input type="text" className={`w-24 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(6)}`} value={answers[6] || ""} onChange={(e) => handleInputChange(6, e.target.value)} disabled={submitted} /> at 11:00 {renderFeedback(6)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">
                      <b>7</b> <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(7)}`} value={answers[7] || ""} onChange={(e) => handleInputChange(7, e.target.value)} disabled={submitted} /> {renderFeedback(7)}
                    </td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600 bg-slate-200/50 dark:bg-slate-700">Reference Room</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">
                      Saturday at <b>8</b> <input type="text" className={`w-24 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(8)}`} value={answers[8] || ""} onChange={(e) => handleInputChange(8, e.target.value)} disabled={submitted} /> {renderFeedback(8)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">Lecture Series</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600 bg-slate-200/50 dark:bg-slate-700">
                      <b>9</b> <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(9)}`} value={answers[9] || ""} onChange={(e) => handleInputChange(9, e.target.value)} disabled={submitted} /> Room {renderFeedback(9)}
                    </td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">
                      Friday at <b>10</b> <input type="text" className={`w-24 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(10)}`} value={answers[10] || ""} onChange={(e) => handleInputChange(10, e.target.value)} disabled={submitted} /> {renderFeedback(10)}
                    </td>
                  </tr>
                </tbody>
              </table>
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
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 11–15<br/>Choose FIVE letters, A–I.<br/>Which FIVE activities are available at Golden Lake Resort?</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-6 max-w-sm mx-auto text-lg">
                <div>A swimming</div>
                <div>F golf</div>
                <div>B boating</div>
                <div>G horseback riding</div>
                <div>C waterskiing</div>
                <div>H hiking</div>
                <div>D fishing</div>
                <div>I arts and crafts</div>
                <div>E tennis</div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {[11, 12, 13, 14, 15].map((num) => (
                  <div key={num} className="flex items-center gap-2">
                    <span className="font-bold">{num}</span>
                    <input 
                      type="text" 
                      maxLength="1"
                      placeholder="A-I"
                      className={`w-12 px-2 py-1 text-center bg-transparent border-b-2 outline-none transition-colors uppercase ${getStatusClass(num)}`} 
                      value={answers[num] || ""} 
                      onChange={(e) => handleInputChange(num, e.target.value)} 
                      disabled={submitted} 
                    />
                    {renderFeedback(num)}
                  </div>
                ))}
              </div>
            </div>

            {/* Questions 16-20 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 16–20<br/>Complete the schedule below.<br/>Write NO MORE THAN ONE WORD for each answer.</div>
              
              <table className="w-full text-left border-collapse border border-slate-300 dark:border-slate-600 min-w-[500px]">
                <thead>
                  <tr className="bg-slate-700 text-white dark:bg-slate-900">
                    <th className="p-3 border border-slate-300 dark:border-slate-600 w-1/3">Night</th>
                    <th className="p-3 border border-slate-300 dark:border-slate-600 w-2/3">Activity</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800">
                  <tr>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">Sunday</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600 bg-slate-200/50 dark:bg-slate-700">
                      <b>16</b> <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(16)}`} value={answers[16] || ""} onChange={(e) => handleInputChange(16, e.target.value)} disabled={submitted} /> {renderFeedback(16)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">Monday</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600 bg-slate-200/50 dark:bg-slate-700">Dessert Night</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">Tuesday</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600 bg-slate-200/50 dark:bg-slate-700">
                      <b>17</b> <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(17)}`} value={answers[17] || ""} onChange={(e) => handleInputChange(17, e.target.value)} disabled={submitted} /> Night {renderFeedback(17)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">Wednesday</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600 bg-slate-200/50 dark:bg-slate-700">
                      <b>18</b> <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(18)}`} value={answers[18] || ""} onChange={(e) => handleInputChange(18, e.target.value)} disabled={submitted} /> {renderFeedback(18)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">Thursday</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600 bg-slate-200/50 dark:bg-slate-700">
                      <b>19</b> <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(19)}`} value={answers[19] || ""} onChange={(e) => handleInputChange(19, e.target.value)} disabled={submitted} /> {renderFeedback(19)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">Friday</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600 bg-slate-200/50 dark:bg-slate-700">Talent Show</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">Saturday</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600 bg-slate-200/50 dark:bg-slate-700">
                      <b>20</b> <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(20)}`} value={answers[20] || ""} onChange={(e) => handleInputChange(20, e.target.value)} disabled={submitted} /> {renderFeedback(20)}
                    </td>
                  </tr>
                </tbody>
              </table>
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
{/* Questions 21-23 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 21–23<br/>Choose THREE letters, A–F.<br/>Which THREE things are the students required to submit to their professor?</div>
              
              <div className="space-y-2 mb-6 max-w-sm mx-auto text-lg">
                <div>A a written summary</div>
                <div>B maps</div>
                <div>C a case study</div>
                <div>D charts and graphs</div>
                <div>E a list of resources used</div>
                <div>F a video</div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {[21, 22, 23].map((num) => (
                  <div key={num} className="flex items-center gap-2">
                    <span className="font-bold">{num}</span>
                    <input 
                      type="text" 
                      maxLength="1"
                      placeholder="A-F"
                      className={`w-12 px-2 py-1 text-center bg-transparent border-b-2 outline-none transition-colors uppercase ${getStatusClass(num)}`} 
                      value={answers[num] || ""} 
                      onChange={(e) => handleInputChange(num, e.target.value)} 
                      disabled={submitted} 
                    />
                    {renderFeedback(num)}
                  </div>
                ))}
              </div>
            </div>

            {/* Questions 24-25 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 24 and 25<br/>Answer the questions below.<br/>Write NO MORE THAN THREE WORDS for each answer.</div>
              
              <div className="space-y-8">
                <div className="flex flex-col gap-2">
                  <div className="font-bold flex gap-2">
                    <span>24</span>
                    <span>What two sources of information will the students use when preparing their presentation?</span>
                  </div>
                  <div className="ml-6 border-b-2 border-slate-300 dark:border-slate-600 flex">
                    <input type="text" className={`flex-1 px-3 py-1 bg-transparent outline-none transition-colors ${getStatusClass(24)}`} value={answers[24] || ""} onChange={(e) => handleInputChange(24, e.target.value)} disabled={submitted} />
                    {renderFeedback(24)}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="font-bold flex gap-2">
                    <span>25</span>
                    <span>What will the students show during their presentation?</span>
                  </div>
                  <div className="ml-6 border-b-2 border-slate-300 dark:border-slate-600 flex">
                    <input type="text" className={`flex-1 px-3 py-1 bg-transparent outline-none transition-colors ${getStatusClass(25)}`} value={answers[25] || ""} onChange={(e) => handleInputChange(25, e.target.value)} disabled={submitted} />
                    {renderFeedback(25)}
                  </div>
                </div>
              </div>
            </div>

            {/* Questions 26-30 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 26–30<br/>Choose the correct letter, A, B, or C.</div>
              
              <div className="space-y-6">
                {[
                  {
                    qNum: 26,
                    text: "Only rescue birds that are",
                    options: [
                      { val: "a", label: "A all alone." },
                      { val: "b", label: "B obviously hurt." },
                      { val: "c", label: "C sitting on the ground." }
                    ]
                  },
                  {
                    qNum: 27,
                    text: "Protect yourself by wearing",
                    options: [
                      { val: "a", label: "A gloves." },
                      { val: "b", label: "B a hat." },
                      { val: "c", label: "C protective glasses." }
                    ]
                  },
                  {
                    qNum: 28,
                    text: "Put the bird in a",
                    options: [
                      { val: "a", label: "A cage." },
                      { val: "b", label: "B box." },
                      { val: "c", label: "C bag." }
                    ]
                  },
                  {
                    qNum: 29,
                    text: "Keep the bird calm by",
                    options: [
                      { val: "a", label: "A petting it." },
                      { val: "b", label: "B talking to it." },
                      { val: "c", label: "C leaving it alone." }
                    ]
                  },
                  {
                    qNum: 30,
                    text: "When transporting the bird,",
                    options: [
                      { val: "a", label: "A speak quietly." },
                      { val: "b", label: "B play music." },
                      { val: "c", label: "C drive very slowly." }
                    ]
                  }
                ].map((q) => (
                  <div key={q.qNum} className="mb-4">
                    <div className="flex gap-2 mb-2">
                      <span className="font-bold">{q.qNum}</span>
                      <span>{q.text}</span>
                      {renderFeedback(q.qNum)}
                    </div>
                    <div className="space-y-2 ml-6">
                      {q.options.map((opt) => (
                        <label key={opt.val} className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="radio" 
                            name={`q${q.qNum}`} 
                            value={opt.val}
                            checked={answers[q.qNum] === opt.val}
                            onChange={() => handleInputChange(q.qNum, opt.val)}
                            disabled={submitted}
                            className="w-4 h-4 text-red-600 focus:ring-red-500"
                          />
                          <span className={`${answers[q.qNum] === opt.val ? 'font-bold' : ''}`}>{opt.label}</span>
                        </label>
                      ))}
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
{/* Questions 31-33 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 31–33<br/>Complete the information about the Great Barrier Reef.<br/>Write NO MORE THAN TWO WORDS for each answer.</div>
              
              <div className="space-y-6 leading-loose">
                <div className="flex flex-wrap items-center gap-2">
                  <span>The Great Barrier Reef is made up of 3,000 <b>31</b></span>
                  <input type="text" className={`w-48 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(31)}`} value={answers[31] || ""} onChange={(e) => handleInputChange(31, e.target.value)} disabled={submitted} />
                  <span>and</span>
                  {renderFeedback(31)}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span>600 <b>32</b></span>
                  <input type="text" className={`w-40 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(32)}`} value={answers[32] || ""} onChange={(e) => handleInputChange(32, e.target.value)} disabled={submitted} />
                  <span>. Over 400 kinds of <b>33</b></span>
                  <input type="text" className={`w-40 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(33)}`} value={answers[33] || ""} onChange={(e) => handleInputChange(33, e.target.value)} disabled={submitted} />
                  <span>can</span>
                  {renderFeedback(32)} {renderFeedback(33)}
                </div>
                <div>be found there.</div>
              </div>
            </div>

            {/* Questions 34-38 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 34–38<br/>Choose FIVE letters, A–I.<br/>Which FIVE of these kinds of animals inhabiting the Great Barrier Reef are mentioned?</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-6 max-w-sm mx-auto text-lg">
                <div>A sharks</div>
                <div>F dolphins</div>
                <div>B starfish</div>
                <div>G sea turtles</div>
                <div>C seahorses</div>
                <div>H crocodiles</div>
                <div>D clams</div>
                <div>I frogs</div>
                <div>E whales</div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {[34, 35, 36, 37, 38].map((num) => (
                  <div key={num} className="flex items-center gap-2">
                    <span className="font-bold">{num}</span>
                    <input 
                      type="text" 
                      maxLength="1"
                      placeholder="A-I"
                      className={`w-12 px-2 py-1 text-center bg-transparent border-b-2 outline-none transition-colors uppercase ${getStatusClass(num)}`} 
                      value={answers[num] || ""} 
                      onChange={(e) => handleInputChange(num, e.target.value)} 
                      disabled={submitted} 
                    />
                    {renderFeedback(num)}
                  </div>
                ))}
              </div>
            </div>

            {/* Questions 39-40 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 39 and 40<br/>Answer the questions below.<br/>Write NO MORE THAN THREE WORDS for each answer.</div>
              
              <div className="space-y-8">
                <div className="flex flex-col gap-2">
                  <div className="font-bold flex gap-2">
                    <span>39</span>
                    <span>What causes coral bleaching?</span>
                  </div>
                  <div className="ml-6 border-b-2 border-slate-300 dark:border-slate-600 flex">
                    <input type="text" className={`flex-1 px-3 py-1 bg-transparent outline-none transition-colors ${getStatusClass(39)}`} value={answers[39] || ""} onChange={(e) => handleInputChange(39, e.target.value)} disabled={submitted} />
                    {renderFeedback(39)}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="font-bold flex gap-2">
                    <span>40</span>
                    <span>What has been one response to this problem?</span>
                  </div>
                  <div className="ml-6 border-b-2 border-slate-300 dark:border-slate-600 flex">
                    <input type="text" className={`flex-1 px-3 py-1 bg-transparent outline-none transition-colors ${getStatusClass(40)}`} value={answers[40] || ""} onChange={(e) => handleInputChange(40, e.target.value)} disabled={submitted} />
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
      testTitle="Practice Test 6"
      audioSrc="/audios/LISTENING6.mp3"
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
