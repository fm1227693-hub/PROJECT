const fs = require('fs');
[2, 3, 4, 5, 6].forEach(n => { 
    const file = 'src/components/ListeningTest' + n + '.jsx'; 
    let content = fs.readFileSync(file, 'utf8'); 
    content = content.replace('import { answerKey as answerKey } from "../data/listeningTest' + n + '";', 'import { answerKey' + n + ' as answerKey } from "../data/listeningTest' + n + '";'); 
    fs.writeFileSync(file, content); 
});
console.log("Imports fixed");
