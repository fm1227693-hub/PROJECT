const fs = require('fs');
const file = 'src/components/ListeningTest2.jsx';
let content = fs.readFileSync(file, 'utf8');

// split by <h2 className="text-2xl font-black mb-2">SECTION \d<\/h2>
const parts = content.split(/<h2 className="text-2xl font-black mb-2">SECTION \d<\/h2>/);
parts.shift(); // remove everything before SECTION 1

console.log('Found parts:', parts.length);
if(parts.length === 4) {
    parts.forEach((p, i) => {
        const qMatch = p.match(/QUESTIONS (\d+[—\-–\?"]+\d+)/i); // Handle weird characters
        const questions = qMatch ? qMatch[1].replace(/[^0-9]/g, '-') : ""; // normalize to 1-10
        
        let body = p.replace(/<h3[^>]*>.*?<\/h3>\s*<\/div>/, ''); // remove the rest of the header
        
        // it ends where the section wrapper ends (which is just before the next SECTION or ACTION BUTTONS)
        // Wait! Let's just find the closing </div> of the section wrapper.
        // Actually, just split by `<!-- ACTION BUTTONS -->` or `{/* ACTION BUTTONS */}` on the last part
        if (i === 3) {
            body = body.split(/\{\/\* ACTION BUTTONS \*\/\}/)[0];
            // remove the trailing </div></div> wrappers
            body = body.replace(/<\/div>\s*<\/div>\s*<\/div>\s*$/, '');
        } else {
            // remove the trailing </div> (which closes the section wrapper)
            body = body.replace(/<\/div>\s*$/, '');
        }

        console.log(`Part ${i+1}: questions ${questions}, length: ${body.trim().length}`);
    });
}
