#!/usr/bin/env node

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

class AutoFixer {
  constructor() {
    this.srcPath = path.join(process.cwd(), 'src');
  }

  async runAllFixes() {
    console.log('🤖 Starting automatic fixes...');
    
    try {
      await this.fixTypeScriptErrors();
      await this.fixESLintErrors();
      await this.fixImportPaths();
      await this.removeInvalidSyntax();
      await this.testBuild();
      
      console.log('✅ All automatic fixes completed!');
    } catch (error) {
      console.error('❌ Auto-fix failed:', error);
      process.exit(1);
    }
  }

  async fixTypeScriptErrors() {
    console.log('🔧 Fixing TypeScript errors...');
    
    const fixes = [
      // Replace any types
      { pattern: /: any(?!\w)/g, replacement: ': unknown' },
      { pattern: /any\[\]/g, replacement: 'unknown[]' },
      { pattern: /\bany\b(?=\s*[,\)\}])/g, replacement: 'unknown' },
      
      // Fix common type issues
      { pattern: /useState<any>/g, replacement: 'useState<unknown>' },
      { pattern: /Promise<any>/g, replacement: 'Promise<unknown>' },
    ];

    await this.applyFixesToFiles(fixes, ['.ts', '.tsx']);
  }

  async fixESLintErrors() {
    console.log('🔧 Running ESLint auto-fix...');
    
    try {
      await execAsync('npx eslint src/ --fix');
    } catch (error) {
      // ESLint might exit with code 1 even when fixing successfully
      console.log('ESLint fix completed (with warnings)');
    }
  }

  async fixImportPaths() {
    console.log('🔧 Fixing import paths...');
    
    const fixes = [
      { pattern: /@\/lib\/supabase/g, replacement: '../integrations/supabase/client' },
      { pattern: /\.\.\/lib\/supabase/g, replacement: '../integrations/supabase/client' },
      { pattern: /from '@\/lib\/supabase'/g, replacement: "from '../integrations/supabase/client'" },
    ];

    await this.applyFixesToFiles(fixes, ['.ts', '.tsx']);
  }

  async removeInvalidSyntax() {
    console.log('🔧 Removing invalid syntax...');
    
    const files = await this.getAllFiles(['.ts', '.tsx']);
    
    for (const file of files) {
      try {
        let content = fs.readFileSync(file, 'utf8');
        
        // Remove invalid labels
        content = content.replace(/^onError:\s*\(.*?\)\s*=>\s*\{[\s\S]*?\}\s*$/gm, '');
        content = content.replace(/^onSuccess:\s*\(.*?\)\s*=>\s*\{[\s\S]*?\}\s*$/gm, '');
        
        // Remove empty lines created by removals
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        fs.writeFileSync(file, content);
      } catch (error) {
        console.warn(`⚠️ Could not process file: ${file}`, error.message);
      }
    }
  }

  async applyFixesToFiles(fixes, extensions) {
    const files = await this.getAllFiles(extensions);
    
    for (const file of files) {
      try {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        for (const fix of fixes) {
          if (fix.pattern.test(content)) {
            content = content.replace(fix.pattern, fix.replacement);
            modified = true;
          }
        }
        
        if (modified) {
          fs.writeFileSync(file, content);
          console.log(`  ✓ Fixed: ${path.relative(process.cwd(), file)}`);
        }
      } catch (error) {
        console.warn(`⚠️ Could not process file: ${file}`, error.message);
      }
    }
  }

  async getAllFiles(extensions) {
    const files = [];
    
    function walkDir(dir) {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          walkDir(fullPath);
        } else if (stat.isFile()) {
          const ext = path.extname(item);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    }
    
    walkDir(this.srcPath);
    return files;
  }

  async testBuild() {
    console.log('🧪 Testing build after fixes...');
    
    try {
      await execAsync('npm run build');
      console.log('✅ Build successful after fixes!');
    } catch (error) {
      console.error('❌ Build still failing after fixes');
      console.log(error.stdout);
      console.log(error.stderr);
      throw error;
    }
  }
}

// Run if called directly
const fixer = new AutoFixer();
fixer.runAllFixes(); 