import { RuleTester } from "eslint";
import rule from "../../src/rules/no-charAt.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2024, sourceType: "module" },
});

ruleTester.run("no-char-at", rule, {
  valid: [
    { code: 'const char = "hello"[0];' },
    { code: "const char = str[0];" },
    { code: 'const char = ("hello" + "world")[5];' },

    { code: "str.trim()" },
    { code: "str.substring(0, 1)" },
    { code: "obj.charAt" },
    { code: "charAt(0)" },

    { code: "str.charAt()" },
    { code: "str.charAt(0, 1)" },
  ],
  invalid: [
    {
      code: 'const char = "hello".charAt(0);',
      errors: [{ messageId: "useBracketNotation" }],
    },
    {
      code: "const char = str.charAt(0);",
      errors: [{ messageId: "useBracketNotation" }],
    },
    {
      code: 'const char = (str + "world").charAt(5);',
      errors: [{ messageId: "useBracketNotation" }],
    },
    {
      code: "const char = getStr().charAt(0);",
      errors: [{ messageId: "useBracketNotation" }],
    },
    {
      code: 'if (str.charAt(i) === "a") {}',
      errors: [{ messageId: "useBracketNotation" }],
    },
    {
      code: "str.charAt(str.length - 1);",
      errors: [{ messageId: "useBracketNotation" }],
    },
  ],
});
