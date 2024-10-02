import { RuleTester } from "eslint";
import rule from "../../src/rules/prefer-literal-bigint.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2024, sourceType: "module" },
});

ruleTester.run("prefer-literal-bigint", rule, {
  valid: [
    { code: "let x = 234n;" },
    { code: "let z = BigInt('456');" },
    { code: "let w = BigInt(someVariable);" },
    { code: "let bigNum = BigInt(Number.MAX_SAFE_INTEGER + 1);" },
  ],
  invalid: [
    {
      code: "let num = BigInt(234);",
      output: "let num = 234n;",
      errors: [
        {
          messageId: "preferLiteralBigInt",
          type: "CallExpression",
        },
      ],
    },
    {
      code: "let result = BigInt(1) + BigInt(2);",
      output: "let result = 1n + 2n;",
      errors: [
        { messageId: "preferLiteralBigInt", type: "CallExpression" },
        { messageId: "preferLiteralBigInt", type: "CallExpression" },
      ],
    },
    {
      code: "function calculate() { return BigInt(10); }",
      output: "function calculate() { return 10n; }",
      errors: [
        {
          messageId: "preferLiteralBigInt",
          type: "CallExpression",
        },
      ],
    },
  ],
});
