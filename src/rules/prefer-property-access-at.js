module.exports = {
  meta: {
    fixable: "code",
  },
  create: (context) => {
    return {
      CallExpression: (node) => {
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.property.name === "at" &&
          node.arguments.length === 1 &&
          (node.callee.object.type === "Identifier" ||
            node.callee.object.type === "MemberExpression")
        ) {
          const objectText = context
            .getSourceCode()
            .getText(node.callee.object);
          const [argument] = node.arguments;

          let val;

          if (
            argument.type === "UnaryExpression" &&
            argument.argument.type === "Literal" &&
            typeof argument.argument.value === "number"
          ) {
            val = argument.argument.value;
          } else if (
            argument.type === "Literal" &&
            typeof argument.value === "number"
          ) {
            val = argument.value;
          }

          let replacement;

          if (val !== undefined) {
            replacement =
              val >= 0
                ? `${objectText}[${val}]`
                : `${objectText}[${objectText}.length - ${-val}]`;
          }

          context.report({
            node,
            message: "Use array indexing instead of .at()",
            fix: val
              ? (fixer) => {
                  return fixer.replaceText(node, replacement);
                }
              : undefined,
          });
        }
      },
    };
  },
};
