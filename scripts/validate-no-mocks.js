
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Production validation patterns - now detects ALL mock data
const CRITICAL_VIOLATIONS = [
  { pattern: /Math\.random\(\)/g, type: 'math_random_critical', severity: 'critical' },
  { pattern: /Math\.floor\(Math\.random\(\)/g, type: 'math_random_floor_critical', severity: 'critical' }
];

const HIGH_VIOLATIONS = [
  { pattern: /"mock"/gi, type: 'mock_string', severity: 'high' },
  { pattern: /"demo"/gi, type: 'demo_string', severity: 'high' },
  { pattern: /"fake"/gi, type: 'fake_string', severity: 'high' },
  { pattern: /"dummy"/gi, type: 'dummy_string', severity: 'high' },
  { pattern: /mockData/gi, type: 'mock_variable', severity: 'high' },
  { pattern: /demoData/gi, type: 'demo_variable', severity: 'high' },
  { pattern: /fakeData/gi, type: 'fake_variable', severity: 'high' }
];

const MEDIUM_VIOLATIONS = [
  { pattern: /"test"/gi, type: 'test_string', severity: 'medium' },
  { pattern: /"placeholder"/gi, type: 'placeholder_string', severity: 'medium' },
  { pattern: /"sample"/gi, type: 'sample_string', severity: 'medium' },
  { pattern: /"example"/gi, type: 'example_string', severity: 'medium' },
  { pattern: /lorem\s+ipsum/gi, type: 'lorem_ipsum', severity: 'medium' },
  { pattern: /"Lorem"/gi, type: 'lorem_string', severity: 'medium' },
  { pattern: /"user@example\.com"/gi, type: 'test_email', severity: 'medium' },
  { pattern: /"john\.doe"/gi, type: 'test_name', severity: 'medium' },
  { pattern: /"123-456-7890"/gi, type: 'test_phone', severity: 'medium' }
];

const ALL_PATTERNS = [...CRITICAL_VIOLATIONS, ...HIGH_VIOLATIONS, ...MEDIUM_VIOLATIONS];

const EXCLUDED_PATHS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'coverage',
  '.husky',
  'scripts/validate-no-mocks.js',
  'src/utils/mockDataBlocker.ts' // Allow the blocker file itself
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
  console.log('🔍 PRODUCTION MOCK DATA SCAN - ZERO TOLERANCE MODE');
  
  const violations = scanDirectory('./src');
  
  console.log('\n🚨 PRODUCTION VALIDATION RESULTS:');
  console.log('=' .repeat(80));
  
  if (violations.length === 0) {
    console.log('✅ PRODUCTION CLEAN - NO VIOLATIONS DETECTED');
    console.log('✅ SYSTEM IS 100% PRODUCTION READY');
    console.log('✅ ALL MOCK DATA SUCCESSFULLY ELIMINATED');
  } else {
    console.log(`❌ ${violations.length} VIOLATIONS DETECTED - PRODUCTION BLOCKED`);
    
    const critical = violations.filter(v => v.severity === 'critical');
    const high = violations.filter(v => v.severity === 'high');
    const medium = violations.filter(v => v.severity === 'medium');
    
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
    
    if (medium.length > 0) {
      console.log(`\n🟡 MEDIUM VIOLATIONS (${medium.length}):`);
      medium.forEach(v => {
        console.log(`   ${v.file}:${v.line} - ${v.type}: ${v.content}`);
      });
    }
  }
  
  console.log('=' .repeat(80));
  
  if (violations.length > 0) {
    console.log('❌ PRODUCTION STATUS: BLOCKED');
    console.log(`❌ ${violations.length} VIOLATIONS MUST BE FIXED`);
    console.log('❌ DEPLOY FORBIDDEN UNTIL ALL VIOLATIONS RESOLVED');
    process.exit(1);
  } else {
    console.log('✅ PRODUCTION STATUS: APPROVED');
    console.log('✅ 0 VIOLATIONS DETECTED');
    console.log('✅ 100% PRODUCTION READY');
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

module.exports = { scanDirectory, scanFile, ALL_PATTERNS };
