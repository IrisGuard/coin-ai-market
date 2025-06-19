
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Real mock data patterns for production blocking
const MOCK_PATTERNS = [
  { pattern: /Math\.random\(\)/g, type: 'math_random', severity: 'critical' },
  { pattern: /"mock"/gi, type: 'mock_string', severity: 'high' },
  { pattern: /"demo"/gi, type: 'demo_string', severity: 'high' },
  { pattern: /"placeholder"/gi, type: 'placeholder_string', severity: 'medium' },
  { pattern: /"sample"/gi, type: 'sample_string', severity: 'medium' },
  { pattern: /"fake"/gi, type: 'fake_string', severity: 'high' },
  { pattern: /mockData/gi, type: 'mock_string', severity: 'high' },
  { pattern: /demoData/gi, type: 'demo_string', severity: 'high' },
  { pattern: /sampleData/gi, type: 'sample_string', severity: 'medium' },
  { pattern: /placeholderData/gi, type: 'placeholder_string', severity: 'medium' },
  { pattern: /fakeData/gi, type: 'fake_string', severity: 'high' }
];

const EXCLUDED_PATHS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'coverage',
  '.husky',
  'scripts/validate-no-mocks.js'
];

const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte'];

function scanDirectory(dirPath, violations = []) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      // Skip excluded paths
      if (EXCLUDED_PATHS.some(excluded => fullPath.includes(excluded))) {
        continue;
      }
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath, violations);
      } else if (FILE_EXTENSIONS.some(ext => item.endsWith(ext))) {
        scanFile(fullPath, violations);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }
  
  return violations;
}

function scanFile(filePath, violations) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, lineIndex) => {
      MOCK_PATTERNS.forEach(({ pattern, type, severity }) => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            violations.push({
              file: path.relative(process.cwd(), filePath),
              line: lineIndex + 1,
              type,
              severity,
              content: match,
              context: line.trim()
            });
          });
        }
      });
    });
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
  }
}

function main() {
  console.log('🔍 SCANNING FOR MOCK DATA VIOLATIONS...');
  
  const violations = scanDirectory('./src');
  
  if (violations.length === 0) {
    console.log('✅ NO MOCK DATA DETECTED - PRODUCTION CLEAN');
    process.exit(0);
  }
  
  console.log('\n🚨 MOCK DATA VIOLATIONS DETECTED:');
  console.log('=' .repeat(60));
  
  let criticalCount = 0;
  let highCount = 0;
  
  violations.forEach(violation => {
    const icon = violation.severity === 'critical' ? '🔴' : 
                 violation.severity === 'high' ? '🟠' : '🟡';
    
    console.log(`${icon} ${violation.file}:${violation.line}`);
    console.log(`   Type: ${violation.type}`);
    console.log(`   Severity: ${violation.severity.toUpperCase()}`);
    console.log(`   Content: ${violation.content}`);
    console.log(`   Context: ${violation.context}`);
    console.log('');
    
    if (violation.severity === 'critical') criticalCount++;
    if (violation.severity === 'high') highCount++;
  });
  
  console.log('=' .repeat(60));
  console.log(`Total violations: ${violations.length}`);
  console.log(`Critical: ${criticalCount} | High: ${highCount}`);
  console.log('\n⚠️ MOCK DATA IS NOT ALLOWED IN PRODUCTION SYSTEM');
  console.log('Please remove all mock/demo/placeholder data before committing.');
  
  process.exit(1);
}

if (require.main === module) {
  main();
}

module.exports = { scanDirectory, scanFile, MOCK_PATTERNS };
