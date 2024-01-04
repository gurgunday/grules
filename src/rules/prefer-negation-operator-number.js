module.exports = {
  meta: {
    fixable: "code",
  },
  create: (context) => {
    return {
      CallExpression: (node) => {
        if (
          node.callee.name === "Number" &&
          node.arguments.length === 1 &&
          node.arguments[0].type === "UnaryExpression" &&
          node.arguments[0].operator === "-"
        ) {
          context.report({
            node,
            message: "Prefer '-exp' over 'Number(-exp)'.",
            fix: (fixer) => {
              const sourceCode = context.getSourceCode();
              const argumentText = sourceCode.getText(
                node.arguments[0].argument,
              );
              return fixer.replaceText(node, `-${argumentText}`);
            },
          });
        }
      },
    };
  },
};
