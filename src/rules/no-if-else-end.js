module.exports = {
  create: (context) => {
    return {
      IfStatement: (node) => {
        // Check if this IfStatement is the last statement in the block
        if (
          node.parent.type === "BlockStatement" &&
          node.parent.body[node.parent.body.length - 1] === node &&
          node.alternate && // Ensure there is an 'else' block
          node.alternate.type === "BlockStatement" // Ensure the alternate is a simple 'else', not 'else if'
        ) {
          // Function to get the last statement of a block
          const getLastStatement = (block) => {
            if (block && block.type === "BlockStatement") {
              return block.body[block.body.length - 1];
            }
            return block;
          };

          // Get the last statements of the consequent and alternate blocks
          const lastConsequentStatement = getLastStatement(node.consequent);
          const lastAlternateStatement = getLastStatement(node.alternate);

          // Check if a statement ends with return or continue
          const endsWithReturnOrContinue = (statement) => {
            return (
              statement &&
              (statement.type === "ReturnStatement" ||
                statement.type === "ContinueStatement")
            );
          };

          if (
            !endsWithReturnOrContinue(lastConsequentStatement) ||
            !endsWithReturnOrContinue(lastAlternateStatement)
          ) {
            context.report({
              node,
              message:
                "Flow should not finish with an if-else statement; ensure one condition has a return or continue.",
            });
          }
        }
      },
    };
  },
};
