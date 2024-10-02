export default {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      preferPropertyAccessObjectEntries:
        "Prefer `Object.keys` over `Object.entries` for variable references.",
    },
  },
  create: (context) => {
    return {
      CallExpression: (node) => {
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.object.type === "Identifier" &&
          node.callee.object.name === "Object" &&
          node.callee.property.name === "entries" &&
          node.arguments.length === 1 &&
          (node.arguments[0].type === "Identifier" ||
            node.arguments[0].type === "MemberExpression")
        ) {
          context.report({
            node,
            messageId: "preferPropertyAccessObjectEntries",
          });
        }
      },
    };
  },
};
