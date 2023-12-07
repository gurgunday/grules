module.exports = {
  meta: {
    fixable: "code",
  },
  create: (context) => {
    return {
      AssignmentExpression: (node) => {
        if (node.operator === "+=" && node.right.value === 1) {
          context.report({
            node,
            message: "Use '++' instead of '+= 1'",
            fix: (fixer) => {
              return fixer.replaceText(node, `++${node.left.name}`);
            },
          });
        } else if (node.operator === "-=" && node.right.value === 1) {
          context.report({
            node,
            message: "Use '--' instead of '-= 1'",
            fix: (fixer) => {
              return fixer.replaceText(node, `--${node.left.name}`);
            },
          });
        }
      },
    };
  },
};
