export default {
  meta: {
    fixable: "code",
  },
  create: (context) => {
    return {
      AssignmentExpression: (node) => {
        if (node.right.value === 1) {
          if (node.operator === "+=") {
            context.report({
              node,
              message: "Use '++' instead of '+= 1'",
              fix: (fixer) => {
                return fixer.replaceText(node, `++${node.left.name}`);
              },
            });
          } else if (node.operator === "-=") {
            context.report({
              node,
              message: "Use '--' instead of '-= 1'",
              fix: (fixer) => {
                return fixer.replaceText(node, `--${node.left.name}`);
              },
            });
          }
        }
      },
    };
  },
};
