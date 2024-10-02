export default {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      useBracketNotation: "Use bracket notation instead of .charAt()",
    },
  },
  create: (context) => {
    return {
      CallExpression: (node) => {
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.property.name === "charAt" &&
          node.arguments.length === 1
        ) {
          context.report({
            node,
            messageId: "useBracketNotation",
          });
        }
      },
    };
  },
};
