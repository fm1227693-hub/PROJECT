const fs = require('fs');

const targetFile = 'src/components/AdminORG.jsx';
let content = fs.readFileSync(targetFile, 'utf-8');

const oldFilterLogic = `const matchesStatus = statusFilter === 'all' || lead.status === statusFilter || (statusFilter === 'Kutilmoqda' && !lead.status)`;
const newFilterLogic = `const matchesStatus = (statusFilter === 'all' ? lead.status !== 'Qabul qilindi' : (lead.status === statusFilter || (statusFilter === 'Kutilmoqda' && !lead.status)))`;

content = content.replace(oldFilterLogic, newFilterLogic);

fs.writeFileSync(targetFile, content);
console.log("Accepted leads hidden from 'all' view.");
