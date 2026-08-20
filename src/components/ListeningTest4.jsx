import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { listeningTest4Answers as answerKey } from "../data/listeningTest4";
import CdiListeningLayout from "./CdiListeningLayout";

export default function ListeningTest4({ onExit }) {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleInputChange = (qNum, value) => {
    setAnswers((prev) => ({ ...prev, [qNum]: value }));
  };

  const calculateScore = () => {let currentScore = 0;
    
    // Check all questions 1-40
    const regularQuestions = Array.from({ length: 40 }, (_, i) => i + 1);
    
    regularQuestions.forEach(i => {
      const userAnswer = (answers[i] || "").toLowerCase().trim();
      const validAnswers = answerKey[i] || [];
      if (validAnswers.includes(userAnswer)) {
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
{/* Questions 1-10 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 1–10<br/>Complete the form below.<br/>Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.</div>
              
              <div className="border border-slate-300 dark:border-slate-600 p-6 bg-white dark:bg-slate-800 min-w-[500px]">
                <div className="mb-6 flex justify-between">
                  <div>
                    Example:<br/>
                    Order taken by:
                  </div>
                  <div>
                    ClearPoint <span className="underline italic">Telephone Company</span><br/>
                    Customer Order Form<br/>
                    Ms. Jones
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-40 shrink-0">Name:</span>
                    <span>Harold <b>1</b></span>
                    <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(1)}`} value={answers[1] || ""} onChange={(e) => handleInputChange(1, e.target.value)} disabled={submitted} />
                    {renderFeedback(1)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="w-40 shrink-0">Address:</span>
                    <span><b>2</b></span>
                    <input type="text" className={`w-24 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(2)}`} value={answers[2] || ""} onChange={(e) => handleInputChange(2, e.target.value)} disabled={submitted} />
                    <span>Fulton Avenue, apartment 12</span>
                    {renderFeedback(2)}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-40 shrink-0">Type of service:</span>
                    <span><b>3</b></span>
                    <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(3)}`} value={answers[3] || ""} onChange={(e) => handleInputChange(3, e.target.value)} disabled={submitted} />
                    {renderFeedback(3)}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-40 shrink-0">Employer:</span>
                    <span>Wrightsville Medical Group</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-40 shrink-0">Occupation:</span>
                    <span><b>4</b></span>
                    <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(4)}`} value={answers[4] || ""} onChange={(e) => handleInputChange(4, e.target.value)} disabled={submitted} />
                    {renderFeedback(4)}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-40 shrink-0">Work phone:</span>
                    <span><b>5</b></span>
                    <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(5)}`} value={answers[5] || ""} onChange={(e) => handleInputChange(5, e.target.value)} disabled={submitted} />
                    {renderFeedback(5)}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-40 shrink-0">Time at current job:</span>
                    <span><b>6</b></span>
                    <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(6)}`} value={answers[6] || ""} onChange={(e) => handleInputChange(6, e.target.value)} disabled={submitted} />
                    {renderFeedback(6)}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-40 shrink-0">Special services:</span>
                    <span><b>7</b></span>
                    <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(7)}`} value={answers[7] || ""} onChange={(e) => handleInputChange(7, e.target.value)} disabled={submitted} />
                    <span><b>8</b></span>
                    <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(8)}`} value={answers[8] || ""} onChange={(e) => handleInputChange(8, e.target.value)} disabled={submitted} />
                    {renderFeedback(7)} {renderFeedback(8)}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-40 shrink-0">Installation scheduled for:</span>
                    <span>Day <b>9</b></span>
                    <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(9)}`} value={answers[9] || ""} onChange={(e) => handleInputChange(9, e.target.value)} disabled={submitted} />
                    <span>Time of day <b>10</b></span>
                    <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(10)}`} value={answers[10] || ""} onChange={(e) => handleInputChange(10, e.target.value)} disabled={submitted} />
                    {renderFeedback(9)} {renderFeedback(10)}
                  </div>

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
{/* Questions 11-14 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 11–14<br/>Choose the correct letter, A, B, or C.</div>
              
              <div className="space-y-6">
                {[
                  {
                    qNum: 11,
                    text: "The fair will take place at the",
                    options: [
                      { val: "a", label: "A fairgrounds." },
                      { val: "b", label: "B park." },
                      { val: "c", label: "C school." }
                    ]
                  },
                  {
                    qNum: 12,
                    text: "The fair will begin on Friday",
                    options: [
                      { val: "a", label: "A morning." },
                      { val: "b", label: "B afternoon." },
                      { val: "c", label: "C evening." }
                    ]
                  },
                  {
                    qNum: 13,
                    text: "The fair will begin with a",
                    options: [
                      { val: "a", label: "A parade." },
                      { val: "b", label: "B dance performance." },
                      { val: "c", label: "C speech by the mayor." }
                    ]
                  },
                  {
                    qNum: 14,
                    text: "There will be free admission on",
                    options: [
                      { val: "a", label: "A Friday." },
                      { val: "b", label: "B Saturday." },
                      { val: "c", label: "C Sunday." }
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

            {/* Questions 15-20 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 15–20<br/>Complete the chart below.<br/>Write NO MORE THAN ONE WORD for each answer.</div>
              
              <table className="w-full text-left border-collapse border border-slate-300 dark:border-slate-600 min-w-[600px]">
                <thead>
                  <tr className="bg-slate-700 text-white dark:bg-slate-900">
                    <th className="p-3 border border-slate-300 dark:border-slate-600">Day/Time</th>
                    <th className="p-3 border border-slate-300 dark:border-slate-600">Event</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800">
                  <tr>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">Saturday afternoon</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600 bg-slate-200/50 dark:bg-slate-700">
                      <b>15</b> <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(15)}`} value={answers[15] || ""} onChange={(e) => handleInputChange(15, e.target.value)} disabled={submitted} /> show {renderFeedback(15)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">Saturday evening</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600 bg-slate-200/50 dark:bg-slate-700">
                      <b>16</b> <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(16)}`} value={answers[16] || ""} onChange={(e) => handleInputChange(16, e.target.value)} disabled={submitted} /> by the lake {renderFeedback(16)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">Sunday afternoon</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600 bg-slate-200/50 dark:bg-slate-700">
                      <b>17</b> <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(17)}`} value={answers[17] || ""} onChange={(e) => handleInputChange(17, e.target.value)} disabled={submitted} /> contest {renderFeedback(17)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-slate-300 dark:border-slate-600">All weekend</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-600 bg-slate-200/50 dark:bg-slate-700">
                      <div className="space-y-4">
                        <div>
                          <b>18</b> <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(18)}`} value={answers[18] || ""} onChange={(e) => handleInputChange(18, e.target.value)} disabled={submitted} /> food {renderFeedback(18)}
                        </div>
                        <div>
                          <b>19</b> <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(19)}`} value={answers[19] || ""} onChange={(e) => handleInputChange(19, e.target.value)} disabled={submitted} /> for children {renderFeedback(19)}
                        </div>
                        <div>
                          <b>20</b> <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(20)}`} value={answers[20] || ""} onChange={(e) => handleInputChange(20, e.target.value)} disabled={submitted} /> for sale {renderFeedback(20)}
                        </div>
                      </div>
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
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 21–23<br/>Complete the information below.<br/>Write NO MORE THAN TWO WORDS for each answer.</div>
              
              <div className="border border-slate-300 dark:border-slate-600 p-6 bg-white dark:bg-slate-800">
                <div className="font-bold mb-4">How to get academic credit for work experience</div>
                
                <div className="space-y-4 leading-loose">
                  <div>
                    First, read the <b>21</b> <input type="text" className={`w-48 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(21)}`} value={answers[21] || ""} onChange={(e) => handleInputChange(21, e.target.value)} disabled={submitted} /> {renderFeedback(21)}
                    . Find courses that match your work experience. Then write <b>22</b> <input type="text" className={`w-40 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(22)}`} value={answers[22] || ""} onChange={(e) => handleInputChange(22, e.target.value)} disabled={submitted} /> {renderFeedback(22)}
                    of your work experience. Submit that together with a letter from your <b>23</b> <input type="text" className={`w-40 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(23)}`} value={answers[23] || ""} onChange={(e) => handleInputChange(23, e.target.value)} disabled={submitted} /> {renderFeedback(23)}
                    to the university admissions office.
                  </div>
                </div>
              </div>
            </div>

            {/* Questions 24-28 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 24–28<br/>Where can the items listed below be found?</div>
              
              <div className="bg-slate-200 dark:bg-slate-700 p-6 rounded-xl border-4 border-slate-300 dark:border-slate-600 mb-6 max-w-sm mx-auto shadow-inner">
                <div className="space-y-2 font-bold">
                  <div>A admissions office</div>
                  <div>B counseling center</div>
                  <div>C library</div>
                </div>
              </div>

              <div className="italic mb-4">Write the correct letter, A, B, or C, next to questions 24–28.</div>

              <div className="space-y-4 max-w-sm mx-auto">
                {[
                  { num: 24, text: "university catalog" },
                  { num: 25, text: "application for admission form" },
                  { num: 26, text: "requirements list" },
                  { num: 27, text: "recommendation forms" },
                  { num: 28, text: "job listings" }
                ].map((q) => (
                  <div key={q.num} className="flex items-center gap-3">
                    <span className="font-bold">{q.num}</span>
                    <span className="flex-1">{q.text}</span>
                    <input 
                      type="text" 
                      maxLength="1"
                      placeholder="A, B, C"
                      className={`w-16 px-2 py-1 text-center bg-transparent border-b-2 outline-none transition-colors uppercase ${getStatusClass(q.num)}`} 
                      value={answers[q.num] || ""} 
                      onChange={(e) => handleInputChange(q.num, e.target.value)} 
                      disabled={submitted} 
                    />
                    {renderFeedback(q.num)}
                  </div>
                ))}
              </div>
            </div>

            {/* Questions 29-30 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 29 and 30<br/>Choose the correct letters, A, B, or C.</div>
              
              <div className="space-y-6">
                {[
                  {
                    qNum: 29,
                    text: "What are full-time students eligible for?",
                    options: [
                      { val: "a", label: "A Discounted books" },
                      { val: "b", label: "B The work-study program" },
                      { val: "c", label: "C A free bus pass" }
                    ]
                  },
                  {
                    qNum: 30,
                    text: "How can a student get financial assistance?",
                    options: [
                      { val: "a", label: "A Speak with a counselor" },
                      { val: "b", label: "B Apply to the admissions office" },
                      { val: "c", label: "C Make arrangements with a bank" }
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
{/* Questions 31-35 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 31–35<br/>Complete the chart with information about the black bear.<br/>Write NO MORE THAN TWO WORDS for each answer.</div>
              
              <div className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 min-w-[600px]">
                <table className="w-full text-left">
                  <tbody>
                    <tr className="border-b border-slate-300 dark:border-slate-600">
                      <td className="p-4 w-1/4 align-top">Range</td>
                      <td className="p-4 w-3/4 align-top bg-slate-200/50 dark:bg-slate-700">
                        Lives in <b>31</b> <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(31)}`} value={answers[31] || ""} onChange={(e) => handleInputChange(31, e.target.value)} disabled={submitted} /> of North America {renderFeedback(31)}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300 dark:border-slate-600">
                      <td className="p-4 w-1/4 align-top">Diet</td>
                      <td className="p-4 w-3/4 align-top bg-slate-200/50 dark:bg-slate-700 space-y-2">
                        <div>Ninety percent of diet consists of <b>32</b> <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(32)}`} value={answers[32] || ""} onChange={(e) => handleInputChange(32, e.target.value)} disabled={submitted} /> . {renderFeedback(32)}</div>
                        <div>Also eats <b>33</b> <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(33)}`} value={answers[33] || ""} onChange={(e) => handleInputChange(33, e.target.value)} disabled={submitted} /> . {renderFeedback(33)}</div>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300 dark:border-slate-600">
                      <td className="p-4 w-1/4 align-top">Cubs</td>
                      <td className="p-4 w-3/4 align-top bg-slate-200/50 dark:bg-slate-700">
                        Baby bear cubs are born in <b>34</b> <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(34)}`} value={answers[34] || ""} onChange={(e) => handleInputChange(34, e.target.value)} disabled={submitted} /> . {renderFeedback(34)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 w-1/4 align-top">Life span</td>
                      <td className="p-4 w-3/4 align-top bg-slate-200/50 dark:bg-slate-700">
                        Black bears live for about <b>35</b> <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(35)}`} value={answers[35] || ""} onChange={(e) => handleInputChange(35, e.target.value)} disabled={submitted} /> in the wild. {renderFeedback(35)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Questions 36-40 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 36–40<br/>Which characteristics fit black bears and which fit grizzly bears?<br/>Write A if it is a characteristic of black bears. Write B if it is a characteristic of grizzly bears.</div>
              
              <div className="space-y-4 max-w-sm mx-auto mt-8">
                {[
                  { num: 36, text: "Has a patch of light fur on its chest" },
                  { num: 37, text: "Weighs 225 kilos" },
                  { num: 38, text: "Has a shoulder hump" },
                  { num: 39, text: "Has pointed ears" },
                  { num: 40, text: "Has shorter claws" }
                ].map((q) => (
                  <div key={q.num} className="flex items-center gap-3 justify-between">
                    <span className="font-bold w-6">{q.num}</span>
                    <span className="flex-1">{q.text}</span>
                    <input 
                      type="text" 
                      maxLength="1"
                      placeholder="A / B"
                      className={`w-16 px-2 py-1 text-center bg-transparent border-b-2 outline-none transition-colors uppercase ${getStatusClass(q.num)}`} 
                      value={answers[q.num] || ""} 
                      onChange={(e) => handleInputChange(q.num, e.target.value)} 
                      disabled={submitted} 
                    />
                    {renderFeedback(q.num)}
                  </div>
                ))}
              </div>

</div>
</>
        </div>
      )
    }
  ];

  return (
    <CdiListeningLayout
      testTitle="Practice Test 4"
      audioSrc="/audios/LISTENING4.mp3"
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
