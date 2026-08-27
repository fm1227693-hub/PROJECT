const fs = require('fs');

const targetFile = 'src/components/AdminORG.jsx';
let content = fs.readFileSync(targetFile, 'utf-8');

const targetLine = "const [showAddLeadModal, setShowAddLeadModal] = useState(false)";
const newLines = `const [showAddLeadModal, setShowAddLeadModal] = useState(false)
    const [showAcceptLeadModal, setShowAcceptLeadModal] = useState(false)
    const [leadToAccept, setLeadToAccept] = useState(null)
    const [acceptToGroupId, setAcceptToGroupId] = useState('')`;

if (!content.includes('const [showAcceptLeadModal')) {
    content = content.replace(targetLine, newLines);
    fs.writeFileSync(targetFile, content);
    console.log("State variables injected!");
} else {
    console.log("State variables already exist.");
}
