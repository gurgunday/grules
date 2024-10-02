import { RuleTester } from "eslint";
import rule from "../../src/rules/prefer-inc-dec.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2024, sourceType: "module" },
});

ruleTester.run("prefer-inc-dec", rule, {
  valid: [
    { code: "let x = 1; x++;" },
    { code: "let y = 1; y--;" },
    { code: "let z = 1; z += 2;" },
    { code: "let n = 1; n -= 5;" },
    { code: "let w = 1; w += 0.5;" },
    { code: "let d = 1; d -= -1;" },
  ],
  invalid: [
    {
      code: "i += 1",
      output: "++i",
      errors: [
        {
          messageId: "preferIncDec",
          data: { operator: "++", assignment: "+=" },
          type: "AssignmentExpression",
        },
      ],
    },
    {
      code: "j -= 1",
      output: "--j",
      errors: [
        {
          messageId: "preferIncDec",
          data: { operator: "--", assignment: "-=" },
          type: "AssignmentExpression",
        },
      ],
    },
    {
      code: "k += 1; k -= 1",
      output: "++k; --k",
      errors: [
        {
          messageId: "preferIncDec",
          data: { operator: "++", assignment: "+=" },
          type: "AssignmentExpression",
        },
        {
          messageId: "preferIncDec",
          data: { operator: "--", assignment: "-=" },
          type: "AssignmentExpression",
        },
      ],
    },
    {
      code: "m += 1; m += 1; m -= 1",
      output: "++m; ++m; --m",
      errors: [
        {
          messageId: "preferIncDec",
          data: { operator: "++", assignment: "+=" },
          type: "AssignmentExpression",
        },
        {
          messageId: "preferIncDec",
          data: { operator: "++", assignment: "+=" },
          type: "AssignmentExpression",
        },
        {
          messageId: "preferIncDec",
          data: { operator: "--", assignment: "-=" },
          type: "AssignmentExpression",
        },
      ],
    },
    {
      code: "function foo() { n += 1; }",
      output: "function foo() { ++n; }",
      errors: [
        {
          messageId: "preferIncDec",
          data: { operator: "++", assignment: "+=" },
          type: "AssignmentExpression",
        },
      ],
    },
  ],
});
