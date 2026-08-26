const fs = require('fs');
const path = require('path');
const langs = ['uz', 'ru', 'en'];

langs.forEach(lang => {
    const file = path.join('public', 'localization', lang, 'global.json');
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/"school":\s*"[^"]*School of English[^"]*"/g, '"school": "English Learning Center"');
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
    }
});
