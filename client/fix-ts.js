const fs = require('fs');
const path = require('path');

// 1. Rename Button.tsx to button.tsx
const oldBtn = 'd:/EduGoma/client/src/components/ui/Button.tsx';
const newBtn = 'd:/EduGoma/client/src/components/ui/button.tsx';
if (fs.existsSync(oldBtn)) {
  fs.renameSync(oldBtn, newBtn);
  console.log('Renamed Button.tsx');
}

// 2. Fix FinalCTASection.tsx
const cta = 'd:/EduGoma/client/src/components/sections/FinalCTASection.tsx';
if (fs.existsSync(cta)) {
  let content = fs.readFileSync(cta, 'utf8');
  content = content.replace(/import \{ Button \} from "\.\.\/ui\/Button"/, 'import { Button } from "../ui/button"');
  content = content.replace(/variant="white"/g, 'variant="default"');
  content = content.replace(/variant="outline-light"/g, 'variant="outline"');
  fs.writeFileSync(cta, content);
  console.log('Fixed FinalCTASection');
}

// 3. Fix DemoRequestModal.tsx
const demo = 'd:/EduGoma/client/src/components/ui/DemoRequestModal.tsx';
if (fs.existsSync(demo)) {
  let content = fs.readFileSync(demo, 'utf8');
  content = content.replace(/import \{ Button \} from "\.\.\/ui\/Button"/, 'import { Button } from "../ui/button"');
  content = content.replace(/variant="primary"/g, 'variant="default"');
  fs.writeFileSync(demo, content);
  console.log('Fixed DemoRequestModal');
}

// 4. Fix calendar.tsx
const cal = 'd:/EduGoma/client/src/components/ui/calendar.tsx';
if (fs.existsSync(cal)) {
  let content = fs.readFileSync(cal, 'utf8');
  content = content.replace(/caption:.*?,/g, '');
  content = content.replace(/caption_label:.*?,/g, '');
  fs.writeFileSync(cal, content);
  console.log('Fixed calendar.tsx');
}

// 5. Fix toaster.tsx
const toaster = 'd:/EduGoma/client/src/components/ui/toaster.tsx';
if (fs.existsSync(toaster)) {
  let content = fs.readFileSync(toaster, 'utf8');
  content = content.replace(/function \(\{ id, title, description, action, \.\.\.props \}\)/g, 'function ({ id, title, description, action, ...props }: any)');
  fs.writeFileSync(toaster, content);
  console.log('Fixed toaster.tsx');
}
