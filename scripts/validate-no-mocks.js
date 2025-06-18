
const fs = require('fs');
const path = require('path');

function checkForRealData(dir) {
  const files = fs.readdirSync(dir);
  let realDataScore = 0;
  let totalFiles = 0;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules')) {
      const subScore = checkForRealData(filePath);
      realDataScore += subScore.score;
      totalFiles += subScore.files;
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      totalFiles++;
      
      // Check for real data patterns
      const realDataPatterns = [
        /supabase\.from\(/g,
        /useQuery\(/g,
        /useMutation\(/g,
        /\.select\(/g,
        /\.insert\(/g,
        /\.update\(/g,
        /authentication_status.*verified/g,
        /rpc\(/g
      ];
      
      let fileScore = 0;
      realDataPatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) fileScore += matches.length;
      });
      
      realDataScore += fileScore;
    }
  });
  
  return { score: realDataScore, files: totalFiles };
}

const result = checkForRealData('./src');
const qualityScore = result.files > 0 ? (result.score / result.files) : 0;

if (qualityScore > 2.0) {
  process.exit(0);
} else if (qualityScore > 1.0) {
  process.exit(0);
} else {
  process.exit(1);
}
