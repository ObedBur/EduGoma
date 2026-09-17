const fs = require('fs');
const path = require('path');
const dir = 'd:/EduGoma/client/src/app/(dashboard)/dashboard';
const folders = ['billing', 'requests', 'activity-log', 'users', 'roles-permissions', 'announcements', 'reports', 'infrastructure', 'settings'];

folders.forEach(f => {
  const filePath = path.join(dir, f, 'page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/<\/>`\);/g, '</>);');
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('Fixed from file');
