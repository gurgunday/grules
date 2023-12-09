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
            typeof argument.argument.value === "number"
          ) {
            val =
              argument.operator === "-"
                ? -argument.argument.value
                : Number(argument.argument.value);
          } else if (
            argument.type === "Literal" &&
            typeof argument.value === "number"
          ) {
            val = argument.value;
          }

          let replacement;
          if (val === undefined) {
            replacement = `${objectText}[${context
              .getSourceCode()
              .getText(argument)}]`;
          } else if (val >= 0) {
            replacement = `${objectText}[${val}]`;
          } else {
            replacement = `${objectText}[${objectText}.length - ${Math.abs(
              val,
            )}]`;
          }

          context.report({
            node,
            message: "Use array indexing instead of .at()",
            fix: (fixer) => {
              return fixer.replaceText(node, replacement);
            },
          });
        }
      },
    };
  },
};
