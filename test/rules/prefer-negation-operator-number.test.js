import { RuleTester } from "eslint";
import rule from "../../src/rules/prefer-negation-operator-number.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2024, sourceType: "module" },
});

ruleTester.run("prefer-negation-operator-number", rule, {
  valid: [
    { code: "let num = -5;" },
    { code: "let neg = -someVar;" },
    { code: "if (-temperature < 0) { freeze(); }" },
    { code: "let result = Number(someValue);" },
    { code: "function negate() { return -value; }" },
    { code: "const opposite = -number;" },
  ],
  invalid: [
    {
      code: "let x = Number(-y);",
      output: "let x = -y;",
      errors: [
        {
          messageId: "preferNegationOperatorNumber",
          type: "CallExpression",
        },
      ],
    },
    {
      code: "const isNeg = Number(-positiveNum);",
      output: "const isNeg = -positiveNum;",
      errors: [
        {
          messageId: "preferNegationOperatorNumber",
          type: "CallExpression",
        },
      ],
    },
    {
      code: "if (Number(-flagValue) > 0) { process(); }",
      output: "if (-flagValue > 0) { process(); }",
      errors: [
        {
          messageId: "preferNegationOperatorNumber",
          type: "CallExpression",
        },
      ],
    },
    {
      code: "let result = Number(-Math.abs(someValue));",
      output: "let result = -Math.abs(someValue);",
      errors: [
        {
          messageId: "preferNegationOperatorNumber",
          type: "CallExpression",
        },
      ],
    },
    {
      code: "function negateValue(value) { return Number(-value); }",
      output: "function negateValue(value) { return -value; }",
      errors: [
        {
          messageId: "preferNegationOperatorNumber",
          type: "CallExpression",
        },
      ],
    },
  ],
});
