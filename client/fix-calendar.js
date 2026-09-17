const fs = require('fs');
const cal = 'd:/EduGoma/client/src/components/ui/calendar.tsx';
let content = fs.readFileSync(cal, 'utf8');

// Replace the multi-line nav_button definition
content = content.replace(/nav_button:[\s\S]*?\),/g, '');

fs.writeFileSync(cal, content);
console.log('Fixed calendar nav_button multiline');
