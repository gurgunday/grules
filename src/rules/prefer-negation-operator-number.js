export default {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      preferNegationOperatorNumber: "Prefer '-exp' over 'Number(-exp)'.",
    },
    fixable: "code",
  },
  create: (context) => ({
    CallExpression: (node) => {
      if (
        node.callee.name === "Number" &&
        node.arguments.length === 1 &&
        node.arguments[0].type === "UnaryExpression" &&
        node.arguments[0].operator === "-"
      ) {
        context.report({
          node,
          messageId: "preferNegationOperatorNumber",
          fix: (fixer) =>
            fixer.replaceText(
              node,
              `-${context.sourceCode.getText(node.arguments[0].argument)}`,
            ),
        });
      }
    },
  }),
};
