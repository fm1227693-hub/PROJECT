const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.startsWith('ReadingTest') && f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  if (content.includes('<CdiReadingLayout')) return;

  const m1 = content.match(/prose dark:prose-invert max-w-none[^>]*>\s*\{([^}]+)\}\s*<\/div>\s*([\s\S]*?)\s*<\/div>\s*\{\/\*.*?PASSAGE 2/);
  const m2 = content.match(/prose dark:prose-invert max-w-none[^>]*>\s*\{([^}]+)\}\s*<\/div>\s*([\s\S]*?)\s*<\/div>\s*\{\/\*.*?PASSAGE 3/);
  const m3 = content.match(/prose dark:prose-invert max-w-none[^>]*>\s*\{([^}]+)\}\s*<\/div>\s*([\s\S]*?)\s*<\/div>\s*\{\/\*\s*ACTION BUTTONS/);

  if (!m1 || !m2 || !m3) {
    console.log(`Failed regex extraction for ${file}`);
    return;
  }

  const p1 = m1[1];
  const q1 = m1[2];

  const p2 = m2[1];
  const q2 = m2[2];

  const p3 = m3[1];
  const q3 = m3[2];

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
          const validAnswers = answerKey[key].map((ans) => ans.toString().toLowerCase().trim());
          const userAnswer = (answers[key] || "").toString().toLowerCase().trim();
          if (validAnswers.includes(userAnswer)) s++;
        });
        setScore(s);
        setSubmitted(true);
      }}
    />
  );
}
`;

  const returnStartIdx = content.indexOf('return (');
  if (returnStartIdx !== -1) {
    content = content.substring(0, returnStartIdx) + newReturn;
  }

  if (!content.includes('CdiReadingLayout')) {
    content = content.replace(
      /import \{ useTranslation \} from "react-i18next";/,
      `import { useTranslation } from "react-i18next";\nimport CdiReadingLayout from "./CdiReadingLayout";`
    );
  }

  fs.writeFileSync(filePath, content);
  console.log(`Successfully refactored ${file}`);
});
