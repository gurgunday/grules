const controlFlowTypes = new Set([
  "BreakStatement",
  "ContinueStatement",
  "ReturnStatement",
  "ThrowStatement",
]);

const checkLastStatement = (context, node, statement) => {
  if (!statement || !controlFlowTypes.has(statement.type)) {
    context.report({
      node: statement || node,
      messageId: "missingBreakStatement",
    });
  }
};

export default {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      missingBreakStatement: "Missing break statement at the end of the case",
    },
  },
  create: (context) => {
    return {
      SwitchCase: (node) => {
        if (!node.consequent.length) {
          checkLastStatement(context, node, null);
          return;
        }

        let lastStatement = node.consequent[node.consequent.length - 1];

        while (lastStatement.type === "BlockStatement") {
          if (lastStatement.body.length) {
            lastStatement = lastStatement.body[lastStatement.body.length - 1];
          } else {
            lastStatement = null;
            break;
          }
        }

        checkLastStatement(context, node, lastStatement);
      },
    };
  },
};
