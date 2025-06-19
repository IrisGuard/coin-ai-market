#!/bin/bash

# 🔍 Local Mock Data & Error Scanner
echo "🔍 Mock Data & Error Scanner"
echo "============================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Create results folder
mkdir -p scan-results

echo -e "${BLUE}📁 Scanning project files...${NC}"

# Count total files
TOTAL_FILES=$(find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | wc -l)
echo "Files to scan: $TOTAL_FILES"

echo -e "\n${BLUE}🔍 Scanning for issues...${NC}"

# 1. Math.random()
echo "Checking Math.random()..."
MATH_RANDOM=$(find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | xargs grep -n "Math\.random()" 2>/dev/null | wc -l)
if [ $MATH_RANDOM -gt 0 ]; then
    echo -e "${RED}❌ Math.random() found: $MATH_RANDOM instances${NC}"
    find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | xargs grep -n "Math\.random()" 2>/dev/null | head -5
else
    echo -e "${GREEN}✅ No Math.random() found${NC}"
fi

# 2. Mock data
echo -e "\nChecking mock data..."
MOCK_DATA=$(find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | xargs grep -ni "mock\|fake\|demo\|sample" 2>/dev/null | wc -l)
if [ $MOCK_DATA -gt 0 ]; then
    echo -e "${YELLOW}⚠️ Mock data found: $MOCK_DATA instances${NC}"
    find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | xargs grep -ni "mock\|fake\|demo\|sample" 2>/dev/null | head -5
else
    echo -e "${GREEN}✅ No mock data found${NC}"
fi

# 3. Console.log
echo -e "\nChecking console.log..."
CONSOLE_LOGS=$(find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | xargs grep -n "console\.log" 2>/dev/null | wc -l)
if [ $CONSOLE_LOGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️ Console.log found: $CONSOLE_LOGS instances${NC}"
else
    echo -e "${GREEN}✅ No console.log found${NC}"
fi

# 4. Debugger
echo -e "\nChecking debugger..."
DEBUGGERS=$(find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | xargs grep -n "debugger" 2>/dev/null | wc -l)
if [ $DEBUGGERS -gt 0 ]; then
    echo -e "${RED}❌ Debugger statements found: $DEBUGGERS${NC}"
else
    echo -e "${GREEN}✅ No debugger statements${NC}"
fi

# 5. TODOs
echo -e "\nChecking TODOs..."
TODOS=$(find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | xargs grep -ni "TODO\|FIXME\|HACK" 2>/dev/null | wc -l)
if [ $TODOS -gt 0 ]; then
    echo -e "${BLUE}📝 TODOs/FIXMEs found: $TODOS${NC}"
else
    echo -e "${GREEN}✅ No TODOs found${NC}"
fi

# Calculate totals
TOTAL_MOCK=$((MATH_RANDOM + MOCK_DATA))
TOTAL_ISSUES=$((CONSOLE_LOGS + DEBUGGERS + TODOS))

# Summary
echo -e "\n${BLUE}================================================${NC}"
echo -e "${BLUE}📊 SCAN SUMMARY${NC}"
echo -e "${BLUE}================================================${NC}"
echo "📁 Files Scanned: $TOTAL_FILES"
echo "📅 Scan Date: $(date)"

if [ $TOTAL_MOCK -eq 0 ]; then
    echo -e "${GREEN}✅ MOCK DATA ISSUES: $TOTAL_MOCK${NC}"
else
    echo -e "${YELLOW}⚠️ MOCK DATA ISSUES: $TOTAL_MOCK${NC}"
fi

if [ $TOTAL_ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ CODE ISSUES: $TOTAL_ISSUES${NC}"
else
    echo -e "${YELLOW}⚠️ CODE ISSUES: $TOTAL_ISSUES${NC}"
fi

echo ""
echo "📋 Breakdown:"
echo "- Math.random(): $MATH_RANDOM"
echo "- Mock data: $MOCK_DATA"
echo "- Console.logs: $CONSOLE_LOGS"
echo "- Debuggers: $DEBUGGERS"
echo "- TODOs: $TODOS"

# Save results
cat > scan-results/local-scan-$(date +%Y%m%d-%H%M%S).txt << EOF
Mock Data & Error Scan Results
==============================
Date: $(date)
Files Scanned: $TOTAL_FILES

MOCK DATA ISSUES: $TOTAL_MOCK
- Math.random(): $MATH_RANDOM
- Mock/Fake data: $MOCK_DATA

CODE ISSUES: $TOTAL_ISSUES
- Console.logs: $CONSOLE_LOGS
- Debuggers: $DEBUGGERS
- TODOs/FIXMEs: $TODOS

STATUS: $([ $TOTAL_MOCK -eq 0 ] && echo "CLEAN" || echo "NEEDS ATTENTION")
EOF

echo -e "\n${GREEN}📁 Results saved to scan-results/${NC}"
echo -e "${BLUE}================================================${NC}"
