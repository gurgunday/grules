const checkLastStatement = (context, node, statement) => {
  if (
    !statement ||
    (statement.type !== "BreakStatement" &&
      statement.type !== "ContinueStatement" &&
      statement.type !== "ReturnStatement" &&
      statement.type !== "ThrowStatement")
  ) {
    context.report({
      node: statement || node,
      message: "Missing break statement at the end of the case",
    });
  }
};

export default {
  create: (context) => {
    return {
      SwitchCase: (node) => {
        if (!node.consequent.length) {
          checkLastStatement(context, node, null);
          return;
        }

        const lastStatement = node.consequent[node.consequent.length - 1];

        if (lastStatement.type === "BlockStatement") {
          const blockStatements = lastStatement.body;

          if (blockStatements.length) {
            checkLastStatement(
              context,
              node,
              blockStatements[blockStatements.length - 1],
            );
          } else {
            checkLastStatement(context, node, lastStatement);
          }
        } else {
          checkLastStatement(context, node, lastStatement);
        }
      },
    };
  },
};
