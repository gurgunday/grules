export default {
  create: (context) => {
    return {
      CallExpression: (node) => {
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.object.type === "Identifier" &&
          node.callee.object.name === "Object" &&
          node.callee.property.name === "entries" &&
          node.arguments.length === 1 &&
          node.arguments[0].type === "Identifier"
        ) {
          let current = node.parent;

          while (current) {
            if (
              current.type === "NewExpression" &&
              current.callee.type === "Identifier" &&
              current.callee.name === "Map"
            ) {
              return;
            }

            current = current.parent;
          }

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
