
module.exports = {
  "extends": ["eslint:recommended", "@typescript-eslint/recommended"],
  "rules": {
    "no-forbidden-in-production": "error",
    "no-console": ["error", { "allow": ["error", "warn"] }],
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.object.name='Math'][callee.property.name='random']",
        "message": "🚨 Math.random() FORBIDDEN IN PRODUCTION - Use generateProductionNumber() from productionSafeUtils instead"
      },
      {
        "selector": "Literal[value=/fake|Fake|dummy|lorem|Lorem|user@example|john\\.doe|123-456-7890/i]",
        "message": "🚨 FORBIDDEN DATA STRINGS NOT ALLOWED IN PRODUCTION"
      }
    ],
    "prefer-const": "error",
    "no-unused-vars": "warn"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module"
  }
};
