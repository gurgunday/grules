import { RuleTester } from "eslint";
import rule from "../../src/rules/prefer-property-access-object-entries.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2024, sourceType: "module" },
});

ruleTester.run("prefer-property-access-object-entries", rule, {
  valid: [
    { code: "let keys = Object.keys(obj);" },
    { code: "let entries = Object.entries({}).map(([k, v]) => v);" },
  ],
  invalid: [
    {
      code: "let keys = Object.entries(someObj).map(entry => entry[0]);",
      errors: [
        {
          messageId: "preferPropertyAccessObjectEntries",
          type: "CallExpression",
        },
      ],
    },
    {
      code: "let keyList = Object.entries(myObject).reduce((acc, [key]) => acc.concat(key), []);",
      errors: [
        {
          messageId: "preferPropertyAccessObjectEntries",
          type: "CallExpression",
        },
      ],
    },
    {
      code: "let keyArray = Object.entries(anotherObj)[0];",
      errors: [
        {
          messageId: "preferPropertyAccessObjectEntries",
          type: "CallExpression",
        },
      ],
    },
    {
      code: "function getKeys(o) { return Object.entries(o).flat().filter((_, i) => i % 2 === 0); }",
      errors: [
        {
          messageId: "preferPropertyAccessObjectEntries",
          type: "CallExpression",
        },
      ],
    },
  ],
});
