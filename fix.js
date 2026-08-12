const fs = require('fs');
const filePath = 'src/components/AboutUs.jsx';
let content = fs.readFileSync(filePath, 'utf-8');

const replacements = {
    'bg-gray-900': 'bg-white dark:bg-gray-900',
    'border border-gray-800': 'border border-gray-200 dark:border-gray-800',
    'border-gray-800': 'border-gray-200 dark:border-gray-800',
    'text-white': 'text-gray-900 dark:text-white',
    'text-gray-300': 'text-gray-600 dark:text-gray-300',
    'text-gray-400': 'text-gray-500 dark:text-gray-400',
    'bg-gray-950/60': 'bg-gray-50 dark:bg-gray-950/60',
    'bg-gray-950/90': 'bg-white/90 dark:bg-gray-950/90',
    'bg-gradient-to-br from-gray-800 to-gray-900': 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900',
    'border border-gray-700': 'border border-gray-300 dark:border-gray-700',
    'border-gray-700': 'border-gray-300 dark:border-gray-700',
    'filter invert-[90%] hue-rotate-180 contrast-125 saturate-50 opacity-90': 'dark:filter dark:invert-[90%] dark:hue-rotate-180 dark:contrast-125 dark:saturate-50 opacity-90',
    'bg-gray-700': 'bg-gray-300 dark:bg-gray-700'
};

for (const [oldVal, newVal] of Object.entries(replacements)) {
    content = content.split(oldVal).join(newVal);
}

// Special fixes
content = content.replace('w-6 h-6 text-gray-900 dark:text-white', 'w-6 h-6 text-white');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Done');
