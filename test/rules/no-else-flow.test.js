import { RuleTester } from "eslint";
import rule from "../../src/rules/no-else-flow.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2024, sourceType: "module" },
});

ruleTester.run("unexpected-else-after-control-flow", rule, {
  valid: [
    {
      code: `function validIfElse() {
        if (condition) {
          doSomething();
        } else {
          doSomethingElse();
        }
      }`,
    },
    {
      code: `for(let i = 0; i < 10; i++) {
        if (i < 5) {
          console.log(i);
        } else {
          console.log('more than 5');
        }
      }`,
    },
    {
      code: `function nestedIf() {
        if (outerCondition) {
          if (innerCondition) {
            logSomething();
          } else {
            return;
          }
          finalizeSomething();
        } else {
          alternativeAction();
        }
      }`,
    },
  ],
  invalid: [
    {
      code: `function invalidReturn() {
        if (shouldReturn) {
          return value;
        } else {
          console.log('This will never run');
        }
      }`,
      errors: [
        {
          messageId: "unexpectedElseAfterControlFlow",
          data: { controlFlowType: "return" },
        },
      ],
    },
    {
      code: `for(let i = 0; i < 10; i++) {
        if (shouldBreak) {
          break;
        } else {
          continue;
        }
      }`,
      errors: [
        {
          messageId: "unexpectedElseAfterControlFlow",
          data: { controlFlowType: "break" },
        },
      ],
    },
    {
      code: `function throwError() {
        if (errorCondition) {
          throw new Error('Error occurred');
        } else {
          return 'No error';
        }
      }`,
      errors: [
        {
          messageId: "unexpectedElseAfterControlFlow",
          data: { controlFlowType: "throw" },
        },
      ],
    },
    {
      code: `function complexFlow() {
        if (a) {
          while(b) {
            if (c) {
              continue;
            } else {
              break;
            }
          }
        } else {
          return;
        }
      }`,
      errors: [
        {
          messageId: "unexpectedElseAfterControlFlow",
          data: { controlFlowType: "continue" },
        },
      ],
    },
  ],
});
