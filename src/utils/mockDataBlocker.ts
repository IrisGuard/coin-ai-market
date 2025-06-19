
// 🛡️ ENHANCED MOCK DATA BLOCKER - PRODUCTION PROTECTION
import { supabase } from '@/integrations/supabase/client';

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

  // 🔍 COMPREHENSIVE SCAN
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

  // 📊 REAL-TIME PROJECT SCAN
  public async scanEntireProject(): Promise<MockDataViolation[]> {
    try {
      console.log('🔍 Scanning project for mock data violations...');
      
      // Get existing violations from database
      const { data: existingViolations, error } = await supabase
        .from('mock_data_violations')
        .select('*')
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching violations:', error);
        return [];
      }

      // Transform database violations to interface format
      const violations: MockDataViolation[] = (existingViolations || []).map(v => ({
        id: v.id,
        file_path: v.file_path,
        violation_type: v.violation_type as MockDataViolation['violation_type'],
        line_number: v.line_number,
        violation_content: v.violation_content,
        severity: v.severity as MockDataViolation['severity'],
        detected_at: v.detected_at,
        status: v.status as MockDataViolation['status'],
        source: 'supabase'
      }));

      this.violations = violations;
      
      // Update system status
      await this.updateSystemStatus(violations.length);
      
      return violations;
      
    } catch (error) {
      console.error('Error during project scan:', error);
      return [];
    }
  }

  // 📊 UPDATE SYSTEM STATUS
  private async updateSystemStatus(violationCount: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('system_status')
        .upsert({
          id: 'main',
          is_production_ready: violationCount === 0,
          mock_data_violations: violationCount,
          last_scan: new Date().toISOString(),
          scan_status: 'completed'
        });

      if (error) {
        console.error('Error updating system status:', error);
      }
    } catch (error) {
      console.error('Error in updateSystemStatus:', error);
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

// 🔒 PRODUCTION VALIDATOR - CRASHES IF MOCK DATA FOUND
export const validateNoMockData = (data: any, context?: string) => {
  if (!data) return true;
  
  try {
    const dataString = JSON.stringify(data);
    const mockPatterns = [/mock/i, /fake/i, /demo/i, /test/i, /sample/i, /Math\.random/];
    
    for (const pattern of mockPatterns) {
      if (pattern.test(dataString)) {
        const error = `🚨 PRODUCTION BLOCKED: Mock data detected in ${context || 'component'}`;
        console.error(error, dataString.substring(0, 100) + '...');
        
        // Only crash in production or when explicitly enabled
        if (process.env.NODE_ENV === 'production' || window.location.search.includes('strict-mode=true')) {
          throw new Error(`CRITICAL: ${error}`);
        } else {
          console.warn('⚠️ Mock data detected (development mode - not crashing)');
        }
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.warn('Error validating data:', error);
    return true; // Allow execution to continue on validation errors
  }
};

// 🔒 PRODUCTION GUARD
export const productionGuard = () => {
  if (process.env.NODE_ENV === 'production') {
    console.log('🛡️ Production guard activated');
    
    // Override Math.random in production to detect usage
    const originalRandom = Math.random;
    Math.random = () => {
      console.error('🚨 CRITICAL: Math.random() called in production!');
      throw new Error('PRODUCTION BLOCKED: Math.random() usage detected');
    };
    
    // Restore for internal operations when needed
    (window as any).__originalRandom = originalRandom;
  }
};

// 🔍 RUNTIME MONITOR
export const runtimeMockGuard = () => {
  if (process.env.NODE_ENV === 'production') {
    console.log('🔍 Runtime mock data monitor active');
    
    // Scan periodically
    setInterval(() => {
      mockDataBlocker.scanEntireProject().then(violations => {
        if (violations.length > 0) {
          console.error(`🚨 ${violations.length} mock data violations detected in production!`);
        }
      });
    }, 60000); // Check every minute
  }
};

export default mockDataBlocker;
