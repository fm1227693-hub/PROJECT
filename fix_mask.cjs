const fs = require('fs');
const files = [
    'src/components/LeadForm.jsx',
    'src/components/ConsultationBooking.jsx',
    'src/components/Mentors.jsx',
    'src/components/Register.jsx'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace import InputMask from 'react-input-mask'; with import { IMaskInput } from 'react-imask';
    content = content.replace(/import InputMask from 'react-input-mask';?/g, 'import { IMaskInput } from \'react-imask\';');
    
    // Replace <InputMask with <IMaskInput
    content = content.replace(/<InputMask/g, '<IMaskInput');
    
    // Replace mask=\"(99) 999-99-99\" with mask=\"(00) 000-00-00\"
    content = content.replace(/mask="\(\9\9\) \9\9\9-\9\9-\9\9"/g, 'mask=\"(00) 000-00-00\"');
    content = content.replace(/mask="\(99\) 999-99-99"/g, 'mask=\"(00) 000-00-00\"');
    
    // Replace onChange={(e) => setPhone(e.target.value)} with onAccept={(value) => setPhone(value)}
    content = content.replace(/onChange=\{\(e\) => setPhone\(e.target.value\)\}/g, 'onAccept={(value) => setPhone(value)}');
    content = content.replace(/onChange=\{\(e\) => setStudentPhone\(e.target.value\)\}/g, 'onAccept={(value) => setStudentPhone(value)}');
    
    // Fix Register & Mentors
    content = content.replace(/onChange=\{handleChange\}/g, 'onAccept={(value) => handleChange({ target: { name: \'phone\', value } })}');
    
    fs.writeFileSync(file, content);
});
