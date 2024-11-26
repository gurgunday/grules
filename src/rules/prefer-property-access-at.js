export default {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      preferPropertyAccessAt: "Use array indexing instead of .at()",
    },
  },
  create: (context) => ({
    CallExpression: (node) => {
      if (
        node.callee.type === "MemberExpression" &&
        node.callee.property.name === "at" &&
        node.arguments.length === 1 &&
        (node.callee.object.type === "Identifier" ||
          node.callee.object.type === "MemberExpression")
      ) {
        context.report({
          node,
          messageId: "preferPropertyAccessAt",
        });
      }
    },
  }),
};
