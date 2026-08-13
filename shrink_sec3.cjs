const fs = require('fs');
const path = 'src/components/Sec3.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Container padding
content = content.replace(
    /pt-\[80px\] lg:pt-\[100px\]/,
    'pt-[70px] lg:pt-[80px]'
);

// 2. Heading margin
content = content.replace(
    /mb-8 sm:mb-10 px-2/,
    'mb-4 sm:mb-6 px-2'
);

// 3. Tabs padding
content = content.replace(
    /pb-8 sm:pb-10 scrollbar-none px-2/,
    'pb-4 sm:pb-6 scrollbar-none px-2'
);

// 4. Image height
content = content.replace(
    /h-60 sm:h-72 bg-gradient-to-b/,
    'h-48 sm:h-56 lg:h-64 bg-gradient-to-b'
);

// 5. Card bottom padding
content = content.replace(
    /px-5 pt-4 pb-5 sm:px-6 sm:pt-5 sm:pb-6/,
    'px-4 pt-3 pb-4 sm:px-5 sm:pt-4 sm:pb-5'
);

// 6. Stats gap
content = content.replace(
    /gap-3 sm:gap-4/,
    'gap-2 sm:gap-3'
);

// 7. Stats padding
content = content.replace(
    /bg-slate-50\/60 dark:bg-white\/\[0\.03\] p-4/,
    'bg-slate-50/60 dark:bg-white/[0.03] p-3 sm:p-4'
);

// 8. Stats font size
content = content.replace(
    /text-3xl sm:text-4xl md:text-5xl font-black/,
    'text-2xl sm:text-3xl md:text-4xl font-black'
);

// 9. Text area line clamp
content = content.replace(
    /text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed/,
    'text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed'
);

fs.writeFileSync(path, content);
console.log("Sec3 shrunk successfully!");
