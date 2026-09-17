const fs = require('fs');
const cta = 'd:/EduGoma/client/src/components/sections/FinalCTASection.tsx';
let content = fs.readFileSync(cta, 'utf8');
content = content.replace('import Link from "next/link";\r\n"use client";', '"use client";\r\nimport Link from "next/link";');
content = content.replace('import Link from "next/link";\n"use client";', '"use client";\nimport Link from "next/link";');
fs.writeFileSync(cta, content);
console.log('Fixed use client order');
