
{
  "rules": {
    "no-restricted-syntax": [
      "warn",
      {
        "selector": "VariableDeclarator[id.name=/mock|fake|dummy|test.*data/i]",
        "message": "Consider using real data connections instead of mock data"
      },
      {
        "selector": "Property[key.name=/mock|fake|dummy/i]",
        "message": "Consider implementing real data sources"
      }
    ],
    "prefer-const": "error",
    "no-unused-vars": "warn"
  }
}
