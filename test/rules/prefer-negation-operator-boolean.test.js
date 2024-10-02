import { RuleTester } from "eslint";
import rule from "../../src/rules/prefer-negation-operator-boolean.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2024, sourceType: "module" },
});

ruleTester.run("prefer-negation-operator-boolean", rule, {
  valid: [
    { code: "let bool = !true;" },
    { code: "let neg = !someVar;" },
    { code: "if (!condition) { doSomething(); }" },
    { code: "let result = Boolean(someValue);" },
    { code: "function check() { return !somethingElse; }" },
    { code: "const isFalse = !someCondition;" },
  ],
  invalid: [
    {
      code: "let x = Boolean(!y);",
      output: "let x = !y;",
      errors: [
        {
          messageId: "preferNegationOperatorBoolean",
          type: "CallExpression",
        },
      ],
    },
    {
      code: "const isNotActive = Boolean(!isActive);",
      output: "const isNotActive = !isActive;",
      errors: [
        {
          messageId: "preferNegationOperatorBoolean",
          type: "CallExpression",
        },
      ],
    },
    {
      code: "if (Boolean(!flag)) { process(); }",
      output: "if (!flag) { process(); }",
      errors: [
        {
          messageId: "preferNegationOperatorBoolean",
          type: "CallExpression",
        },
      ],
    },
    {
      code: "let result = Boolean(!Boolean(someValue));",
      output: "let result = !Boolean(someValue);",
      errors: [
        {
          messageId: "preferNegationOperatorBoolean",
          type: "CallExpression",
        },
      ],
    },
    {
      code: "function check(value) { return Boolean(!value); }",
      output: "function check(value) { return !value; }",
      errors: [
        {
          messageId: "preferNegationOperatorBoolean",
          type: "CallExpression",
        },
      ],
    },
  ],
});
