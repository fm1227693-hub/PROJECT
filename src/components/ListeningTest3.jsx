import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaPlay, FaPause } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { listeningTest3Answers as answerKey3 } from "../data/listeningTest3";

export default function ListeningTest3() {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Audio Player State
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Audio functions
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setCurrentTime(current);
    setProgress((current / total) * 100);
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const changeSpeed = (rate) => {
    audioRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleInputChange = (qNum, value) => {
    setAnswers({ ...answers, [qNum]: value });
  };

  const handleCheckboxChange = (qNum, option) => {
    setAnswers({ ...answers, [qNum]: option });
  };

  const calculateScore = () => {
    let currentScore = 0;
    
    // Check questions 1-4, 8-40
    const regularQuestions = [1,2,3,4,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40];
    
    regularQuestions.forEach(i => {
      const userAnswer = (answers[i] || "").toLowerCase().trim();
      const validAnswers = answerKey3[i] || [];
      if (validAnswers.includes(userAnswer)) {
        currentScore++;
      }
    });

    // Handle questions 5-7 (Choose THREE letters A-G in any order)
    const valid5to7 = ["c", "f", "g"];
    const userAnswers5to7 = [
      (answers[5] || "").toLowerCase().trim(),
      (answers[6] || "").toLowerCase().trim(),
      (answers[7] || "").toLowerCase().trim()
    ];
    
    let matchedLetters = [];
    userAnswers5to7.forEach(ans => {
      // Check if it starts with the valid letter, because user might type 'c', 'c shopping mall', etc.
      // But since they are multiple choice inputs, they will just hold the letter 'a', 'b', 'c', etc.
      if (valid5to7.includes(ans) && !matchedLetters.includes(ans)) {
        matchedLetters.push(ans);
        currentScore++;
      }
    });

    setScore(currentScore);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusClass = (qNum) => {
    if (!submitted) return "border-slate-300 dark:border-slate-600 focus:border-red-500";
    const userAnswer = (answers[qNum] || "").toLowerCase().trim();
    
    // Logic for 5-7
    if ([5, 6, 7].includes(qNum)) {
       const valid5to7 = ["c", "f", "g"];
       if (valid5to7.includes(userAnswer)) {
         return "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
       }
       return "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
    }

    const validAnswers = answerKey3[qNum] || [];
    if (validAnswers.includes(userAnswer)) {
      return "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
    }
    return "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
  };

  const renderFeedback = (qNum) => {
    if (!submitted) return null;
    const userAnswer = (answers[qNum] || "").toLowerCase().trim();
    
    if ([5, 6, 7].includes(qNum)) {
      const valid5to7 = ["c", "f", "g"];
      const isCorrect = valid5to7.includes(userAnswer);
      return (
        <span className="ml-2 inline-flex items-center">
          {isCorrect ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <span className="flex items-center gap-2">
              <FaTimesCircle className="text-red-500" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded">
                Valid: C, F, G
              </span>
            </span>
          )}
        </span>
      );
    }

    const validAnswers = answerKey3[qNum] || [];
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
      <div className="sticky top-[84px] z-40 max-w-[1000px] mx-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-sm mb-8 py-3 rounded-2xl">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-bold text-red-600 hidden md:block w-48 shrink-0">Practice Test 3 Audio</div>
          
          <audio 
            ref={audioRef}
            src="/audios/LISTENING3.mp3" 
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Custom Audio UI */}
          <div className="flex-1 w-full flex items-center gap-3 sm:gap-4">
            <button 
              onClick={togglePlay}
              className="w-10 h-10 shrink-0 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-transform hover:scale-105"
            >
              {isPlaying ? <FaPause className="w-4 h-4" /> : <FaPlay className="w-4 h-4 ml-1" />}
            </button>

            <span className="text-xs font-mono font-medium opacity-70 shrink-0">{formatTime(currentTime)}</span>
            
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={progress || 0}
              onChange={handleProgressChange}
              className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            
            <span className="text-xs font-mono font-medium opacity-70 shrink-0">{formatTime(duration)}</span>

            {/* Speed Control */}
            <div className="relative shrink-0">
              <button 
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-300 dark:border-slate-600"
              >
                {playbackRate}x
              </button>
              
              {showSpeedMenu && (
                <div className="absolute right-0 top-full mt-2 w-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                  {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => changeSpeed(rate)}
                      className={`block w-full text-center px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${playbackRate === rate ? 'font-bold text-red-600 dark:text-red-400' : ''}`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

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
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 1–4<br/>Complete the form below.<br/>Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.</div>
              
              <div className="border border-slate-300 dark:border-slate-600 p-6 bg-white dark:bg-slate-800">
                <div className="mb-6">
                  <div>Example: <span className="underline italic">Grandview</span> Hotel</div>
                  <div className="text-center mt-2 font-bold">Reservation Form</div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span>Arrival date: <b>1</b></span>
                    <input type="text" className={`w-32 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(1)}`} value={answers[1] || ""} onChange={(e) => handleInputChange(1, e.target.value)} disabled={submitted} />
                    <span>13th.</span>
                    {renderFeedback(1)}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span>Number of nights: <b>2</b></span>
                    <input type="text" className={`w-24 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(2)}`} value={answers[2] || ""} onChange={(e) => handleInputChange(2, e.target.value)} disabled={submitted} />
                    {renderFeedback(2)}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span>Number of guests: 2</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span>Guest name: Roxanne <b>3</b></span>
                    <input type="text" className={`w-40 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(3)}`} value={answers[3] || ""} onChange={(e) => handleInputChange(3, e.target.value)} disabled={submitted} />
                    {renderFeedback(3)}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span>Credit card number <b>4</b></span>
                    <input type="text" className={`w-48 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(4)}`} value={answers[4] || ""} onChange={(e) => handleInputChange(4, e.target.value)} disabled={submitted} />
                    {renderFeedback(4)}
                  </div>
                </div>
              </div>
            </div>

            {/* Questions 5-7 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 5–7<br/>Choose THREE letters, A–G.<br/>Which THREE places will the caller visit?</div>
              
              <div className="space-y-2 mb-6">
                <div>A. art museum</div>
                <div>B. science museum</div>
                <div>C. shopping mall</div>
                <div>D. monument</div>
                <div>E. post office</div>
                <div>F. restaurant</div>
                <div>G. park</div>
              </div>

              <div className="flex flex-col gap-4">
                {[5, 6, 7].map((num) => (
                  <div key={num} className="flex items-center gap-3">
                    <span className="font-bold">{num}</span>
                    <input 
                      type="text" 
                      maxLength="1"
                      placeholder="A-G"
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

            {/* Questions 8-10 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 8–10<br/>Choose the correct letters, A, B, or C.</div>
              
              <div className="space-y-6">
                {[
                  {
                    qNum: 8,
                    text: "When will the caller arrive at the airport?",
                    options: [
                      { val: "a", label: "In the morning" },
                      { val: "b", label: "In the afternoon" },
                      { val: "c", label: "At night" }
                    ]
                  },
                  {
                    qNum: 9,
                    text: "How will the caller get to the hotel?",
                    options: [
                      { val: "a", label: "Subway" },
                      { val: "b", label: "Bus" },
                      { val: "c", label: "Taxi" }
                    ]
                  },
                  {
                    qNum: 10,
                    text: "What time does the hotel front desk close?",
                    options: [
                      { val: "a", label: "10:00" },
                      { val: "b", label: "12:00" },
                      { val: "c", label: "2:00" }
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
                            onChange={() => handleCheckboxChange(q.qNum, opt.val)}
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
          </div>

          {/* SECTION 2 */}
          <div className="p-6 sm:p-10 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black mb-2">SECTION 2</h2>
              <h3 className="text-lg font-bold text-slate-500">QUESTIONS 11–20</h3>
            </div>

            {/* Questions 11 and 12 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 11 and 12<br/>Complete the information below.<br/>Write ONE NUMBER for each answer.</div>
              
              <div className="border border-slate-300 dark:border-slate-600 p-6 bg-white dark:bg-slate-800 text-center mx-auto max-w-md">
                <div className="font-bold mb-6">
                  City Tours<br/>Fare Information
                </div>
                <div className="flex flex-col gap-4 text-left px-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span>Adult All-Day Pass: </span>
                    <span className="font-bold">11</span>
                    <span>$</span>
                    <input type="text" className={`w-24 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(11)}`} value={answers[11] || ""} onChange={(e) => handleInputChange(11, e.target.value)} disabled={submitted} />
                    {renderFeedback(11)}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span>Children ages 5–12 All-Day Pass: </span>
                    <span className="font-bold">12</span>
                    <span>$</span>
                    <input type="text" className={`w-24 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(12)}`} value={answers[12] || ""} onChange={(e) => handleInputChange(12, e.target.value)} disabled={submitted} />
                    {renderFeedback(12)}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span>Children under age 5: Free</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions 13-15 Map */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 13–15<br/>Label the map below.<br/>Write NO MORE THAN TWO WORDS for each answer.</div>
              
              <div className="relative w-full max-w-[600px] aspect-[4/3] bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 p-4 sm:p-8 mx-auto flex flex-col justify-between">
                
                <div className="flex justify-end pr-8">
                  <div className="flex flex-col gap-6 w-48">
                    <div>
                      <div>5th stop</div>
                      <div className="flex items-center gap-1 font-bold">
                        15. <input type="text" className={`w-24 px-1 py-1 bg-transparent border-b-2 outline-none text-sm ${getStatusClass(15)}`} value={answers[15] || ""} onChange={(e) => handleInputChange(15, e.target.value)} disabled={submitted} />
                        {renderFeedback(15)}
                      </div>
                    </div>
                    
                    <div>
                      <div>4th stop</div>
                      <div>Shopping District</div>
                      <div className="mt-1 p-2 border border-black dark:border-white inline-block">DANNY'S</div>
                    </div>
                  </div>
                  <div className="w-1 bg-black dark:bg-white h-48 mt-2 mr-10 relative">
                     {/* Vertical road */}
                  </div>
                </div>

                <div className="w-full h-1 bg-black dark:bg-white relative">
                   {/* Horizontal road */}
                </div>

                <div className="flex justify-between items-start mt-4 text-sm">
                  <div>
                    <div>Starting point:</div>
                    <div>Tour Bus Office</div>
                    <div className="mt-2 text-3xl">🚌</div>
                  </div>
                  <div>
                    <div>1st stop</div>
                    <div className="flex items-center gap-1 font-bold">
                      13. <input type="text" className={`w-20 px-1 py-1 bg-transparent border-b-2 outline-none ${getStatusClass(13)}`} value={answers[13] || ""} onChange={(e) => handleInputChange(13, e.target.value)} disabled={submitted} />
                      {renderFeedback(13)}
                    </div>
                  </div>
                  <div>
                    <div>2nd stop</div>
                    <div>Fishing Docks</div>
                    <div className="mt-2 text-3xl">🎣</div>
                  </div>
                  <div>
                    <div>3rd stop</div>
                    <div className="flex flex-col gap-1 font-bold">
                      14. <input type="text" className={`w-24 px-1 py-1 bg-transparent border-b-2 outline-none ${getStatusClass(14)}`} value={answers[14] || ""} onChange={(e) => handleInputChange(14, e.target.value)} disabled={submitted} />
                      {renderFeedback(14)}
                    </div>
                  </div>
                </div>
                
              </div>
            </div>

            {/* Questions 16-20 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 16–20<br/>Complete the chart below.<br/>Write NO MORE THAN ONE WORD for each answer.</div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-slate-300 dark:border-slate-600">
                  <thead>
                    <tr className="bg-slate-200 dark:bg-slate-700">
                      <th className="p-3 border border-slate-300 dark:border-slate-600">Place</th>
                      <th className="p-3 border border-slate-300 dark:border-slate-600">Activity</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800">
                    <tr>
                      <td className="p-3 border border-slate-300 dark:border-slate-600">First stop</td>
                      <td className="p-3 border border-slate-300 dark:border-slate-600 flex items-center gap-2">
                        Enjoy the <b>16</b>
                        <input type="text" className={`w-24 px-2 bg-transparent border-b-2 outline-none ${getStatusClass(16)}`} value={answers[16] || ""} onChange={(e) => handleInputChange(16, e.target.value)} disabled={submitted} />
                        of the bay {renderFeedback(16)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-slate-300 dark:border-slate-600">Second stop</td>
                      <td className="p-3 border border-slate-300 dark:border-slate-600 flex items-center gap-2">
                        Look at the <b>17</b>
                        <input type="text" className={`w-24 px-2 bg-transparent border-b-2 outline-none ${getStatusClass(17)}`} value={answers[17] || ""} onChange={(e) => handleInputChange(17, e.target.value)} disabled={submitted} />
                        {renderFeedback(17)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-slate-300 dark:border-slate-600">Third stop</td>
                      <td className="p-3 border border-slate-300 dark:border-slate-600 flex items-center gap-2">
                        <b>18</b>
                        <input type="text" className={`w-24 px-2 bg-transparent border-b-2 outline-none ${getStatusClass(18)}`} value={answers[18] || ""} onChange={(e) => handleInputChange(18, e.target.value)} disabled={submitted} />
                        fish. {renderFeedback(18)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-slate-300 dark:border-slate-600">Fourth stop</td>
                      <td className="p-3 border border-slate-300 dark:border-slate-600 flex items-center gap-2">
                        Purchase <b>19</b>
                        <input type="text" className={`w-24 px-2 bg-transparent border-b-2 outline-none ${getStatusClass(19)}`} value={answers[19] || ""} onChange={(e) => handleInputChange(19, e.target.value)} disabled={submitted} />
                        {renderFeedback(19)}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-slate-300 dark:border-slate-600">Fifth stop</td>
                      <td className="p-3 border border-slate-300 dark:border-slate-600 flex items-center gap-2">
                        Visit the <b>20</b>
                        <input type="text" className={`w-24 px-2 bg-transparent border-b-2 outline-none ${getStatusClass(20)}`} value={answers[20] || ""} onChange={(e) => handleInputChange(20, e.target.value)} disabled={submitted} />
                        {renderFeedback(20)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SECTION 3 */}
          <div className="p-6 sm:p-10 border-b border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black mb-2">SECTION 3</h2>
              <h3 className="text-lg font-bold text-slate-500">QUESTIONS 21–30</h3>
            </div>

            {/* Questions 21-23 */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 21–23<br/>Answer the questions below.<br/>Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.</div>
              
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 font-bold">
                    <span>21</span>
                    <span>When is the research project due?</span>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <input type="text" className={`w-full max-w-sm px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(21)}`} value={answers[21] || ""} onChange={(e) => handleInputChange(21, e.target.value)} disabled={submitted} />
                    {renderFeedback(21)}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 font-bold">
                    <span>22</span>
                    <span>Where will the students conduct the interviews?</span>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <input type="text" className={`w-full max-w-sm px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(22)}`} value={answers[22] || ""} onChange={(e) => handleInputChange(22, e.target.value)} disabled={submitted} />
                    {renderFeedback(22)}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 font-bold">
                    <span>23</span>
                    <span>How many interviews will they complete all together?</span>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <input type="text" className={`w-full max-w-sm px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(23)}`} value={answers[23] || ""} onChange={(e) => handleInputChange(23, e.target.value)} disabled={submitted} />
                    {renderFeedback(23)}
                  </div>
                </div>
              </div>
            </div>

            {/* Questions 24-30 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 24–30<br/>Complete the outline showing the steps the students will take to complete their projects.<br/>Write NO MORE THAN THREE WORDS for each answer.</div>
              
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="space-y-4">
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold w-6">A.</span>
                    <span>Read <b>24</b></span>
                    <input type="text" className={`flex-1 min-w-[200px] px-3 py-1 bg-transparent border-b-2 outline-none ${getStatusClass(24)}`} value={answers[24] || ""} onChange={(e) => handleInputChange(24, e.target.value)} disabled={submitted} />
                    {renderFeedback(24)}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold w-6">B.</span>
                    <span className="font-bold">25</span>
                    <input type="text" className={`flex-1 min-w-[200px] px-3 py-1 bg-transparent border-b-2 outline-none ${getStatusClass(25)}`} value={answers[25] || ""} onChange={(e) => handleInputChange(25, e.target.value)} disabled={submitted} />
                    {renderFeedback(25)}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold w-6">C.</span>
                    <span>Get <b>26</b></span>
                    <input type="text" className={`flex-1 min-w-[200px] px-3 py-1 bg-transparent border-b-2 outline-none ${getStatusClass(26)}`} value={answers[26] || ""} onChange={(e) => handleInputChange(26, e.target.value)} disabled={submitted} />
                    {renderFeedback(26)}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold w-6">D.</span>
                    <span className="font-bold">27</span>
                    <input type="text" className={`flex-1 min-w-[200px] px-3 py-1 bg-transparent border-b-2 outline-none ${getStatusClass(27)}`} value={answers[27] || ""} onChange={(e) => handleInputChange(27, e.target.value)} disabled={submitted} />
                    {renderFeedback(27)}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold w-6">E.</span>
                    <span>Get together to <b>28</b></span>
                    <input type="text" className={`flex-1 min-w-[200px] px-3 py-1 bg-transparent border-b-2 outline-none ${getStatusClass(28)}`} value={answers[28] || ""} onChange={(e) => handleInputChange(28, e.target.value)} disabled={submitted} />
                    {renderFeedback(28)}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold w-6">F.</span>
                    <span>Prepare <b>29</b></span>
                    <input type="text" className={`flex-1 min-w-[200px] px-3 py-1 bg-transparent border-b-2 outline-none ${getStatusClass(29)}`} value={answers[29] || ""} onChange={(e) => handleInputChange(29, e.target.value)} disabled={submitted} />
                    {renderFeedback(29)}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold w-6">G.</span>
                    <span>Give <b>30</b></span>
                    <input type="text" className={`flex-1 min-w-[200px] px-3 py-1 bg-transparent border-b-2 outline-none ${getStatusClass(30)}`} value={answers[30] || ""} onChange={(e) => handleInputChange(30, e.target.value)} disabled={submitted} />
                    {renderFeedback(30)}
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4 */}
          <div className="p-6 sm:p-10 bg-slate-50 dark:bg-slate-900/20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black mb-2">SECTION 4</h2>
              <h3 className="text-lg font-bold text-slate-500">QUESTIONS 31–40</h3>
            </div>

            <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
              <div className="font-bold mb-4 italic text-slate-600 dark:text-slate-400">Questions 31–40<br/>Complete the timeline below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.</div>
              
              <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl border border-slate-300 dark:border-slate-600 shadow-sm relative min-w-[600px]">
                
                <div className="absolute left-10 sm:left-24 top-8 bottom-8 w-1 bg-slate-200 dark:bg-slate-700"></div>

                <div className="space-y-8 relative z-10">
                  
                  <div className="flex gap-4 sm:gap-8 items-start">
                    <div className="w-16 sm:w-24 font-bold text-right shrink-0 pt-1">1832</div>
                    <div className="w-4 h-4 rounded-full bg-red-500 shrink-0 mt-1.5 -ml-[9px] sm:-ml-[25px] border-4 border-white dark:border-slate-800 shadow"></div>
                    <div className="flex-1 flex flex-wrap items-center gap-2">
                      <span className="font-bold">31</span>
                      <input type="text" className={`flex-1 min-w-[150px] px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(31)}`} value={answers[31] || ""} onChange={(e) => handleInputChange(31, e.target.value)} disabled={submitted} />
                      {renderFeedback(31)}
                    </div>
                  </div>

                  <div className="flex gap-4 sm:gap-8 items-start">
                    <div className="w-16 sm:w-24 text-right shrink-0 pt-1">In her teens</div>
                    <div className="w-4 h-4 rounded-full bg-slate-400 shrink-0 mt-1.5 -ml-[9px] sm:-ml-[25px] border-4 border-white dark:border-slate-800"></div>
                    <div className="flex-1 flex flex-wrap items-center gap-2">
                      <span>Alcott worked to <b>32</b></span>
                      <input type="text" className={`flex-1 min-w-[150px] px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(32)}`} value={answers[32] || ""} onChange={(e) => handleInputChange(32, e.target.value)} disabled={submitted} />
                      {renderFeedback(32)}
                    </div>
                  </div>

                  <div className="flex gap-4 sm:gap-8 items-start">
                    <div className="w-16 sm:w-24 text-right shrink-0 pt-1">At age 17</div>
                    <div className="w-4 h-4 rounded-full bg-slate-400 shrink-0 mt-1.5 -ml-[9px] sm:-ml-[25px] border-4 border-white dark:border-slate-800"></div>
                    <div className="flex-1 flex flex-wrap items-center gap-2">
                      <span>Alcott wrote <b>33</b></span>
                      <input type="text" className={`flex-1 min-w-[150px] px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(33)}`} value={answers[33] || ""} onChange={(e) => handleInputChange(33, e.target.value)} disabled={submitted} />
                      {renderFeedback(33)}
                    </div>
                  </div>

                  <div className="flex gap-4 sm:gap-8 items-start">
                    <div className="w-16 sm:w-24 font-bold text-right shrink-0 pt-1 flex items-center justify-end">
                      34 <input type="text" className={`w-12 ml-2 px-1 py-1 text-right bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(34)}`} value={answers[34] || ""} onChange={(e) => handleInputChange(34, e.target.value)} disabled={submitted} />
                    </div>
                    <div className="w-4 h-4 rounded-full bg-slate-400 shrink-0 mt-1.5 -ml-[9px] sm:-ml-[25px] border-4 border-white dark:border-slate-800"></div>
                    <div className="flex-1 flex flex-wrap items-center gap-2">
                      <span>Alcott enlisted as an army nurse. {renderFeedback(34)}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 sm:gap-8 items-start">
                    <div className="w-16 sm:w-24 font-bold text-right shrink-0 pt-1 flex items-center justify-end">
                      35 <input type="text" className={`w-14 ml-2 px-1 py-1 text-right bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(35)}`} value={answers[35] || ""} onChange={(e) => handleInputChange(35, e.target.value)} disabled={submitted} />
                    </div>
                    <div className="w-4 h-4 rounded-full bg-slate-400 shrink-0 mt-1.5 -ml-[9px] sm:-ml-[25px] border-4 border-white dark:border-slate-800"></div>
                    <div className="flex-1 flex flex-wrap items-center gap-2">
                      <span>Alcott published her letters in a book called <i>Hospital Sketches</i>. {renderFeedback(35)}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 sm:gap-8 items-start">
                    <div className="w-16 sm:w-24 font-bold text-right shrink-0 pt-1 flex items-center justify-end">
                      36 <input type="text" className={`w-12 ml-2 px-1 py-1 text-right bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(36)}`} value={answers[36] || ""} onChange={(e) => handleInputChange(36, e.target.value)} disabled={submitted} />
                    </div>
                    <div className="w-4 h-4 rounded-full bg-slate-400 shrink-0 mt-1.5 -ml-[9px] sm:-ml-[25px] border-4 border-white dark:border-slate-800"></div>
                    <div className="flex-1 flex flex-wrap items-center gap-2">
                      <span>Alcott returned from her trip to Europe. {renderFeedback(36)}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 sm:gap-8 items-start">
                    <div className="w-16 sm:w-24 font-bold text-right shrink-0 pt-1 flex items-center justify-end">
                      37 <input type="text" className={`w-12 ml-2 px-1 py-1 text-right bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(37)}`} value={answers[37] || ""} onChange={(e) => handleInputChange(37, e.target.value)} disabled={submitted} />
                    </div>
                    <div className="w-4 h-4 rounded-full bg-slate-400 shrink-0 mt-1.5 -ml-[9px] sm:-ml-[25px] border-4 border-white dark:border-slate-800"></div>
                    <div className="flex-1 flex flex-wrap items-center gap-2">
                      <span>Alcott published <i>Little Women</i>. {renderFeedback(37)}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 sm:gap-8 items-start">
                    <div className="w-16 sm:w-24 font-bold text-right shrink-0 pt-1">1879</div>
                    <div className="w-4 h-4 rounded-full bg-slate-400 shrink-0 mt-1.5 -ml-[9px] sm:-ml-[25px] border-4 border-white dark:border-slate-800"></div>
                    <div className="flex-1 flex flex-wrap items-center gap-2">
                      <span className="font-bold">38</span>
                      <input type="text" className={`w-32 px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(38)}`} value={answers[38] || ""} onChange={(e) => handleInputChange(38, e.target.value)} disabled={submitted} />
                      <span>died. {renderFeedback(38)}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 sm:gap-8 items-start">
                    <div className="w-16 sm:w-24 font-bold text-right shrink-0 pt-1 flex items-center justify-end">
                      39 <input type="text" className={`w-12 ml-2 px-1 py-1 text-right bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(39)}`} value={answers[39] || ""} onChange={(e) => handleInputChange(39, e.target.value)} disabled={submitted} />
                    </div>
                    <div className="w-4 h-4 rounded-full bg-slate-400 shrink-0 mt-1.5 -ml-[9px] sm:-ml-[25px] border-4 border-white dark:border-slate-800"></div>
                    <div className="flex-1 flex flex-wrap items-center gap-2">
                      <span>Alcott set up a home for her family in Boston. {renderFeedback(39)}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 sm:gap-8 items-start">
                    <div className="w-16 sm:w-24 font-bold text-right shrink-0 pt-1">1888</div>
                    <div className="w-4 h-4 rounded-full bg-red-500 shrink-0 mt-1.5 -ml-[9px] sm:-ml-[25px] border-4 border-white dark:border-slate-800 shadow"></div>
                    <div className="flex-1 flex flex-wrap items-center gap-2">
                      <span className="font-bold">40</span>
                      <input type="text" className={`flex-1 min-w-[150px] px-3 py-1 bg-transparent border-b-2 outline-none transition-colors ${getStatusClass(40)}`} value={answers[40] || ""} onChange={(e) => handleInputChange(40, e.target.value)} disabled={submitted} />
                      {renderFeedback(40)}
                    </div>
                  </div>

                </div>
              </div>
            </div>
            
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-8 mb-12 flex justify-center gap-4">
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
