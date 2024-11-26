export default {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      preferLiteralBigInt:
        "Prefer using BigInt literals (e.g., 234n) instead of BigInt with a literal number.",
    },
    fixable: "code",
  },
  create: (context) => ({
    CallExpression: (node) => {
      if (
        node.callee.name === "BigInt" &&
        node.arguments.length === 1 &&
        node.arguments[0].type === "Literal" &&
        typeof node.arguments[0].value === "number"
      ) {
        context.report({
          node,
          messageId: "preferLiteralBigInt",
          fix: (fixer) =>
            fixer.replaceText(node, `${node.arguments[0].value}n`),
        });
      }
    },
  }),
};
