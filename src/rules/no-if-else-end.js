module.exports = {
  create: (context) => {
    return {
      IfStatement: (node) => {
        // Check if this IfStatement is the last statement in the block
        if (
          node.parent.type === "BlockStatement" &&
          node.parent.body[node.parent.body.length - 1] === node
        ) {
          // Check if neither consequent nor alternate ends with return or continue
          const lastConsequentStatement =
            node.consequent.body[node.consequent.body.length - 1];
          const lastAlternateStatement =
            node.alternate &&
            node.alternate.body[node.alternate.body.length - 1];

          const endsWithReturnOrContinue = (statement) => {
            return (
              statement &&
              (statement.type === "ReturnStatement" ||
                (statement.type === "ExpressionStatement" &&
                  statement.expression.type === "ContinueStatement"))
            );
          };

          if (
            !endsWithReturnOrContinue(lastConsequentStatement) ||
            (node.alternate &&
              !endsWithReturnOrContinue(lastAlternateStatement))
          ) {
            context.report({
              node,
              message:
                "Flow should not finish with an if-else statement; ensure one condition has a return or continue.",
            });
          }
        }
      },
    };
  },
};
