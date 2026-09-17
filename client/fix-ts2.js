const fs = require('fs');
const path = require('path');

// 1. Fix FinalCTASection.tsx Button with href
const cta = 'd:/EduGoma/client/src/components/sections/FinalCTASection.tsx';
if (fs.existsSync(cta)) {
  let content = fs.readFileSync(cta, 'utf8');
  // Add asChild to the Button that has an href
  content = content.replace(/<Button\s+variant="outline"\s+size="lg"\s+href="/, '<Button variant="outline" size="lg" asChild><Link href="');
  content = content.replace(/Planifier une démo<\/Button>/, 'Planifier une démo</Link></Button>');
  
  // Make sure we have Link imported
  if (!content.includes('import Link')) {
    content = 'import Link from "next/link";\n' + content;
  }
  
  fs.writeFileSync(cta, content);
  console.log('Fixed FinalCTASection href');
}

// 2. Fix calendar.tsx nav_button
const cal = 'd:/EduGoma/client/src/components/ui/calendar.tsx';
if (fs.existsSync(cal)) {
  let content = fs.readFileSync(cal, 'utf8');
  content = content.replace(/nav_button:.*?,/g, '');
  content = content.replace(/nav_button_previous:.*?,/g, '');
  content = content.replace(/nav_button_next:.*?,/g, '');
  fs.writeFileSync(cal, content);
  console.log('Fixed calendar nav_button');
}

// 3. Delete resizable.tsx as it's not used and throwing TS errors with the version installed
const resizable = 'd:/EduGoma/client/src/components/ui/resizable.tsx';
if (fs.existsSync(resizable)) {
  fs.unlinkSync(resizable);
  console.log('Deleted resizable.tsx');
}
