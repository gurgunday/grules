module.exports = {
  configs: {
    all: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      env: { browser: true },
      reportUnusedDisableDirectives: true,
      extends: [
        "eslint:recommended",
        "plugin:promise/recommended",
        "plugin:n/recommended",
        "plugin:prettier/recommended",
      ],
      plugins: ["grules", "unicorn"],
      rules: {
        // Removals
        "one-var": ["error", "never"],
        "func-names": ["error", "never"],
        "arrow-body-style": ["error", "always"],
        curly: ["error", "all"],
        eqeqeq: ["error", "always", { null: "ignore" }],
        "no-bitwise": ["error", { int32Hint: true }],
        "no-constructor-return": "error",
        "no-eval": "error",
        "no-implied-eval": "error",
        "no-implicit-coercion": "error",
        "no-use-before-define": "error",
        "no-multi-assign": ["error", { ignoreNonDeclaration: true }],
        "no-multi-str": "error",
        "no-param-reassign": "error",
        "no-proto": "error",
        "no-restricted-syntax": [
          "error",
          "ClassDeclaration",
          "MethodDefinition[kind='get']",
          "MethodDefinition[kind='set']",
          "FunctionDeclaration",
          "VariableDeclaration[kind='var']",
          "UnaryExpression[operator='void']",
          "SequenceExpression",
          "LabeledStatement",
        ],

        // Conventions that might as well be considered language features
        "no-extend-native": "error",
        "no-new-native-nonconstructor": "error",
        "no-new-wrappers": "error",
        "no-unused-private-class-members": "error",
        "class-methods-use-this": "error",

        // Conventions that practically always make sense
        "dot-notation": "error",
        "object-shorthand": "error",
        "operator-assignment": ["error", "always"],
        "logical-assignment-operators": [
          "error",
          "always",
          { enforceForIfStatements: true },
        ],
        "no-alert": "error",
        "no-console": "error",
        "no-constant-binary-expression": "error",
        "no-duplicate-imports": "error",
        "no-else-return": ["error", { allowElseIf: false }],
        "no-empty": ["error", { allowEmptyCatch: true }],
        "no-empty-static-block": "error",
        "no-extra-bind": "error",
        "no-array-constructor": "error",
        "no-object-constructor": "error",
        "no-lone-blocks": "error",
        "no-lonely-if": "error",
        "no-self-compare": "error",
        "no-unneeded-ternary": "error",
        "no-unmodified-loop-condition": "error",
        "no-unreachable-loop": "error",
        "no-useless-call": "error",
        "no-useless-computed-key": "error",
        "no-useless-concat": "error",
        "no-useless-constructor": "error",
        "no-useless-rename": "error",
        "no-useless-return": "error",

        "prefer-arrow-callback": "error",
        "prefer-const": "error",
        "prefer-destructuring": "error",
        "prefer-exponentiation-operator": "error",
        "prefer-named-capture-group": "error",
        "prefer-numeric-literals": "error",
        "prefer-object-has-own": "error",
        "prefer-object-spread": "error",
        "prefer-promise-reject-errors": "error",
        "prefer-regex-literals": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error",

        "require-atomic-updates": ["warn", { allowProperties: true }],
        "require-await": "warn",
        "require-unicode-regexp": "warn",

        "n/prefer-global/buffer": ["error", "never"],
        "n/prefer-global/process": ["error", "never"],

        "grules/no-charAt": "error",
        "grules/prefer-arrow-functions": "error",
        "grules/prefer-inc-dec": "error",
        "grules/prefer-index-access": "error",

        // Unicorn conventions
        "unicorn/better-regex": "error",
        "unicorn/consistent-function-scoping": "error",
        "unicorn/custom-error-definition": "error",
        "unicorn/error-message": "error",

        "unicorn/no-array-for-each": "error",
        "unicorn/no-array-push-push": "error",
        "unicorn/no-instanceof-array": "error",
        "unicorn/no-negated-condition": "error",
        "unicorn/no-static-only-class": "error",
        "unicorn/no-thenable": "error",
        "unicorn/no-unnecessary-await": "error",
        "unicorn/no-useless-fallback-in-spread": "error",
        "unicorn/no-useless-length-check": "error",
        "unicorn/no-useless-promise-resolve-reject": "error",
        "unicorn/no-useless-spread": "error",
        "unicorn/no-useless-switch-case": "error",
        "unicorn/no-useless-undefined": "error",

        "unicorn/prefer-add-event-listener": "error",
        "unicorn/prefer-array-find": "error",
        "unicorn/prefer-array-flat": "error",
        "unicorn/prefer-array-flat-map": "error",
        "unicorn/prefer-array-index-of": "error",
        "unicorn/prefer-array-some": "error",
        "unicorn/prefer-blob-reading-methods": "error",
        "unicorn/prefer-code-point": "error",
        "unicorn/prefer-date-now": "error",
        "unicorn/prefer-default-parameters": "error",
        "unicorn/prefer-dom-node-append": "error",
        "unicorn/prefer-dom-node-dataset": "error",
        "unicorn/prefer-dom-node-remove": "error",
        "unicorn/prefer-dom-node-text-content": "error",
        "unicorn/prefer-export-from": "error",
        "unicorn/prefer-includes": "error",
        "unicorn/prefer-keyboard-event-key": "error",
        "unicorn/prefer-logical-operator-over-ternary": "error",
        "unicorn/prefer-modern-dom-apis": "error",
        "unicorn/prefer-modern-math-apis": "error",
        "unicorn/prefer-negative-index": "error",
        "unicorn/prefer-node-protocol": "error",
        "unicorn/prefer-number-properties": "error",
        "unicorn/prefer-object-from-entries": "error",
        "unicorn/prefer-prototype-methods": "error",
        "unicorn/prefer-query-selector": "error",
        "unicorn/prefer-reflect-apply": "error",
        "unicorn/prefer-regexp-test": "error",
        "unicorn/prefer-set-has": "error",
        "unicorn/prefer-set-size": "error",
        "unicorn/prefer-optional-catch-binding": "error",
        "unicorn/prefer-string-starts-ends-with": "error",
        "unicorn/prefer-switch": "error",
        "unicorn/prefer-ternary": "error",
        "unicorn/prefer-type-error": "error",

        "unicorn/require-array-join-separator": "warn",
        "unicorn/require-number-to-fixed-digits-argument": "warn",
        "unicorn/require-post-message-target-origin": "warn",
      },
    },
  },
  rules: {
    "no-charAt": require("./rules/no-charAt.js"),
    "prefer-arrow-functions": require("./rules/prefer-arrow-functions.js"),
    "prefer-explicit-conditionals": require("./rules/prefer-explicit-conditionals.js"),
    "prefer-inc-dec": require("./rules/prefer-inc-dec.js"),
    "prefer-index-access": require("./rules/prefer-index-access.js"),
  },
};
