const controlFlowTypes = new Set([
  "BreakStatement",
  "ContinueStatement",
  "ReturnStatement",
  "ThrowStatement",
]);

const endsWithControlFlow = (statement) => {
  if (statement.type === "BlockStatement") {
    if (statement.body.length) {
      const lastStmt = statement.body[statement.body.length - 1];

      return controlFlowTypes.has(lastStmt.type) && lastStmt.type;
    }

    return false;
  }

  return controlFlowTypes.has(statement.type) && statement.type;
};

export default {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      unexpectedElseAfterControlFlow:
        "Unexpected else after {{controlFlowType}} statement.",
    },
  },
  create: (context) => {
    return {
      IfStatement: (node) => {
        if (node.alternate) {
          const controlFlowType = endsWithControlFlow(node.consequent);

          if (controlFlowType) {
            context.report({
              node: node.alternate,
              messageId: "unexpectedElseAfterControlFlow",
              data: {
                controlFlowType: controlFlowType
                  .replace("Statement", "")
                  .toLowerCase(),
              },
            });
          }
        }
      },
    };
  },
};
