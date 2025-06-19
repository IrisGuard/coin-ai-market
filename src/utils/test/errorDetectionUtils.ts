
// Code error detection utilities
export const detectCodeErrors = (filePath: string, content: string): Array<{
  type: 'typescript' | 'syntax' | 'import' | 'deprecated';
  severity: 'critical' | 'high' | 'medium' | 'low';
  line: number;
  message: string;
  file: string;
}> => {
  const errors: Array<{
    type: 'typescript' | 'syntax' | 'import' | 'deprecated';
    severity: 'critical' | 'high' | 'medium' | 'low';
    line: number;
    message: string;
    file: string;
  }> = [];

  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // Check for unterminated regex - using string methods to avoid regex issues
    if (line.includes('/') && !line.includes('//') && !line.includes('*/') && !line.includes('/*')) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('/') && !trimmedLine.endsWith('/') && !trimmedLine.includes('://')) {
        errors.push({
          type: 'syntax',
          severity: 'critical',
          line: lineNumber,
          message: 'Potential unterminated regular expression literal',
          file: filePath
        });
      }
    }
    
    // Check for unused imports - using string methods instead of regex
    if (line.includes('import') && line.includes('{')) {
      const importStart = line.indexOf('{');
      const importEnd = line.indexOf('}');
      if (importStart !== -1 && importEnd !== -1 && importEnd > importStart) {
        const importContent = line.substring(importStart + 1, importEnd);
        const importedItems = importContent.split(',').map(item => item.trim());
        importedItems.forEach(item => {
          if (item && !content.includes(item.split(' as ')[0].trim())) {
            errors.push({
              type: 'import',
              severity: 'medium',
              line: lineNumber,
              message: `Unused import detected: ${item}`,
              file: filePath
            });
          }
        });
      }
    }
    
    // Check for deprecated React patterns
    if (line.includes('React.FC') || line.includes('React.FunctionComponent')) {
      errors.push({
        type: 'deprecated',
        severity: 'low',
        line: lineNumber,
        message: 'React.FC is deprecated, use function declaration instead',
        file: filePath
      });
    }
  });
  
  return errors;
};
