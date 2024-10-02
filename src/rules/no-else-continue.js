const endsWithContinue = (statement) => {
  if (statement.type === "BlockStatement") {
    return (
      statement.body.length &&
      statement.body[statement.body.length - 1].type === "ContinueStatement"
    );
  }

  return statement.type === "ContinueStatement";
};

export default {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      unexpectedElseAfterContinue: "Unexpected else after continue statement.",
    },
  },
  create: (context) => {
    return {
      IfStatement: (node) => {
        if (node.alternate && endsWithContinue(node.consequent)) {
          context.report({
            node: node.alternate,
            messageId: "unexpectedElseAfterContinue",
          });
        }
      },
    };
  },
};
