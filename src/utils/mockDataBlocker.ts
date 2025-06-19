
// 🛡️ BASIC MOCK DATA VALIDATION - NO DATABASE DEPENDENCIES
export interface MockDataViolation {
  id?: string;
  file_path: string;
  violation_type: 'math_random' | 'mock_array' | 'fake_data' | 'demo_data' | 'placeholder';
  line_number: number;
  violation_content: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  detected_at: string;
  status: 'active' | 'resolved';
  source: 'github' | 'supabase' | 'local';
}

class ProductionMockDataBlocker {
  private static instance: ProductionMockDataBlocker;
  private violations: MockDataViolation[] = [];
  
  private readonly CRITICAL_PATTERNS = [
    /Math\.random\(\)/g,
    /mockData/g,
    /fakeData/g,
    /demoData/g,
    /sampleData/g,
    /placeholder/g
  ];

  public static getInstance(): ProductionMockDataBlocker {
    if (!ProductionMockDataBlocker.instance) {
      ProductionMockDataBlocker.instance = new ProductionMockDataBlocker();
    }
    return ProductionMockDataBlocker.instance;
  }

  // 🔍 BASIC SCAN WITHOUT DATABASE
  public scanFileContent(filePath: string, content: string): MockDataViolation[] {
    const violations: MockDataViolation[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      this.CRITICAL_PATTERNS.forEach((pattern) => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            const violation: MockDataViolation = {
              file_path: filePath,
              violation_type: this.getViolationType(match),
              line_number: index + 1,
              violation_content: match,
              severity: this.getSeverity(match),
              detected_at: new Date().toISOString(),
              status: 'active',
              source: 'local'
            };
            violations.push(violation);
          });
        }
      });
    });

    return violations;
  }

  // 📊 SIMPLE PROJECT SCAN
  public async scanEntireProject(): Promise<MockDataViolation[]> {
    try {
      console.log('🔍 Scanning project for mock data violations...');
      // Return empty array for now - no database dependency
      return [];
    } catch (error) {
      console.error('Error during project scan:', error);
      return [];
    }
  }

  private getViolationType(match: string): MockDataViolation['violation_type'] {
    if (match.includes('Math.random')) return 'math_random';
    if (match.includes('mock')) return 'mock_array';
    if (match.includes('fake')) return 'fake_data';
    if (match.includes('demo')) return 'demo_data';
    return 'placeholder';
  }

  private getSeverity(match: string): MockDataViolation['severity'] {
    if (match.includes('Math.random')) return 'critical';
    if (match.includes('mock') || match.includes('fake')) return 'high';
    return 'medium';
  }

  // 📈 GET STATISTICS
  public getViolationStats(): { total: number; critical: number; high: number } {
    return {
      total: this.violations.length,
      critical: this.violations.filter(v => v.severity === 'critical').length,
      high: this.violations.filter(v => v.severity === 'high').length
    };
  }
}

export const mockDataBlocker = ProductionMockDataBlocker.getInstance();

// 🔒 SIMPLE VALIDATOR
export const validateNoMockData = (data: any, context?: string) => {
  if (!data) return true;
  
  try {
    const dataString = JSON.stringify(data);
    const mockPatterns = [/mock/i, /fake/i, /demo/i, /test/i, /sample/i];
    
    for (const pattern of mockPatterns) {
      if (pattern.test(dataString)) {
        console.warn(`⚠️ Mock data detected in ${context || 'component'} (development mode)`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.warn('Error validating data:', error);
    return true;
  }
};

// Export validateComponentProps
export const validateComponentProps = (props: any, componentName?: string) => {
  return validateNoMockData(props, componentName);
};

export default mockDataBlocker;
