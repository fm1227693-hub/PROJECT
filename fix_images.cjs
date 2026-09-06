const fs = require('fs');
const path = require('path');

function fix(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
                fix(fullPath);
            }
        } else {
            if (['.jsx', '.js', '.html', '.css'].includes(path.extname(fullPath))) {
                let content = fs.readFileSync(fullPath, 'utf8');
                const badString = "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGEShttps://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES";
                const goodString = "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES";
                
                if (content.includes(badString)) {
                    content = content.split(badString).join(goodString);
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log(`Fixed: ${fullPath}`);
                }
            }
        }
    }
}

fix(__dirname);
console.log("Fix completed!");
