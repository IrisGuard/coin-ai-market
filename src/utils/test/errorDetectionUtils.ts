
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
    
    // Check for potential syntax issues using safe string methods
    if (line.includes('import') && line.includes('{')) {
      const importStart = line.indexOf('{');
      const importEnd = line.indexOf('}');
      if (importStart !== -1 && importEnd !== -1 && importEnd > importStart) {
        const importContent = line.substring(importStart + 1, importEnd);
        const importedItems = importContent.split(',').map(item => item.trim());
        importedItems.forEach(item => {
          if (item && item.length > 0) {
            // Check if imported item is used in the content
            const cleanItem = item.includes(' as ') ? item.split(' as ')[0].trim() : item;
            if (!content.includes(cleanItem)) {
              errors.push({
                type: 'import',
                severity: 'medium',
                line: lineNumber,
                message: `Potentially unused import: ${item}`,
                file: filePath
              });
            }
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
    
    // Check for potential syntax issues
    if (line.includes('console.log') && line.includes('(') && !line.includes(')')) {
      errors.push({
        type: 'syntax',
        severity: 'medium',
        line: lineNumber,
        message: 'Potentially unclosed console.log statement',
        file: filePath
      });
    }
  });
  
  return errors;
};
