const comparisonOperators = new Set([
  "==",
  "===",
  "!=",
  "!==",
  ">",
  "<",
  ">=",
  "<=",
]);

module.exports = {
  meta: {
    fixable: "code",
  },
  create: (context) => {
    return {
      BinaryExpression: (node) => {
        if (
          comparisonOperators.has(node.operator) &&
          node.left.type === "Literal" &&
          node.right.type === "Literal"
        ) {
          context.report({
            node,
            message:
              "Comparisons where both sides are literals are disallowed.",
          });
        }
      },
    };
  },
};
