const fs = require('fs');
const content = fs.readFileSync('src/components/ListeningTest6.jsx', 'utf8');
const parts = content.split('title: "Part ');
parts.shift();
parts.forEach((p, i) => {
    const divs = (p.match(/<div/g) || []).length;
    const endDivs = (p.match(/<\/div>/g) || []).length;
    console.log('Part', i+1, 'divs:', divs, 'endDivs:', endDivs);
});
