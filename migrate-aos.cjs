const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            processDir(filePath);
            return;
        }
        if (!filePath.endsWith('.jsx')) return;
        
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;
        
        // Remove import AOS
        const importRegex = /import\s+AOS\s+from\s+['"]aos['"];?\r?\n?/g;
        if (importRegex.test(content)) {
            content = content.replace(importRegex, '');
            changed = true;
        }
        
        // Remove import AOS css
        const importCssRegex = /import\s+['"]aos\/dist\/aos\.css['"];?\r?\n?/g;
        if (importCssRegex.test(content)) {
            content = content.replace(importCssRegex, '');
            changed = true;
        }
        
        // Remove AOS.init blocks (multi-line)
        const initRegex = /AOS\.init\s*\([\s\S]*?\);?/g;
        if (initRegex.test(content)) {
            content = content.replace(initRegex, '');
            changed = true;
        }

        // Remove useEffect that became empty because of AOS.init removal
        const emptyEffectRegex = /useEffect\s*\(\s*\(\s*\)\s*=>\s*\{\s*\}\s*,\s*\[\s*\]\s*\);?/g;
        if (emptyEffectRegex.test(content)) {
            content = content.replace(emptyEffectRegex, '');
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Cleaned AOS from: ' + file);
        }
    });
}

processDir(path.join(__dirname, 'src'));
