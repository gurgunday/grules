import { RuleTester } from "eslint";
import rule from "../../src/rules/prefer-property-access-at.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2024, sourceType: "module" },
});

ruleTester.run("prefer-property-access-at", rule, {
  valid: [
    { code: "let x = arr[0];" },
    { code: "let complex = obj[arr[1].prop];" },
  ],
  invalid: [
    {
      code: "let item = arr.at(0);",
      errors: [
        {
          messageId: "preferPropertyAccessAt",
          type: "CallExpression",
        },
      ],
    },
    {
      code: "const lastItem = someArray.at(someArray.length - 1);",
      errors: [
        {
          messageId: "preferPropertyAccessAt",
          type: "CallExpression",
        },
      ],
    },
    {
      code: "if (collection.at(index)) { doSomething(); }",
      errors: [
        {
          messageId: "preferPropertyAccessAt",
          type: "CallExpression",
        },
      ],
    },
    {
      code: "let element = nestedObj.arrayProp.at(someIndex);",
      errors: [
        {
          messageId: "preferPropertyAccessAt",
          type: "CallExpression",
        },
      ],
    },
    {
      code: "function getElement(a, i) { return a.at(i); }",
      errors: [
        {
          messageId: "preferPropertyAccessAt",
          type: "CallExpression",
        },
      ],
    },
  ],
});
