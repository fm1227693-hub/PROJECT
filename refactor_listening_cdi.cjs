const fs = require('fs');
const path = require('path');

const files = [2, 3, 4, 5, 6].map(n => `src/components/ListeningTest${n}.jsx`);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('CdiListeningLayout')) {
        console.log(`Skipping ${file} - already refactored`);
        return;
    }

    // 1. Extract calculateScore (everything between calculateScore and getStatusClass)
    const calcSplit = content.split('const calculateScore = () => {');
    if (calcSplit.length < 2) {
        console.error("calculateScore not found in", file);
        return;
    }
    const calcBodySplit = calcSplit[1].split('const getStatusClass = (qNum) => {');
    const calculateScoreBody = "const calculateScore = () => {" + calcBodySplit[0].trim() + "\n";
    // NOTE: in the original files, calculateScore body ends with window.scrollTo(...); };
    // Let's remove the window.scrollTo if it exists
    let cleanCalculateScoreBody = calculateScoreBody.replace(/window\.scrollTo\([\s\S]*?\);/, '').trim();

    // 2. Extract Parts
    const parts = content.split(/<h2 className="text-2xl font-black mb-2">SECTION \d<\/h2>/);
    parts.shift(); // remove everything before SECTION 1

    if(parts.length !== 4) {
        console.error(`Found ${parts.length} parts in ${file}, expected 4`);
        return;
    }

    let extractedParts = [];
    parts.forEach((p, i) => {
        const qMatch = p.match(/QUESTIONS (\d+[—\-–\?"]+\d+)/i);
        let questions = qMatch ? qMatch[1].replace(/[^0-9]/g, '-') : "";
        
        let body = p.replace(/<h3[^>]*>.*?<\/h3>\s*<\/div>/, ''); // remove the rest of the header
        
        if (i === 3) {
            body = body.split(/\{\/\* ACTION BUTTONS \*\/\}/)[0];
            body = body.replace(/<\/div>\s*<\/div>\s*<\/div>\s*$/, '');
        } else {
            body = body.replace(/<\/div>\s*$/, '');
        }
        
        extractedParts.push({
            id: i + 1,
            title: `Part ${i + 1}`,
            questions: questions,
            content: body.trim()
        });
    });

    const testNumber = file.match(/ListeningTest(\d+)/)[1];

    let newContent = `import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { answerKey${testNumber} as answerKey } from "../data/listeningTest${testNumber}";
import CdiListeningLayout from "./CdiListeningLayout";

export default function ListeningTest${testNumber}({ onExit }) {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleInputChange = (qNum, value) => {
    setAnswers((prev) => ({ ...prev, [qNum]: value }));
  };

  ${cleanCalculateScoreBody}

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
    ${extractedParts.map(p => `
    {
      id: ${p.id},
      title: "${p.title}",
      questions: "${p.questions}",
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          ${p.content}
        </div>
      )
    }`).join(',')}
  ];

  return (
    <CdiListeningLayout
      testTitle="Practice Test ${testNumber}"
      audioSrc="/audios/LISTENING${testNumber}.mp3"
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
`;

    fs.writeFileSync(file, newContent);
    console.log(`Refactored ${file}`);
});
