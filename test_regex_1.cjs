const fs = require('fs');
const c = fs.readFileSync('src/components/ReadingTest1.jsx', 'utf-8');

const m1 = c.match(/(\{\/\*\s*Questions 1-\d+\s*\*\/\}[\s\S]*?)\s*(?=\{\/\*\s*[═]+\s*PASSAGE 2)/);
const m2 = c.match(/(\{\/\*\s*Questions \d+-\d+\s*\*\/\}[\s\S]*?)\s*(?=\{\/\*\s*[═]+\s*PASSAGE 3)/);
const m3 = c.match(/(\{\/\*\s*Questions \d+-\d+\s*\*\/\}[\s\S]*?)\s*(?=\{\/\*\s*ACTION BUTTONS)/);

console.log(!!m1, !!m2, !!m3);

if(m1) {
    let q1 = m1[1];
    let lastDivIndex = q1.lastIndexOf('</div>');
    if(lastDivIndex !== -1) q1 = q1.substring(0, lastDivIndex).trim();

    const opens = (q1.match(/<div/g) || []).length;
    const closes = (q1.match(/<\/div/g) || []).length;
    console.log('q1', opens === closes, opens, closes);
}

if(m2) {
    let q2 = m2[1];
    let lastDivIndex = q2.lastIndexOf('</div>');
    if(lastDivIndex !== -1) q2 = q2.substring(0, lastDivIndex).trim();

    const opens = (q2.match(/<div/g) || []).length;
    const closes = (q2.match(/<\/div/g) || []).length;
    console.log('q2', opens === closes, opens, closes);
}
