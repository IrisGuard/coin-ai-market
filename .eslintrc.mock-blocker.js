
const { mockDataESLintRule } = require('./src/utils/mockDataBlocker');

module.exports = {
  "extends": ["eslint:recommended", "@typescript-eslint/recommended"],
  "rules": {
    "no-mock-in-production": "error",
    "no-console": ["error", { "allow": ["error", "warn"] }],
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.object.name='Math'][callee.property.name='random']",
        "message": "🚨 Math.random() FORBIDDEN IN PRODUCTION - Use generateProductionNumber() from mockDataBlocker instead"
      },
      {
        "selector": "Identifier[name=/mock|Mock|dummy|fake|test.*data|sample|placeholder/i]",
        "message": "🚨 MOCK DATA KEYWORDS FORBIDDEN IN PRODUCTION"
      },
      {
        "selector": "Literal[value=/mock|Mock|dummy|fake|lorem|Lorem|user@example|john\\.doe|123-456-7890/i]",
        "message": "🚨 MOCK DATA STRINGS FORBIDDEN IN PRODUCTION"
      }
    ],
    "prefer-const": "error",
    "no-unused-vars": "warn"
  },
  "plugins": ["mock-blocker"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module"
  }
};
