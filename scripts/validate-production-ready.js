
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Production validation patterns - Critical violations only
const CRITICAL_VIOLATIONS = [
  { pattern: /Math\.random\(\)/g, type: 'math_random_critical', severity: 'critical' },
  { pattern: /Math\.floor\(Math\.random\(\)/g, type: 'math_random_floor_critical', severity: 'critical' }
];

const HIGH_VIOLATIONS = [
  { pattern: /fake/gi, type: 'fake_string', severity: 'high' },
  { pattern: /dummy/gi, type: 'dummy_string', severity: 'high' },
  { pattern: /fakeData/gi, type: 'fake_variable', severity: 'high' }
];

const ALL_PATTERNS = [...CRITICAL_VIOLATIONS, ...HIGH_VIOLATIONS];

const EXCLUDED_PATHS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'coverage',
  '.husky',
  'scripts/validate-production-ready.js',
  'src/utils/mockDataBlocker.ts',
  'src/utils/productionSafeUtils.ts'
];

const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

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
      ALL_PATTERNS.forEach(({ pattern, type, severity }) => {
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
  console.log('🔍 PRODUCTION READINESS SCAN - CRITICAL VIOLATIONS ONLY');
  
  const violations = scanDirectory('./src');
  
  console.log('\n🚨 PRODUCTION VALIDATION RESULTS:');
  console.log('=' .repeat(60));
  
  if (violations.length === 0) {
    console.log('✅ PRODUCTION READY - NO CRITICAL VIOLATIONS DETECTED');
    console.log('✅ SYSTEM IS PRODUCTION READY');
  } else {
    console.log(`❌ ${violations.length} VIOLATIONS DETECTED - REQUIRES ATTENTION`);
    
    const critical = violations.filter(v => v.severity === 'critical');
    const high = violations.filter(v => v.severity === 'high');
    
    if (critical.length > 0) {
      console.log(`\n🔴 CRITICAL VIOLATIONS (${critical.length}):`);
      critical.forEach(v => {
        console.log(`   ${v.file}:${v.line} - ${v.type}: ${v.content}`);
      });
    }
    
    if (high.length > 0) {
      console.log(`\n🟠 HIGH VIOLATIONS (${high.length}):`);
      high.forEach(v => {
        console.log(`   ${v.file}:${v.line} - ${v.type}: ${v.content}`);
      });
    }
  }
  
  console.log('=' .repeat(60));
  
  if (critical.length > 0) {
    console.log('❌ PRODUCTION STATUS: BLOCKED (CRITICAL ISSUES)');
    console.log(`❌ ${critical.length} CRITICAL VIOLATIONS MUST BE FIXED`);
    process.exit(1);
  } else {
    console.log('✅ PRODUCTION STATUS: READY');
    console.log('✅ NO CRITICAL VIOLATIONS DETECTED');
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

module.exports = { scanDirectory, scanFile, ALL_PATTERNS };
