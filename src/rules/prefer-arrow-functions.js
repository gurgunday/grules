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
      token.type === type && (value === undefined || token.value === value)
    );
  };
};

const fixFunctionExpression = (src, node) => {
  const orig = src.getText();
  const tokens = src.getTokens(node);
  const swap = {};

  const fnKeyword = tokens.find(tokenMatcher("Keyword", "function"));
  if (fnKeyword) {
    swap[tokenStart(fnKeyword)] = ["", true]; // Remove 'function' keyword
  }

  // Handle the opening brace of the function body
  const openingBrace = tokens.find(tokenMatcher("Punctuator", "{"));
  if (openingBrace) {
    swap[tokenStart(openingBrace)] = ["=> {", true]; // Add arrow function syntax
  }

  return replaceTokens(orig, tokens, swap);
};

const fixFunctionDeclaration = (src, node) => {
  const orig = src.getText();
  const tokens = src.getTokens(node);
  const swap = {};
  const omitVar =
    node.parent && node.parent.type === "ExportDefaultDeclaration";

  // Handle async keyword if present
  const asyncToken = tokens.find(tokenMatcher("Identifier", "async"));
  if (asyncToken) {
    swap[tokenStart(asyncToken)] = ["", true]; // Remove the existing 'async' keyword
  }

  const functionKeywordToken = tokens.find(tokenMatcher("Keyword", "function"));
  if (functionKeywordToken) {
    swap[tokenStart(functionKeywordToken)] = omitVar ? ["", true] : ["const"];
  }

  const nameToken = node.id
    ? tokens.find(tokenMatcher("Identifier", node.id.name))
    : null;
  if (nameToken) {
    swap[tokenStart(nameToken)] = [
      `${node.id.name} =${node.async ? " async" : ""} `,
      true,
    ];
  }

  // Handle the opening brace of the function body
  const openingBrace = tokens.find(tokenMatcher("Punctuator", "{"));
  if (openingBrace) {
    swap[tokenStart(openingBrace)] = ["=> {", true];
  }

  return replaceTokens(orig, tokens, swap);
};

const inspectNode = (node, context) => {
  const opts = context.options[0] || {};

  // Skip conversion for constructors
  if (isConstructor(node)) {
    return;
  }

  // Skip conversion if the function contains 'this' references and is not a class method
  if (
    !isClassMethod(node) &&
    (containsThis(node.params) || containsThis(node.body))
  ) {
    return;
  }

  // Skip conversion for generator functions
  if (isGeneratorFunction(node)) {
    return;
  }

  // Skip conversion for getters and setters
  if (isGetterOrSetter(node)) {
    return;
  }

  // Skip conversion for class methods if not allowed
  if (isClassMethod(node) && !opts.classPropertiesAllowed) {
    return;
  }

  // Skip conversion if standalone declarations are allowed and the function is a standalone declaration or module export
  if (
    opts.allowStandaloneDeclarations &&
    (isStandaloneDeclaration(node) || isModuleExport(node))
  ) {
    return;
  }

  // Report the node to be fixed
  return context.report({
    node,
    message: "Prefer using arrow functions over plain functions",
    fix: (fixer) => {
      const src = context.getSourceCode();
      let newText = null;

      if (node.type === "FunctionDeclaration") {
        newText = fixFunctionDeclaration(src, node);
      } else if (node.type === "FunctionExpression") {
        newText = fixFunctionExpression(src, node);
      }

      if (newText) {
        return fixer.replaceText(node, newText);
      }
    },
  });
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
