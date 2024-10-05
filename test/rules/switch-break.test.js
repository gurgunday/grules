import { RuleTester } from "eslint";
import rule from "../../src/rules/switch-break.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2024, sourceType: "module" },
});

ruleTester.run("switch-break", rule, {
  valid: [
    {
      code: `
          switch (value) {
            case 1:
              console.log('one');
              break;
            case 2: {
              console.log('two');
              break;
            }
            default:
              break;
          }
        `,
    },
    {
      code: `
          function test() {
            switch (value) {
              case 1:
                console.log('one');
                return true;
              case 2:
                throw new Error();
              default:
                break;
            }
          }
        `,
    },
    {
      code: `
          switch (type) {
            case 'A': {
              if (x) {
                doSomething();
              }
              break;
            }
          }
        `,
    },
    {
      code: `
          switch (value) {
            case 1: {
              {
                console.log('nested');
                break;
              }
            }
          }
        `,
    },
    {
      code: `
          while (true) {
            switch (value) {
              case 1:
                continue;
              case 2:
                break;
            }
          }
        `,
    },
    {
      code: `
          while (true) {
            switch (value) {
              case 1:
              case 2:
                console.log('123')
                break;
            }
          }
        `,
    },
  ],
  invalid: [
    {
      code: `
          switch (value) {
            case 1:
              console.log('one');
            case 2:
              console.log('two');
          }
        `,
      errors: [
        {
          messageId: "missingBreakStatement",
          line: 4,
        },
        {
          messageId: "missingBreakStatement",
          line: 6,
        },
      ],
    },
    {
      code: `
          switch (value) {
            case 1:
            case 2:
              console.log('two');
          }
        `,
      errors: [
        {
          messageId: "missingBreakStatement",
        },
      ],
    },
    {
      code: `
          switch (value) {
            case 1: {
              console.log('one');
            }
          }
        `,
      errors: [
        {
          messageId: "missingBreakStatement",
        },
      ],
    },
    {
      code: `
          switch (value) {
            case 1: {
              {
                console.log('nested');
              }
            }
          }
        `,
      errors: [
        {
          messageId: "missingBreakStatement",
        },
      ],
    },
    {
      code: `
          function test() {
            switch (value) {
              case 1: {
                console.log('test');
              }
              case 2:
                console.log('two');
            }
          }
        `,
      errors: [
        {
          messageId: "missingBreakStatement",
        },
        {
          messageId: "missingBreakStatement",
        },
      ],
    },
  ],
});
