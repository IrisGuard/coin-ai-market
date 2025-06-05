
const fs = require('fs');
const path = require('path');

function checkForMocks(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      checkForMocks(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const mockPatterns = [
        /mock[A-Z]\w+/g,
        /fake[A-Z]\w+/g,
        /dummy[A-Z]\w+/g,
        /hardcoded/gi,
        /setTimeout.*success.*true/g
      ];
      
      mockPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          console.error(`❌ Mock data found in ${filePath}`);
          process.exit(1);
        }
      });
    }
  });
}

checkForMocks('./src');
console.log('✅ No mock data detected');
