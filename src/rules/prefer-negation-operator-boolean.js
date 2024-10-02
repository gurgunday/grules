export default {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      preferNegationOperatorBoolean: "Prefer '!exp' over 'Boolean(!exp)'.",
    },
    fixable: "code",
  },
  create: (context) => {
    return {
      CallExpression: (node) => {
        if (
          node.callee.name === "Boolean" &&
          node.arguments.length === 1 &&
          node.arguments[0].type === "UnaryExpression" &&
          node.arguments[0].operator === "!"
        ) {
          context.report({
            node,
            messageId: "preferNegationOperatorBoolean",
            fix: (fixer) => {
              return fixer.replaceText(
                node,
                `!${context.sourceCode.getText(node.arguments[0].argument)}`,
              );
            },
          });
        }
      },
    };
  },
};
