/**
 * @fileoverview Rule to prefer arrow functions over plain functions
 * @author Triston Jones
 */

/*
    MIT License

    Copyright (c) 2018 Triston Jones

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

const isPrototypeAssignment = (node) => {
  let { parent } = node;

  while (parent) {
    switch (parent.type) {
      case "MemberExpression":
        if (parent.property && parent.property.name === "prototype") {
          return true;
        }
        parent = parent.object;
        break;
      case "AssignmentExpression":
        parent = parent.left;
        break;
      case "Property":
      case "ObjectExpression":
        ({ parent } = parent.parent);
        break;
      default:
        return false;
    }
  }

  return false;
};

const isConstructor = (node) => {
  const { parent } = node;
  return parent && parent.kind === "constructor";
};

const containsThis = (node) => {
  if (typeof node !== "object" || node === null) {
    return false;
  }
  if (node.type === "FunctionDeclaration") {
    return false;
  }
  if (node.type === "FunctionExpression") {
    return false;
  }
  if (node.type === "ThisExpression") {
    return true;
  }
  return Object.keys(node).some((field) => {
    if (field === "parent") {
      return false;
    }
    if (Array.isArray(node[field])) {
      return node[field].some(containsThis);
    }
    return containsThis(node[field]);
  });
};

const isNamed = (node) => {
  return node.type === "FunctionDeclaration" && node.id && node.id.name;
};

const functionOnlyContainsReturnStatement = (node) => {
  return (
    node.body.body.length === 1 && node.body.body[0].type === "ReturnStatement"
  );
};

const isNamedDefaultExport = (node) => {
  return (
    node.id && node.id.name && node.parent.type === "ExportDefaultDeclaration"
  );
};

const isClassMethod = (node) => {
  return node.parent.type === "MethodDefinition";
};

const isGeneratorFunction = (node) => {
  return node.generator === true;
};

const isGetterOrSetter = (node) => {
  return node.parent.kind === "set" || node.parent.kind === "get";
};

const isCommonJSModuleProp = (node, name = "module") => {
  return (
    node &&
    node.type === "MemberExpression" &&
    node.object &&
    node.object.type === "Identifier" &&
    node.object.name === name
  );
};

const isModuleExport = (node) => {
  return (
    node.parent.type === "AssignmentExpression" &&
    (isCommonJSModuleProp(node.parent.left) ||
      isCommonJSModuleProp(node.parent.left, "exports") ||
      isCommonJSModuleProp(node.parent.left.object))
  );
};

const isStandaloneDeclaration = (node) => {
  return (
    node.type === "FunctionDeclaration" &&
    (!node.parent ||
      node.parent.type === "Program" ||
      node.parent.type === "ExportNamedDeclaration" ||
      node.parent.type === "ExportDefaultDeclaration")
  );
};

const tokenStart = (token) => {
  return token.start === undefined ? token.range[0] : token.start;
};

const tokenEnd = (token) => {
  return token.end === undefined ? token.range[1] : token.end;
};

const replaceTokens = (origSource, tokens, replacements) => {
  let removeNextLeadingSpace = false;
  let result = "";
  let lastTokenEnd = -1;

  for (const token of tokens) {
    if (lastTokenEnd >= 0) {
      let between = origSource.slice(lastTokenEnd, tokenStart(token));
      if (removeNextLeadingSpace) {
        between = between.replace(/^\s+/u, "");
      }
      result += between;
    }
    removeNextLeadingSpace = false;
    if (tokenStart(token) in replacements) {
      const replaceInfo = replacements[tokenStart(token)];
      if (replaceInfo[2]) {
        result = result.replace(/\s+$/u, "");
      }
      result += replaceInfo[0];
      removeNextLeadingSpace = Boolean(replaceInfo[1]);
    } else {
      result += origSource.slice(tokenStart(token), tokenEnd(token));
    }
    lastTokenEnd = tokenEnd(token);
  }
  return result;
};

const tokenMatcher = (type, value) => {
  return (token) => {
    return (
      token.type === type &&
      (typeof value === "undefined" || token.value === value)
    );
  };
};

const fixFunctionExpression = (src, node) => {
  const orig = src.getText();
  const tokens = src.getTokens(node);
  const bodyTokens = src.getTokens(node.body);

  const swap = {};
  const fnKeyword = tokens.find(tokenMatcher("Keyword", "function"));
  let prefix = "";
  let suffix = "";
  if (fnKeyword) {
    swap[tokenStart(fnKeyword)] = ["", true];
    const nameToken = src.getTokenAfter(fnKeyword);
    if (nameToken.type === "Identifier") {
      swap[tokenStart(nameToken)] = [""];
    }
  } else if (node.parent.type === "MethodDefinition") {
    // The eslint Node starts with the parens, like
    //    render() { return "hi"; }
    //          ^--- node starts here
    // We need to add equals sign after the method name to convert to instance property assignment
    prefix = " = ";
    suffix = ";";

    if (node.async) {
      prefix = " = async ";
    }
  } else if (node.parent.type === "Property") {
    // Similar to above
    prefix = ": ";
  }
  swap[tokenStart(bodyTokens.find(tokenMatcher("Punctuator", "{")))] = [
    "=> ",
    true,
  ];
  const parens = node.body.body[0].argument.type === "ObjectExpression";
  swap[tokenStart(bodyTokens.find(tokenMatcher("Keyword", "return")))] = [
    parens ? "(" : "",
    true,
  ];

  const returnRange = node.body.body.find((n) => {
    return n.type === "ReturnStatement";
  }).range;
  const semicolon = bodyTokens.find((t) => {
    return (
      tokenEnd(t) === returnRange[1] &&
      t.value === ";" &&
      t.type === "Punctuator"
    );
  });
  if (semicolon) {
    swap[tokenStart(semicolon)] = [parens ? ")" : "", true];
  }

  const closeBraces = bodyTokens.filter(tokenMatcher("Punctuator", "}"));
  const lastCloseBrace = closeBraces[closeBraces.length - 1];
  swap[tokenStart(lastCloseBrace)] = ["", false, true];
  return (
    prefix +
    replaceTokens(orig, tokens, swap).replace(/ $/u, "") +
    (parens && !semicolon ? ")" : "") +
    suffix
  );
};

const fixFunctionDeclaration = (src, node) => {
  const orig = src.getText();
  const tokens = src.getTokens(node);
  const bodyTokens = src.getTokens(node.body);
  const swap = {};
  const asyncKeyword = node.async ? "async " : "";
  const omitVar =
    node.parent && node.parent.type === "ExportDefaultDeclaration";
  const parens = node.body.body[0].argument.type === "ObjectExpression";
  swap[tokenStart(tokens.find(tokenMatcher("Keyword", "function")))] = omitVar
    ? ["", true]
    : ["const"];
  swap[tokenStart(tokens.find(tokenMatcher("Punctuator", "(")))] = [
    omitVar ? `${asyncKeyword}(` : ` = ${asyncKeyword}(`,
  ];

  if (node.async) {
    swap[tokenStart(tokens.find(tokenMatcher("Identifier", "async")))] = [
      "",
      true,
    ];
  }

  if (omitVar) {
    const functionKeywordToken = tokens.find(
      tokenMatcher("Keyword", "function"),
    );
    const nameToken = src.getTokenAfter(functionKeywordToken);
    if (nameToken.type === "Identifier") {
      swap[tokenStart(nameToken)] = [""];
    }
  }
  swap[tokenStart(bodyTokens.find(tokenMatcher("Punctuator", "{")))] = [
    "=> ",
    true,
  ];
  swap[tokenStart(bodyTokens.find(tokenMatcher("Keyword", "return")))] = [
    parens ? "(" : "",
    true,
  ];

  const returnRange = node.body.body.find((n) => {
    return n.type === "ReturnStatement";
  }).range;
  const semicolon = bodyTokens.find((t) => {
    return (
      tokenEnd(t) === returnRange[1] &&
      t.value === ";" &&
      t.type === "Punctuator"
    );
  });
  if (semicolon) {
    swap[tokenStart(semicolon)] = [parens ? ")" : "", true];
  }

  const closeBraces = bodyTokens.filter(tokenMatcher("Punctuator", "}"));
  const lastCloseBrace = closeBraces[closeBraces.length - 1];
  swap[tokenStart(lastCloseBrace)] = ["", false, true];
  return (
    replaceTokens(orig, tokens, swap).replace(/ $/u, "") +
    (parens && !semicolon ? ");" : ";")
  );
};

const inspectNode = (node, context) => {
  const opts = context.options[0] || {};

  if (isConstructor(node)) {
    return;
  }
  if (
    !isClassMethod(node) &&
    (containsThis(node.params) || containsThis(node.body))
  ) {
    return;
  }
  if (isGeneratorFunction(node)) {
    return;
  }
  if (isGetterOrSetter(node)) {
    return;
  }
  if (isClassMethod(node) && !opts.classPropertiesAllowed) {
    return;
  }
  if (
    opts.allowStandaloneDeclarations &&
    (isStandaloneDeclaration(node) || isModuleExport(node))
  ) {
    return;
  }

  if (opts.singleReturnOnly) {
    if (
      functionOnlyContainsReturnStatement(node) &&
      !isNamedDefaultExport(node) &&
      (opts.classPropertiesAllowed || !isClassMethod(node))
    ) {
      return context.report({
        node,
        message:
          "Prefer using arrow functions over plain functions which only return a value",
        fix: (fixer) => {
          const src = context.getSourceCode();
          let newText = null;
          if (node.type === "FunctionDeclaration") {
            newText = fixFunctionDeclaration(src, node);
          } else if (node.type === "FunctionExpression") {
            newText = fixFunctionExpression(src, node);

            // In the case of an async method definition, we remove the "async" prefix
            if (node.async && node.parent.type === "MethodDefinition") {
              const parentTokens = src.getTokens(node.parent);
              const asyncToken = parentTokens.find(
                tokenMatcher("Identifier", "async"),
              );
              const nextToken = parentTokens.find((_, i, arr) => {
                return arr[i - 1] && arr[i - 1] === asyncToken;
              });

              return [
                fixer.replaceText(node, newText),
                fixer.replaceTextRange(
                  [tokenStart(asyncToken), tokenStart(nextToken)],
                  "",
                ),
              ];
            }
          }
          if (newText !== null) {
            return fixer.replaceText(node, newText);
          }
        },
      });
    }
  } else if (opts.disallowPrototype || !isPrototypeAssignment(node)) {
    return context.report(
      node,
      isNamed(node)
        ? "Use const or class constructors instead of named functions"
        : "Prefer using arrow functions over plain functions",
    );
  }
};

module.exports = {
  meta: {
    docs: {
      description: "prefer arrow functions",
      category: "emcascript6",
      recommended: false,
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          disallowPrototype: {
            type: "boolean",
          },
          singleReturnOnly: {
            type: "boolean",
          },
          classPropertiesAllowed: {
            type: "boolean",
          },
          allowStandaloneDeclarations: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create: (context) => {
    return {
      "FunctionDeclaration:exit": (node) => {
        return inspectNode(node, context);
      },
      "FunctionExpression:exit": (node) => {
        return inspectNode(node, context);
      },
    };
  },
};
