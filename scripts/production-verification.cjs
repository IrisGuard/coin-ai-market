#!/usr/bin/env node

// 🚀 PRODUCTION VERIFICATION SCRIPT
// This script verifies that the system is ready for production deployment

const fs = require('fs');
const path = require('path');

console.log('🚀 Production Verification Script');
console.log('================================\n');

let totalIssues = 0;
const issues = [];

// 1. Check for mock data in source files
console.log('1. Checking for mock data...');
const srcDir = path.join(__dirname, '..', 'src');

function scanForMockData(dir) {
  const mockPatterns = [
    /mock[^a-zA-Z]/i,
    /demo[^a-zA-Z]/i,
    /sample[^a-zA-Z]/i,
    /Math\.random/,
    /fake[^a-zA-Z]/i,
    /test.*data/i,
    /enhanced-dual-recognition/,
    /Morgan Silver Dollar/,
    /Mercury Dime/
  ];

  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
      scanForMockData(filePath);
    } else if (file.isFile() && /\.(ts|tsx|js|jsx)$/.test(file.name)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        for (const pattern of mockPatterns) {
          if (pattern.test(content)) {
            const relativePath = path.relative(path.join(__dirname, '..'), filePath);
            issues.push(`Mock data detected in ${relativePath}: ${pattern.toString()}`);
            totalIssues++;
          }
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }
}

scanForMockData(srcDir);

// 2. Check Supabase configuration
console.log('2. Checking Supabase configuration...');
const clientPath = path.join(__dirname, '..', 'src', 'integrations', 'supabase', 'client.ts');

if (fs.existsSync(clientPath)) {
  const clientContent = fs.readFileSync(clientPath, 'utf8');
  
  if (clientContent.includes('localhost') || clientContent.includes('127.0.0.1')) {
    issues.push('Supabase client contains localhost URLs - should be production URLs');
    totalIssues++;
  }
  
  if (!clientContent.includes('supabase.co')) {
    issues.push('Supabase URL doesn\'t appear to be a production URL');
    totalIssues++;
  }
} else {
  issues.push('Supabase client configuration not found');
  totalIssues++;
}

// 3. Check for hardcoded test values
console.log('3. Checking for hardcoded test values...');
const testPatterns = [
  '00000000-0000-0000-0000-000000000000',
  'test@example.com',
  'localhost:',
  '127.0.0.1:'
];

function scanForTestValues(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
      scanForTestValues(filePath);
    } else if (file.isFile() && /\.(ts|tsx|js|jsx)$/.test(file.name)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        for (const pattern of testPatterns) {
          if (content.includes(pattern)) {
            const relativePath = path.relative(path.join(__dirname, '..'), filePath);
            issues.push(`Hardcoded test value detected in ${relativePath}: ${pattern}`);
            totalIssues++;
          }
        }
      } catch (error) {
        // Skip files that can't be read
      }
    }
  }
}

scanForTestValues(srcDir);

// 4. Check migrations directory
console.log('4. Checking database migrations...');
const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');

if (fs.existsSync(migrationsDir)) {
  const migrationFiles = fs.readdirSync(migrationsDir);
  const cleanupMigration = migrationFiles.find(file => file.includes('final_production_cleanup'));
  
  if (!cleanupMigration) {
    issues.push('Final production cleanup migration not found');
    totalIssues++;
  } else {
    console.log(`✅ Found production cleanup migration: ${cleanupMigration}`);
  }
} else {
  issues.push('Migrations directory not found');
  totalIssues++;
}

// 5. Check package.json for production settings
console.log('5. Checking package.json...');
const packagePath = path.join(__dirname, '..', 'package.json');

if (fs.existsSync(packagePath)) {
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  if (!packageContent.scripts || !packageContent.scripts.build) {
    issues.push('Build script not found in package.json');
    totalIssues++;
  }
  
  if (!packageContent.dependencies || !packageContent.dependencies['@supabase/supabase-js']) {
    issues.push('Supabase dependency not found');
    totalIssues++;
  }
} else {
  issues.push('package.json not found');
  totalIssues++;
}

// Report results
console.log('\n🎯 PRODUCTION VERIFICATION RESULTS');
console.log('====================================');

if (totalIssues === 0) {
  console.log('✅ PRODUCTION READY!');
  console.log('   ✅ No mock data detected');
  console.log('   ✅ Supabase configured correctly');
  console.log('   ✅ No hardcoded test values');
  console.log('   ✅ Database migrations ready');
  console.log('   ✅ Package configuration valid');
  console.log('\n🚀 System is ready for live coin uploads!');
  process.exit(0);
} else {
  console.log(`❌ ${totalIssues} ISSUES FOUND:`);
  console.log('');
  
  issues.forEach((issue, index) => {
    console.log(`   ${index + 1}. ${issue}`);
  });
  
  console.log('\n⚠️  Please fix these issues before deploying to production.');
  process.exit(1);
} 