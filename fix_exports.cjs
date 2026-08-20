const fs = require('fs');

[3, 4, 5, 6].forEach(n => {
    const file = `src/components/ListeningTest${n}.jsx`;
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace the wrong import with the correct one
    content = content.replace(
        `import { answerKey${n} as answerKey } from "../data/listeningTest${n}";`,
        `import { listeningTest${n}Answers as answerKey } from "../data/listeningTest${n}";`
    );
    
    fs.writeFileSync(file, content);
    console.log(`Fixed import in ${file}`);
});
