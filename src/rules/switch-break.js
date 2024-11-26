const controlFlowTypes = new Set([
  "BreakStatement",
  "ContinueStatement",
  "ReturnStatement",
  "ThrowStatement",
]);

export default {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      missingBreakStatement: "Missing break statement at the end of the case",
    },
  },
  create: (context) => ({
    SwitchCase: (node) => {
      if (!node.consequent.length) {
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

      if (lastStatement && !controlFlowTypes.has(lastStatement.type)) {
        context.report({
          node: lastStatement,
          messageId: "missingBreakStatement",
        });
      }
    },
  }),
};
