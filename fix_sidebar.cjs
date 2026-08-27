const fs = require('fs');

const targetFile = 'src/components/AdminORG.jsx';
let content = fs.readFileSync(targetFile, 'utf-8');

// The line we need to find:
const groupsSidebarItem = `<SidebarItem icon={<FaUsers />} label="Guruhlar" isActive={activeTab === 'groups'} onClick={() => setActiveTab('groups')} />`;

const newGroupsAndStudentsSidebarItem = `<SidebarItem icon={<FaUsers />} label={t('adminDashboard.groupsTab')} isActive={activeTab === 'groups'} onClick={() => setActiveTab('groups')} />
                    <SidebarItem icon={<FaUserGraduate />} label={t('adminDashboard.studentsTab')} isActive={activeTab === 'students'} onClick={() => setActiveTab('students')} />`;

if (content.includes(groupsSidebarItem)) {
    content = content.replace(groupsSidebarItem, newGroupsAndStudentsSidebarItem);
} else {
    console.error("Could not find the target string!");
}

// Also check the mobile drawer menu (if there is one). Let's see if there is another occurrence of 'label="Guruhlar"'
const groupsMobileItem = `<SidebarItem icon={<FaUsers />} label="Guruhlar" isActive={activeTab === 'groups'} onClick={() => { setActiveTab('groups'); setMobileMenuOpen(false); }} />`;
const newGroupsMobileItem = `<SidebarItem icon={<FaUsers />} label={t('adminDashboard.groupsTab')} isActive={activeTab === 'groups'} onClick={() => { setActiveTab('groups'); setMobileMenuOpen(false); }} />
                            <SidebarItem icon={<FaUserGraduate />} label={t('adminDashboard.studentsTab')} isActive={activeTab === 'students'} onClick={() => { setActiveTab('students'); setMobileMenuOpen(false); }} />`;

if (content.includes(groupsMobileItem)) {
    content = content.replace(groupsMobileItem, newGroupsMobileItem);
}

fs.writeFileSync(targetFile, content);
console.log("Fixed sidebar tabs.");
