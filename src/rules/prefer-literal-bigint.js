export default {
  meta: {
    fixable: "code",
  },
  create: (context) => {
    return {
      CallExpression: (node) => {
        if (
          node.callee.name === "BigInt" &&
          node.arguments.length === 1 &&
          node.arguments[0].type === "Literal" &&
          typeof node.arguments[0].value === "number"
        ) {
          context.report({
            node,
            message:
              "Prefer using BigInt literals (e.g., 234n) instead of BigInt with a literal number.",
            fix: (fixer) => {
              const bigintLiteral = `${node.arguments[0].value}n`;
              return fixer.replaceText(node, bigintLiteral);
            },
          });
        }
      },
    };
  },
};
