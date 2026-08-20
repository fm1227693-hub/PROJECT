const fs = require('fs');
[2, 3, 4, 5].forEach(n => {
    console.log('--- Test', n, '---');
    const content = fs.readFileSync(`src/components/ListeningTest${n}.jsx`, 'utf8');
    const parts = content.split('title: "Part ');
    parts.shift();
    parts.forEach((p, i) => {
        const divs = (p.match(/<div/g) || []).length;
        const endDivs = (p.match(/<\/div>/g) || []).length;
        if (divs !== endDivs) {
            console.log('Part', i+1, 'MISMATCH! divs:', divs, 'endDivs:', endDivs);
        }
    });
});
