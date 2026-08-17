const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = ['ReadingTest1.jsx', 'ReadingTest2.jsx'];

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  if (content.includes('<CdiReadingLayout')) return;

  const m1 = content.match(/(\{\/\*\s*Questions 1-\d+\s*\*\/\}[\s\S]*?)\s*(?=\{\/\*\s*[═]+\s*PASSAGE 2)/);
  
  // FIX: Specifically look for the FIRST Questions block AFTER PASSAGE 2!
  const m2Match = content.match(/\{\/\*\s*[═]+\s*PASSAGE 2[\s\S]*?(\{\/\*\s*Questions \d+-\d+\s*\*\/\}[\s\S]*?)\s*(?=\{\/\*\s*[═]+\s*PASSAGE 3)/);
  
  // FIX: Specifically look for the FIRST Questions block AFTER PASSAGE 3!
  const m3 = content.match(/\{\/\*\s*[═]+\s*PASSAGE 3[\s\S]*?(\{\/\*\s*Questions \d+-\d+\s*\*\/\}[\s\S]*?)\s*(?=\{\/\*\s*ACTION BUTTONS)/);

  if (!m1 || !m2Match || !m3) {
    console.log(`Failed regex extraction for ${file}`);
    return;
  }

  let q1 = m1[1];
  let lastDivIndex = q1.lastIndexOf('</div>');
  if(lastDivIndex !== -1) q1 = q1.substring(0, lastDivIndex).trim();

  let q2 = m2Match[1];
  lastDivIndex = q2.lastIndexOf('</div>');
  if(lastDivIndex !== -1) q2 = q2.substring(0, lastDivIndex).trim();

  let q3 = m3[1];
  lastDivIndex = q3.lastIndexOf('</div>');
  if(lastDivIndex !== -1) q3 = q3.substring(0, lastDivIndex).trim();

  // Extract passage variables
  const p1m = content.match(/prose dark:prose-invert max-w-none[^>]*>\s*\{([^}]+)\}\s*<\/div>/g);
  let p1 = "passage1", p2 = "passage2", p3 = "passage3";
  if (p1m && p1m.length >= 3) {
    p1 = p1m[0].match(/\{([^}]+)\}/)[1];
    p2 = p1m[1].match(/\{([^}]+)\}/)[1];
    p3 = p1m[2].match(/\{([^}]+)\}/)[1];
  }

  const testNumber = file.match(/ReadingTest(\d+)/)[1];
  const testTitle = `Practice Test ${testNumber}`;

  const newReturn = `return (
    <CdiReadingLayout
      testTitle="${testTitle}"
      parts={[
        {
          id: 1,
          title: "Part 1",
          passage: ${p1},
          questions: (
            <div className="space-y-10 pb-20">
              ${q1}
            </div>
          )
        },
        {
          id: 2,
          title: "Part 2",
          passage: ${p2},
          questions: (
            <div className="space-y-10 pb-20">
              ${q2}
            </div>
          )
        },
        {
          id: 3,
          title: "Part 3",
          passage: ${p3},
          questions: (
            <div className="space-y-10 pb-20">
              ${q3}
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
`;

  // FIX: Find the LAST return statement (the component's return) instead of the FIRST (which was inside renderFeedback)
  const returnStartIdx = content.lastIndexOf('return (');
  if (returnStartIdx !== -1) {
    content = content.substring(0, returnStartIdx) + newReturn;
  }

  if (!content.includes('CdiReadingLayout')) {
    content = content.replace(
      /import \{ useTranslation \} from "react-i18next";/,
      `import { useTranslation } from "react-i18next";\nimport CdiReadingLayout from "./CdiReadingLayout";`
    );
  }

  content = content.replace(/const ReadingTest\d = \(\) => \{/, (match) => match.replace('const ', 'export default function ').replace(' = () =>', '()'));
  content = content.replace(/export default ReadingTest\d;/, '');

  fs.writeFileSync(filePath, content);
  console.log(`Successfully refactored ${file}`);
});
