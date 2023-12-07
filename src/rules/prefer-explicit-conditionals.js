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

const enforceExplicitComparisonRecursively = (context, node) => {
  if (node.type === "LogicalExpression") {
    enforceExplicitComparisonRecursively(context, node.left);
    enforceExplicitComparisonRecursively(context, node.right);
  } else if (
    !(
      node.type === "BinaryExpression" &&
      comparisonOperators.has(node.operator) === true
    )
  ) {
    context.report({
      node,
      message: "Conditional expressions must use explicit comparisons.",
    });
  }
};

module.exports = {
  create: (context) => {
    return {
      ConditionalExpression: (node) => {
        enforceExplicitComparisonRecursively(context, node.test);
      },
      IfStatement: (node) => {
        enforceExplicitComparisonRecursively(context, node.test);
      },
    };
  },
};
