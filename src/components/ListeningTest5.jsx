import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { listeningTest5Answers as answerKey } from "../data/listeningTest5";
import CdiListeningLayout from "./CdiListeningLayout";

export default function ListeningTest5({ onExit }) {
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
    const userAnswers8to10 = [
      (answers[8] || "").toLowerCase().trim(),
      (answers[9] || "").toLowerCase().trim(),
      (answers[10] || "").toLowerCase().trim()
    ].filter(a => a);

    const userAnswers21to25 = [
      (answers[21] || "").toLowerCase().trim(),
      (answers[22] || "").toLowerCase().trim(),
      (answers[23] || "").toLowerCase().trim(),
      (answers[24] || "").toLowerCase().trim(),
      (answers[25] || "").toLowerCase().trim()
    ].filter(a => a);
    
    // Check all questions 1-40
    const regularQuestions = Array.from({ length: 40 }, (_, i) => i + 1);
    
    regularQuestions.forEach(i => {
      const userAnswer = (answers[i] || "").toLowerCase().trim();
      const validAnswers = answerKey[i] || [];
      
      // Special logic for 8-10 (any 3 of the correct options)
      if (i >= 8 && i <= 10) {
        if (validAnswers.includes(userAnswer)) {
          // Check if this answer was already counted in a previous question
          const firstOccurrence = userAnswers8to10.indexOf(userAnswer);
          const currentOccurrence = [8,9,10].indexOf(i);
          if (firstOccurrence === currentOccurrence) {
            currentScore++;
          }
        }
      }
      // Special logic for 21-25 (any 5 of the correct options)
      else if (i >= 21 && i <= 25) {
        if (validAnswers.includes(userAnswer)) {
          // Check if this answer was already counted
          const firstOccurrence = userAnswers21to25.indexOf(userAnswer);
          const currentOccurrence = [21,22,23,24,25].indexOf(i);
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
{/* Questions 1-4 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 1–4<br/>Complete the form below.<br/>Write NO MORE THAN ONE WORD AND/OR A NUMBER for each answer.</div>
              
              <div className="border border-slate-300 dark:border-slate-600 p-6 bg-white dark:bg-slate-800 min-w-[500px]">
                <div className="space-y-4">
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-40 shrink-0">Example:</span>
                    <span className="underline italic text-slate-500">Global</span> <span>Bicycle Tours</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-40 shrink-0">Tour name:</span>
                    <span className="underline italic text-slate-500">River Valley tour</span>
                    <span className="ml-4">Tour month: <b>1</b></span>
                    <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(1)}`} value={answers[1] || ""} onChange={(e) => handleInputChange(1, e.target.value)} disabled={submitted} />
                    {renderFeedback(1)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="w-40 shrink-0">Customer Name:</span>
                    <span><b>2</b></span>
                    <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(2)}`} value={answers[2] || ""} onChange={(e) => handleInputChange(2, e.target.value)} disabled={submitted} />
                    <span className="underline italic text-slate-500">Schmidt</span>
                    {renderFeedback(2)}
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-40 shrink-0 mt-1">Address:</span>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="underline italic text-slate-500">P.O. Box</span>
                        <span><b>3</b></span>
                        <input type="text" className={`w-24 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(3)}`} value={answers[3] || ""} onChange={(e) => handleInputChange(3, e.target.value)} disabled={submitted} />
                        {renderFeedback(3)}
                      </div>
                      <div className="underline italic text-slate-500">Manchester</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-40 shrink-0">Bicycle rental required?</span>
                    <span>___ Yes</span>
                    <span className="underline italic text-slate-500 ml-2">X</span> <span>No</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-40 shrink-0">Dietary restrictions:</span>
                    <span><b>4</b></span>
                    <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(4)}`} value={answers[4] || ""} onChange={(e) => handleInputChange(4, e.target.value)} disabled={submitted} />
                    {renderFeedback(4)}
                  </div>

                </div>
              </div>
            </div>

            {/* Questions 5-7 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 5–7<br/>Choose the correct letters, A, B, or C.</div>
              
              <div className="space-y-6">
                {[
                  {
                    qNum: 5,
                    text: "What size deposit does the caller have to pay?",
                    options: [
                      { val: "a", label: "A 5 percent" },
                      { val: "b", label: "B 30 percent" },
                      { val: "c", label: "C 50 percent" }
                    ]
                  },
                  {
                    qNum: 6,
                    text: "When does the deposit have to be paid?",
                    options: [
                      { val: "a", label: "A Two weeks from now" },
                      { val: "b", label: "B Four weeks from now" },
                      { val: "c", label: "C Six weeks from now" }
                    ]
                  },
                  {
                    qNum: 7,
                    text: "How will the luggage be carried?",
                    options: [
                      { val: "a", label: "A By bus" },
                      { val: "b", label: "B By bicycle" },
                      { val: "c", label: "C By van" }
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

            {/* Questions 8-10 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 8–10<br/>Choose THREE letters, A–F.<br/>Which THREE things should the caller take on the tour?</div>
              
              <div className="grid grid-cols-2 gap-y-2 gap-x-8 mb-6 max-w-sm mx-auto">
                <div>A raincoat</div>
                <div>D water bottle</div>
                <div>B spare tire</div>
                <div>E camera</div>
                <div>C maps</div>
                <div>F guide book</div>
              </div>

              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                {[8, 9, 10].map((num) => (
                  <div key={num} className="flex items-center gap-3">
                    <span className="font-bold">{num}</span>
                    <input 
                      type="text" 
                      maxLength="1"
                      placeholder="A-F"
                      className={`w-16 px-3 py-1 text-center bg-transparent border-b-2 outline-none transition-colors uppercase ${getStatusClass(num)}`} 
                      value={answers[num] || ""} 
                      onChange={(e) => handleInputChange(num, e.target.value)} 
                      disabled={submitted} 
                    />
                    {renderFeedback(num)}
                  </div>
                ))}
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
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 11–15<br/>What change has been made to each part of the health club?<br/>Write the correct letter, A–F next to questions 11–15.</div>
              
              <div className="bg-slate-200 dark:bg-slate-700 p-6 rounded-xl border-4 border-slate-300 dark:border-slate-600 mb-6 max-w-sm mx-auto shadow-inner text-center">
                <div className="font-bold mb-2">HARTFORD HEALTH CLUB</div>
                <div className="space-y-1 text-left inline-block">
                  <div><b>A</b> installed a new floor</div>
                  <div><b>B</b> repainted</div>
                  <div><b>C</b> moved to a new location</div>
                  <div><b>D</b> rebuilt</div>
                  <div><b>E</b> enlarged</div>
                  <div><b>F</b> replaced the equipment</div>
                </div>
              </div>

              <div className="font-bold mb-4">Part of the health club</div>

              <div className="space-y-4 max-w-sm mx-auto">
                {[
                  { num: 11, text: "swimming pools" },
                  { num: 12, text: "locker rooms" },
                  { num: 13, text: "exercise room" },
                  { num: 14, text: "tennis court" },
                  { num: 15, text: "club store" }
                ].map((q) => (
                  <div key={q.num} className="flex items-center justify-between gap-3">
                    <span className="font-bold w-6">{q.num}</span>
                    <span className="flex-1">{q.text}</span>
                    <input 
                      type="text" 
                      maxLength="1"
                      placeholder="A-F"
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

            {/* Questions 16-18 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 16–18<br/>Complete the sentences below.<br/>Write NO MORE THAN TWO WORDS for each answer.</div>
              
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2 leading-loose">
                  <span><b>16</b> Tomorrow,</span>
                  <input type="text" className={`w-48 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(16)}`} value={answers[16] || ""} onChange={(e) => handleInputChange(16, e.target.value)} disabled={submitted} />
                  <span>for adults and children will start.</span>
                  {renderFeedback(16)}
                </div>
                <div className="flex flex-wrap items-center gap-2 leading-loose">
                  <span><b>17</b> On Wednesday, there will be a</span>
                  <input type="text" className={`w-48 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(17)}`} value={answers[17] || ""} onChange={(e) => handleInputChange(17, e.target.value)} disabled={submitted} />.
                  {renderFeedback(17)}
                </div>
                <div className="flex flex-wrap items-center gap-2 leading-loose">
                  <span><b>18</b> A</span>
                  <input type="text" className={`w-40 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(18)}`} value={answers[18] || ""} onChange={(e) => handleInputChange(18, e.target.value)} disabled={submitted} />
                  <span>is planned for next weekend.</span>
                  {renderFeedback(18)}
                </div>
              </div>
            </div>

            {/* Questions 19-20 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 19 and 20<br/>Answer the questions below.<br/>Choose the correct letter, A, B, or C.</div>
              
              <div className="space-y-6">
                {[
                  {
                    qNum: 19,
                    text: "How many months did it take to complete the renovation work?",
                    options: [
                      { val: "a", label: "A three" },
                      { val: "b", label: "B nine" },
                      { val: "c", label: "C twelve" }
                    ]
                  },
                  {
                    qNum: 20,
                    text: "What project is planned for next year?",
                    options: [
                      { val: "a", label: "A An indoor pool" },
                      { val: "b", label: "B An outdoor tennis court" },
                      { val: "c", label: "C An outdoor pool" }
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
      id: 3,
      title: "Part 3",
      questions: "21-30",
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          <>
{/* Questions 21-25 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 21–25<br/>Choose FIVE letters, A–I.<br/>What FIVE things will the students do during their museum internship?</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-6 max-w-lg mx-auto">
                <div>A art conservation</div>
                <div>F research</div>
                <div>B administrative duties</div>
                <div>G write brochures</div>
                <div>C guide tours</div>
                <div>H plan a reception</div>
                <div>D attend board meetings</div>
                <div>I meet artists</div>
                <div>E give classes</div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {[21, 22, 23, 24, 25].map((num) => (
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

            {/* Questions 26-30 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 26–30<br/>Complete the notes below.<br/>Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.</div>
              
              <div className="border border-slate-300 dark:border-slate-600 p-6 bg-white dark:bg-slate-800 min-w-[600px] leading-loose">
                <div className="text-center font-bold mb-6">City Art Museum</div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span>The main part of museum was built in <b>26</b></span>
                    <input type="text" className={`w-32 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(26)}`} value={answers[26] || ""} onChange={(e) => handleInputChange(26, e.target.value)} disabled={submitted} />
                    {renderFeedback(26)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span>The <b>27</b></span>
                    <input type="text" className={`w-40 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(27)}`} value={answers[27] || ""} onChange={(e) => handleInputChange(27, e.target.value)} disabled={submitted} />
                    <span>was built sixty years later.</span>
                    {renderFeedback(27)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span>Collections: modern art, works by <b>28</b></span>
                    <input type="text" className={`w-48 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(28)}`} value={answers[28] || ""} onChange={(e) => handleInputChange(28, e.target.value)} disabled={submitted} />
                    <span>, sculpture, European art.</span>
                    {renderFeedback(28)}
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="mt-1">Classes: <b>29</b></span>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <input type="text" className={`w-48 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(29)}`} value={answers[29] || ""} onChange={(e) => handleInputChange(29, e.target.value)} disabled={submitted} />
                        <span>classes for adults</span>
                        {renderFeedback(29)}
                      </div>
                      <div>Arts and crafts workshops for children</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span>Weekly <b>30</b></span>
                    <input type="text" className={`w-48 px-2 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(30)}`} value={answers[30] || ""} onChange={(e) => handleInputChange(30, e.target.value)} disabled={submitted} />
                    <span>in the fall and winter</span>
                    {renderFeedback(30)}
                  </div>
                </div>
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
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 31–35<br/>Choose the correct letter, A, B, or C.</div>
              
              <div className="space-y-6">
                {[
                  {
                    qNum: 31,
                    text: "The tomato originally came from",
                    options: [
                      { val: "a", label: "A Mexico." },
                      { val: "b", label: "B Spain." },
                      { val: "c", label: "C Peru." }
                    ]
                  },
                  {
                    qNum: 32,
                    text: "The original color of the tomato was",
                    options: [
                      { val: "a", label: "A red." },
                      { val: "b", label: "B green." },
                      { val: "c", label: "C yellow." }
                    ]
                  },
                  {
                    qNum: 33,
                    text: "The Aztec word for tomato means",
                    options: [
                      { val: "a", label: "A golden apple." },
                      { val: "b", label: "B plump thing." },
                      { val: "c", label: "C small fruit." }
                    ]
                  },
                  {
                    qNum: 34,
                    text: "In the 1500s, people in Spain and Italy",
                    options: [
                      { val: "a", label: "A enjoyed eating tomatoes." },
                      { val: "b", label: "B used tomatoes as ornamental plants." },
                      { val: "c", label: "C made medicine from tomatoes." }
                    ]
                  },
                  {
                    qNum: 35,
                    text: "In the 1600s, the British",
                    options: [
                      { val: "a", label: "A saw tomatoes as poisonous." },
                      { val: "b", label: "B published tomato recipes." },
                      { val: "c", label: "C ate tomato sauce daily." }
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

            {/* Questions 36-40 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 36–40<br/>Complete the timeline with information about the history of the tomato in the United States.<br/>Write NO MORE THAN TWO WORDS for each answer.</div>
              
              <div className="mt-8 space-y-6 min-w-[600px] leading-loose">
                <div className="flex items-center gap-4">
                  <span className="w-16 shrink-0 text-slate-500 font-bold">1806</span>
                  <span>Tomatoes were mentioned as food in <b>36</b></span>
                  <input type="text" className={`w-48 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(36)}`} value={answers[36] || ""} onChange={(e) => handleInputChange(36, e.target.value)} disabled={submitted} />
                  {renderFeedback(36)}
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="w-16 shrink-0 text-slate-500 font-bold">1809</span>
                  <span>Thomas Jefferson <b>37</b></span>
                  <input type="text" className={`w-40 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(37)}`} value={answers[37] || ""} onChange={(e) => handleInputChange(37, e.target.value)} disabled={submitted} />
                  <span>at his home in Virginia.</span>
                  {renderFeedback(37)}
                </div>
                
                <div className="flex items-start gap-4">
                  <span className="w-16 shrink-0 text-slate-500 font-bold mt-1">1820</span>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span>A man proved that tomatoes were not poisonous by eating them</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span><b>38</b></span>
                      <input type="text" className={`w-40 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(38)}`} value={answers[38] || ""} onChange={(e) => handleInputChange(38, e.target.value)} disabled={submitted} />
                      {renderFeedback(38)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="w-16 shrink-0 text-slate-500 font-bold">1830s</span>
                  <span><b>39</b></span>
                  <input type="text" className={`w-40 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(39)}`} value={answers[39] || ""} onChange={(e) => handleInputChange(39, e.target.value)} disabled={submitted} />
                  <span>appeared in newspapers and magazines.</span>
                  {renderFeedback(39)}
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="w-16 shrink-0 text-slate-500 font-bold">1930s</span>
                  <span>People began to eat <b>40</b></span>
                  <input type="text" className={`w-40 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(40)}`} value={answers[40] || ""} onChange={(e) => handleInputChange(40, e.target.value)} disabled={submitted} />
                  {renderFeedback(40)}
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
      testTitle="Practice Test 5"
      audioSrc="/audios/LISTENING5.mp3"
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
