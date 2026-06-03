const fs = require('fs');
const path = require('path');

const replacements = [
  { search: /\bbg-white(?! dark:bg-)/g, replace: 'bg-white dark:bg-slate-900' },
  { search: /\bbg-slate-50(?! dark:bg-)/g, replace: 'bg-slate-50 dark:bg-slate-950' },
  { search: /\bbg-slate-100(?! dark:bg-)/g, replace: 'bg-slate-100 dark:bg-slate-800' },
  
  { search: /\btext-slate-900(?! dark:text-)/g, replace: 'text-slate-900 dark:text-slate-50' },
  { search: /\btext-slate-800(?! dark:text-)/g, replace: 'text-slate-800 dark:text-slate-100' },
  { search: /\btext-slate-700(?! dark:text-)/g, replace: 'text-slate-700 dark:text-slate-200' },
  { search: /\btext-slate-600(?! dark:text-)/g, replace: 'text-slate-600 dark:text-slate-300' },
  { search: /\btext-slate-500(?! dark:text-)/g, replace: 'text-slate-500 dark:text-slate-400' },
  { search: /\btext-slate-400(?! dark:text-)/g, replace: 'text-slate-400 dark:text-slate-500' },
  
  { search: /\bborder-slate-200(?! dark:border-)/g, replace: 'border-slate-200 dark:border-slate-700' },
  { search: /\bborder-slate-300(?! dark:border-)/g, replace: 'border-slate-300 dark:border-slate-600' },
  { search: /\bborder-slate-100(?! dark:border-)/g, replace: 'border-slate-100 dark:border-slate-800' },
  
  { search: /\bdivide-slate-100(?! dark:divide-)/g, replace: 'divide-slate-100 dark:divide-slate-800' },
  { search: /\bdivide-slate-200(?! dark:divide-)/g, replace: 'divide-slate-200 dark:divide-slate-700' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      replacements.forEach(({ search, replace }) => {
        content = content.replace(search, replace);
      });
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

processDirectory(path.join(__dirname, '..', 'src'));
console.log('Finished adding dark mode classes.');
