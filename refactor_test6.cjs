const fs = require('fs');

const file = 'src/components/ListeningTest6.jsx';
// No need to checkout again, it's already reverted.

let content = fs.readFileSync(file, 'utf8');

// Replace handleCheckboxChange with handleInputChange
content = content.replace(/handleCheckboxChange/g, 'handleInputChange');

const calcSplit = content.split('const calculateScore = () => {');
const calcBodySplit = calcSplit[1].split('const getStatusClass = (qNum) => {');
const calculateScoreBody = "const calculateScore = () => {" + calcBodySplit[0].trim() + "\n";
let cleanCalculateScoreBody = calculateScoreBody.replace(/window\.scrollTo\([\s\S]*?\);/, '').trim();

const parts = content.split(/\{\/\*\s*SECTION \d\s*\*\/\}/i);
parts.shift(); // remove everything before SECTION 1

if(parts.length !== 4) {
    console.error(`Found ${parts.length} parts in ${file}, expected 4`);
    process.exit(1);
}

let extractedParts = [];
parts.forEach((p, i) => {
    const qMatch = p.match(/QUESTIONS (\d+[—\-–\?"]+\d+)/i);
    let questions = qMatch ? qMatch[1].replace(/[^0-9]/g, '-') : "";
    
    let body = p.replace(/<div className="text-center mb-8">[\s\S]*?<\/div>/, '');

    body = body.replace(/^\s*<div[^>]*>/, '');
    
    if (i === 3) {
        body = body.split(/\{\/\*\s*action buttons\s*\*\/\}/i)[0];
        body = body.replace(/<\/div>\s*<\/div>\s*<\/div>\s*$/, '');
        // We know Part 4 is missing a closing div from previous check. Let's add it back if we stripped too many.
        // Wait, originally we stripped </div></div></div>, which caused the missing div. Let's just strip 2!
        body = body.replace(/<\/div>\s*$/, '</div>\n'); // actually, let's just append an extra </div> to balance it based on our manual test.
        body += "\n</div>";
    } else {
        body = body.replace(/<\/div>\s*$/, '');
    }
    
    body = `<>\n${body.trim()}\n</>`;

    extractedParts.push({
        id: i + 1,
        title: `Part ${i + 1}`,
        questions: questions,
        content: body
    });
});

let newContent = `import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { answerKey6 as answerKey } from "../data/listeningTest6";
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
`;

fs.writeFileSync(file, newContent);
console.log('Refactored ListeningTest6.jsx');
