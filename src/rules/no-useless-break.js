export default {
  create: (context) => {
    return {
      SwitchStatement: (node) => {
        const { cases } = node;

        if (!cases.length) {
          return;
        }

        const lastCase = cases[cases.length - 1];

        if (!lastCase.consequent.length) {
          return;
        }

        let lastStatement = lastCase.consequent[lastCase.consequent.length - 1];

        if (lastStatement.type === "BlockStatement") {
          lastStatement = lastStatement.body[lastStatement.body.length - 1];
        }

        if (lastStatement && lastStatement.type === "BreakStatement") {
          context.report({
            node: lastStatement,
            message:
              "Unnecessary 'break' statement at the end of the switch case.",
          });
        }
      },
    };
  },
};
