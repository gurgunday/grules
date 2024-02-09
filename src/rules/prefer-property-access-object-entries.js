export default {
  create: (context) => {
    return {
      CallExpression: (node) => {
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.object.name === "Object" &&
          node.callee.property.name === "entries" &&
          node.arguments.length === 1 &&
          node.arguments[0].type === "Identifier"
        ) {
          context.report({
            node,
            message:
              "Prefer `Object.keys` over `Object.entries` for variable references.",
          });
        }
      },
    };
  },
};
