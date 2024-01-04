module.exports = {
  meta: {
    fixable: "code",
  },
  create: (context) => {
    const checkNode = (node) => {
      if (
        node.type === "LogicalExpression" &&
        (node.operator === "&&" || node.operator === "||")
      ) {
        if (
          node.left.type === "UnaryExpression" &&
          node.right.type === "UnaryExpression" &&
          node.left.operator === "!" &&
          node.right.operator === "!"
        ) {
          context.report({
            node,
            message:
              "Avoid multiple negated conditions in logical AND expressions",
            fix: (fixer) => {
              const sourceCode = context.getSourceCode();
              const leftArgument = sourceCode.getText(node.left.argument);
              const rightArgument = sourceCode.getText(node.right.argument);

              const fixedExpression = `!(${leftArgument} ${
                node.operator === "&&" ? "||" : "&&"
              } ${rightArgument})`;

              return fixer.replaceText(node, fixedExpression);
            },
          });
        } else {
          checkNode(node.left);
          checkNode(node.right);
        }
      }
    };

    return {
      LogicalExpression: checkNode,
    };
  },
};
