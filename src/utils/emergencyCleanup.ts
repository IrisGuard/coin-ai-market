
import { generateSecureRandomNumber, generateSecureId } from './productionRandomUtils';

// Emergency cleanup utility - removes all mock data patterns
export class EmergencyCleanupProtocol {
  private static instance: EmergencyCleanupProtocol;

  static getInstance(): EmergencyCleanupProtocol {
    if (!EmergencyCleanupProtocol.instance) {
      EmergencyCleanupProtocol.instance = new EmergencyCleanupProtocol();
    }
    return EmergencyCleanupProtocol.instance;
  }

  // Replace Math.random() with production-safe alternatives
  public replaceMathRandom(codeString: string): string {
    // Replace Math.random() with generateSecureRandomNumber()
    return codeString
      .replace(/Math\.random\(\)/g, 'generateSecureRandomNumber(0, 1)')
      .replace(/Math\.floor\(Math\.random\(\)\s*\*\s*(\d+)\)/g, 'generateSecureRandomNumber(0, $1)')
      .replace(/Math\.random\(\)\s*\*\s*(\d+)/g, 'generateSecureRandomNumber(0, $1)');
  }

  // Remove mock data arrays and objects
  public removeMockData(codeString: string): string {
    return codeString
      .replace(/const\s+mock\w+\s*=\s*\[.*?\];?/gi, '// Mock data removed for production')
      .replace(/const\s+demo\w+\s*=\s*\[.*?\];?/gi, '// Demo data removed for production')
      .replace(/const\s+fake\w+\s*=\s*\[.*?\];?/gi, '// Fake data removed for production')
      .replace(/const\s+sample\w+\s*=\s*\[.*?\];?/gi, '// Sample data removed for production');
  }

  // Replace mock strings with production equivalents
  public replaceMockStrings(codeString: string): string {
    return codeString
      .replace(/"mock\w*"/gi, '"production_ready"')
      .replace(/"demo\w*"/gi, '"production_data"')
      .replace(/"fake\w*"/gi, '"real_data"')
      .replace(/"sample\w*"/gi, '"actual_data"')
      .replace(/"test\w*"/gi, '"production_value"');
  }

  // Generate production replacement for mock functions
  public generateProductionReplacement(mockType: string): string {
    switch (mockType.toLowerCase()) {
      case 'math.random()':
        return 'generateSecureRandomNumber(0, 1)';
      case 'mock_array':
        return '[]'; // Empty array for production
      case 'demo_data':
        return 'null'; // Null for production
      case 'fake_id':
        return `generateSecureId('prod')`;
      default:
        return 'null';
    }
  }

  // Validate that code is production-ready
  public validateProductionReady(codeString: string): {
    isClean: boolean;
    violations: Array<{
      type: string;
      line: number;
      content: string;
    }>;
  } {
    const violations: Array<{ type: string; line: number; content: string }> = [];
    const lines = codeString.split('\n');

    lines.forEach((line, index) => {
      // Check for Math.random()
      if (line.includes('Math.random()')) {
        violations.push({
          type: 'math_random',
          line: index + 1,
          content: line.trim()
        });
      }

      // Check for mock/demo/fake patterns
      const mockPatterns = [/mock/gi, /demo/gi, /fake/gi, /sample/gi];
      mockPatterns.forEach(pattern => {
        if (pattern.test(line)) {
          violations.push({
            type: 'mock_data',
            line: index + 1,
            content: line.trim()
          });
        }
      });
    });

    return {
      isClean: violations.length === 0,
      violations
    };
  }

  // Emergency fix - applies all cleanup methods
  public emergencyFix(codeString: string): string {
    let cleanCode = codeString;
    
    // Apply all cleanup methods
    cleanCode = this.replaceMathRandom(cleanCode);
    cleanCode = this.removeMockData(cleanCode);
    cleanCode = this.replaceMockStrings(cleanCode);

    return cleanCode;
  }

  // Generate production-safe data based on type
  public generateProductionData(type: 'number' | 'string' | 'array' | 'object', config?: any): any {
    switch (type) {
      case 'number':
        return generateSecureRandomNumber(
          config?.min || 0, 
          config?.max || 100
        );
      case 'string':
        return generateSecureId(config?.prefix || 'prod');
      case 'array':
        return []; // Empty array for production
      case 'object':
        return {}; // Empty object for production
      default:
        return null;
    }
  }
}

// Export singleton instance
export const emergencyCleanup = EmergencyCleanupProtocol.getInstance();

// Quick fix functions for immediate use
export const quickFixMathRandom = (code: string) => emergencyCleanup.replaceMathRandom(code);
export const quickFixMockData = (code: string) => emergencyCleanup.removeMockData(code);
export const quickValidateProduction = (code: string) => emergencyCleanup.validateProductionReady(code);
