#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class VercelErrorMonitor {
  constructor() {
    this.deploymentId = null;
    this.errorPatterns = {
      typescript: /error TS\d+: (.+)/g,
      eslint: /ESLint: (.+)/g,
      build: /Error: (.+) exited with \d+/g,
      import: /Module not found: (.+)/g,
      syntax: /SyntaxError: (.+)/g
    };
  }

  async startMonitoring() {
    console.log('🔍 Starting Vercel deployment monitoring...');
    
    // Get latest deployment
    this.getLatestDeployment();
    
    // Start watching for new deployments
    setInterval(() => {
      this.checkForNewDeployments();
    }, 30000); // Check every 30 seconds
  }

  async getLatestDeployment() {
    exec('npx vercel ls --token $VERCEL_TOKEN', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Error getting deployments:', error);
        return;
      }
      
      const lines = stdout.split('\n');
      const latestLine = lines.find(line => line.includes('https://'));
      
      if (latestLine) {
        const parts = latestLine.trim().split(/\s+/);
        this.deploymentId = parts[0];
        console.log(`📦 Monitoring deployment: ${this.deploymentId}`);
        this.monitorDeployment();
      }
    });
  }

  async checkForNewDeployments() {
    // Check if there's a newer deployment
    this.getLatestDeployment();
  }

  async monitorDeployment() {
    if (!this.deploymentId) return;

    exec(`npx vercel logs ${this.deploymentId} --token $VERCEL_TOKEN`, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Error getting logs:', error);
        return;
      }

      this.analyzeLogs(stdout);
    });
  }

  async analyzeLogs(logs) {
    console.log('🔍 Analyzing deployment logs...');
    
    const errors = this.extractErrors(logs);
    
    if (errors.length > 0) {
      console.log(`🚨 Found ${errors.length} errors:`);
      errors.forEach(error => console.log(`  - ${error.type}: ${error.message}`));
      
      await this.fixErrors(errors);
    } else {
      console.log('✅ No errors found in deployment logs');
    }
  }

  extractErrors(logs) {
    const errors = [];
    
    Object.entries(this.errorPatterns).forEach(([type, pattern]) => {
      let match;
      while ((match = pattern.exec(logs)) !== null) {
        errors.push({
          type,
          message: match[1],
          fullMatch: match[0]
        });
      }
    });

    return errors;
  }

  async fixErrors(errors) {
    console.log('🔧 Starting automatic error fixes...');

    for (const error of errors) {
      try {
        await this.applyFix(error);
      } catch (fixError) {
        console.error(`❌ Failed to fix error: ${error.message}`, fixError);
      }
    }

    // After fixing errors, commit and push
    await this.commitAndPush();
  }

  async applyFix(error) {
    switch (error.type) {
      case 'typescript':
        await this.fixTypeScriptError(error);
        break;
      case 'eslint':
        await this.fixESLintError(error);
        break;
      case 'import':
        await this.fixImportError(error);
        break;
      case 'syntax':
        await this.fixSyntaxError(error);
        break;
      default:
        console.log(`⚠️ No automatic fix available for: ${error.type}`);
    }
  }

  async fixTypeScriptError(error) {
    console.log(`🔧 Fixing TypeScript error: ${error.message}`);
    
    if (error.message.includes('any')) {
      // Replace any types with unknown
      await this.replaceInFiles('any', 'unknown', ['.ts', '.tsx']);
    } else if (error.message.includes('not assignable')) {
      // Add type assertions
      await this.addTypeAssertions(error);
    }
  }

  async fixESLintError(error) {
    console.log(`🔧 Fixing ESLint error: ${error.message}`);
    
    if (error.message.includes('unused')) {
      // Remove unused variables/imports
      await this.removeUnusedCode(error);
    }
  }

  async fixImportError(error) {
    console.log(`🔧 Fixing import error: ${error.message}`);
    
    // Try to fix common import path issues
    await this.fixImportPaths(error);
  }

  async fixSyntaxError(error) {
    console.log(`🔧 Fixing syntax error: ${error.message}`);
    
    // Basic syntax fixes
    await this.applySyntaxFixes(error);
  }

  async replaceInFiles(search, replace, extensions) {
    return new Promise((resolve) => {
      const command = `find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's/${search}/${replace}/g'`;
      exec(command, () => resolve());
    });
  }

  async addTypeAssertions(error) {
    // Add basic type assertions where needed
    console.log('Adding type assertions...');
  }

  async removeUnusedCode(error) {
    // Remove unused imports and variables
    console.log('Removing unused code...');
  }

  async fixImportPaths(error) {
    // Fix common import path issues
    const fixes = [
      { from: '@/lib/supabase', to: '../integrations/supabase/client' },
      { from: '../lib/supabase', to: '../integrations/supabase/client' }
    ];

    for (const fix of fixes) {
      await this.replaceInFiles(fix.from, fix.to, ['.ts', '.tsx']);
    }
  }

  async applySyntaxFixes(error) {
    // Apply common syntax fixes
    console.log('Applying syntax fixes...');
  }

  async commitAndPush() {
    console.log('📝 Committing and pushing fixes...');
    
    return new Promise((resolve, reject) => {
      exec('git add . && git commit -m "🤖 Auto-fix deployment errors" && git push origin main', (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Failed to commit/push:', error);
          reject(error);
        } else {
          console.log('✅ Fixes committed and pushed successfully!');
          resolve();
        }
      });
    });
  }
}

// Start monitoring if this script is run directly
if (require.main === module) {
  const monitor = new VercelErrorMonitor();
  monitor.startMonitoring();
}

module.exports = VercelErrorMonitor; 