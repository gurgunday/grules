module.exports = {
  create: (context) => {
    return {
      CallExpression: (node) => {
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.object.type === "Identifier" &&
          node.callee.object.name === "console" &&
          node.callee.property.name === "log" &&
          node.arguments.length === 0
        ) {
          context.report({
            node,
            message: "Use of console.log is disallowed in production",
          });
        }
      },
    };
  },
};
