const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace class names (Plus_Jakarta_Sans and Italiana)
    content = content.replace(/font-\['Plus_Jakarta_Sans',sans-serif\]/g, "font-['Merriweather',serif]");
    content = content.replace(/font-\['Italiana',serif\]/g, "font-['Merriweather',serif]");
    
    // Replace inline styles and CSS
    content = content.replace(/'Plus Jakarta Sans', sans-serif/g, "'Merriweather', serif");
    content = content.replace(/'Italiana', serif/g, "'Merriweather', serif");
    
    // Replace in index.html specifically
    if (filePath.endsWith('index.html')) {
        content = content.replace(/family=Plus\+Jakarta\+Sans:wght@[0-9;]+/g, 'family=Merriweather:wght@300;400;700;900');
        content = content.replace(/family=Italiana/g, 'family=Merriweather:wght@300;400;700;900');
    }
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated: ' + filePath);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css') || fullPath.endsWith('.html')) {
            replaceInFile(fullPath);
        }
    }
}

replaceInFile('index.html');
walkDir('src');
