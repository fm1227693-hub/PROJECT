const fs = require('fs');

const targetFile = 'src/components/AdminORG.jsx';
let content = fs.readFileSync(targetFile, 'utf-8');

const newFilterLogic = `const matchesStatus = (statusFilter === 'all' ? lead.status !== 'Qabul qilindi' : (lead.status === statusFilter || (statusFilter === 'Kutilmoqda' && !lead.status)))`;
const oldFilterLogic = `const matchesStatus = statusFilter === 'all' || lead.status === statusFilter || (statusFilter === 'Kutilmoqda' && !lead.status)`;

content = content.replace(newFilterLogic, oldFilterLogic);

fs.writeFileSync(targetFile, content);
console.log("Reverted to show all leads.");
