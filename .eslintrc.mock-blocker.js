
{
  "rules": {
    "no-restricted-syntax": [
      "error",
      {
        "selector": "VariableDeclarator[id.name=/mock|fake|dummy|test.*data/i]",
        "message": "Mock data is not allowed in production code"
      },
      {
        "selector": "Property[key.name=/mock|fake|dummy/i]",
        "message": "Mock properties are not allowed"
      },
      {
        "selector": "CallExpression[callee.name='setTimeout'][arguments.0.type='ArrowFunctionExpression']",
        "message": "Simulated delays with setTimeout are not allowed"
      }
    ]
  }
}
