const fs = require('fs');
const path = require('path');

const map = {
  "/CEFR68.jpg": "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/CEFR68.jpg",
  "/ChatGPT%20Image%20Aug%2029,%202026,%2008_37_57%20PM.png": "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/ChatGPT%20Image%20Aug%2029,%202026,%2008_37_57%20PM.png",
  "/ChatGPT Image Aug 29, 2026, 08_37_57 PM.png": "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/ChatGPT%20Image%20Aug%2029,%202026,%2008_37_57%20PM.png",
  "/favicon.svg": "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/favicon.svg",
  "/photo_2026-07-14_23-35-01.jpg": "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-01.jpg",
  "/photo_2026-07-14_23-35-06.jpg": "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-06.jpg",
  "/photo_2026-07-14_23-35-09.jpg": "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-09.jpg",
  "/photo_2026-07-14_23-35-11.jpg": "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-11.jpg",
  "/photo_2026-07-14_23-35-19.jpg": "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-19.jpg",
  "/photo_2026-07-14_23-35-21.jpg": "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-21.jpg",
  "/photo_2026-07-14_23-35-23.jpg": "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-23.jpg",
  "/photo_2026-07-14_23-35-25.jpg": "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-25.jpg",
  "/photo_2026-07-14_23-35-27.jpg": "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-27.jpg",
  "/photo_2026-07-23_23-14-12.jpg": "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-23_23-14-12.jpg",
  "/ptimum-logo-transparent-full.png": "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/ptimum-logo-transparent-full.png"
};

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
                traverse(fullPath);
            }
        } else {
            if (['.jsx', '.js', '.html', '.css'].includes(path.extname(fullPath))) {
                let content = fs.readFileSync(fullPath, 'utf8');
                let updated = false;
                
                for (const [key, value] of Object.entries(map)) {
                    if (content.includes(key)) {
                        // Global replace of the string
                        content = content.split(key).join(value);
                        updated = true;
                    }
                }
                
                if (updated) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log(`Updated: ${fullPath}`);
                }
            }
        }
    }
}

traverse(path.join(__dirname, 'src'));
traverse(__dirname); // for index.html

console.log("Images replaced successfully!");
