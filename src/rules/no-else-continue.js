const endsWithContinue = (statement) => {
  if (statement.type === "BlockStatement") {
    const { body } = statement;
    return (
      body.length > 0 && body[body.length - 1].type === "ContinueStatement"
    );
  }

  return statement.type === "ContinueStatement";
};

export default {
  create: (context) => {
    return {
      IfStatement: (node) => {
        if (node.alternate && endsWithContinue(node.consequent)) {
          context.report({
            node: node.alternate,
            message: "Unexpected else after continue statement.",
          });
        }
      },
    };
  },
};
