
const fs = require('fs');
const content = fs.readFileSync('c:/Users/Admin/Music/Tushar_Repos/APIONIX-API-Testing-Desktop-Software/tauri-app/renderer/app/page.tsx', 'utf8');

let braceCount = 0;
let parenCount = 0;
let bracketCount = 0;

for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') braceCount--;
    if (content[i] === '(') parenCount++;
    if (content[i] === ')') parenCount--;
    if (content[i] === '[') bracketCount++;
    if (content[i] === ']') bracketCount--;
}

console.log({ braceCount, parenCount, bracketCount });
