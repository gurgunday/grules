module.exports = {
  meta: {
    fixable: "code",
  },
  create: (context) => {
    return {
      CallExpression: (node) => {
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.object.type === "Identifier" &&
          node.callee.property.name === "charAt" &&
          node.arguments.length === 1
        ) {
          const argument = node.arguments[0];
          const argumentCode = context.sourceCode.getText(argument);
          const objectText = context.sourceCode.getText(node.callee.object);

          context.report({
            node,
            message: "Use bracket notation instead of .charAt()",
            fix: (fixer) => {
              return fixer.replaceText(node, `${objectText}[${argumentCode}]`);
            },
          });
        }
      },
    };
  },
};
