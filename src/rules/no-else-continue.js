module.exports = {
  create: (context) => {
    return {
      IfStatement: (node) => {
        if (
          node.alternate &&
          node.consequent.type === "BlockStatement" &&
          node.consequent.body.some((statement) => {
            return statement.type === "ContinueStatement";
          })
        ) {
          context.report({
            node: node.alternate,
            message: "Unexpected else after continue statement.",
          });
        }
      },
    };
  },
};
