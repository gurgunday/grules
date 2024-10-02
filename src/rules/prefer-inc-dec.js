export default {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      preferIncDec: "Use '{{operator}}' instead of '{{assignment}}'",
    },
    fixable: "code",
  },
  create: (context) => {
    return {
      AssignmentExpression: (node) => {
        if (node.right.value === 1) {
          if (node.operator === "+=") {
            context.report({
              node,
              messageId: "preferIncDec",
              data: {
                operator: "++",
                assignment: "+=",
              },
              fix: (fixer) => {
                return fixer.replaceText(node, `++${node.left.name}`);
              },
            });
          } else if (node.operator === "-=") {
            context.report({
              node,
              messageId: "preferIncDec",
              data: {
                operator: "--",
                assignment: "-=",
              },
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
