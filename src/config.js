module.exports = {
  configs: {
    all: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      env: { es2022: true, browser: true },
      reportUnusedDisableDirectives: true,
      extends: [
        "eslint:recommended",
        "plugin:promise/recommended",
        "plugin:prettier/recommended",
        "plugin:jsdoc/recommended",
      ],
      plugins: ["grules", "unicorn", "n"],
      rules: {
        // Core changes
        "class-methods-use-this": "error",
        "one-var": ["error", "never"],
        "func-names": ["error", "never"],
        "arrow-body-style": ["error", "always"],
        curly: ["error", "all"],
        "default-case-last": "error",
        eqeqeq: ["error", "always", { null: "ignore" }],
        "no-bitwise": ["error", { int32Hint: true }],
        "no-caller": "error",
        "no-constructor-return": "error",
        "no-duplicate-imports": "error",
        "no-empty-static-block": "error",
        "no-eval": "error",
        "no-implied-eval": "error",
        "no-iterator": "error",
        "no-undef": ["error", { typeof: true }],
        "no-unused-private-class-members": "error",
        "no-use-before-define": "error",
        "no-multi-assign": ["error", { ignoreNonDeclaration: true }],
        "no-multi-str": "error",
        "no-new-native-nonconstructor": "error",
        "no-new-wrappers": "error",
        "no-octal-escape": "error",
        "no-proto": "error",
        "no-restricted-syntax": [
          "error",
          "ClassDeclaration",
          "MethodDefinition[kind='get']",
          "MethodDefinition[kind='set']",
          "FunctionDeclaration",
          "VariableDeclaration[kind='var']",
          "UnaryExpression[operator='void']",
          "UnaryExpression[operator='+']",
          "SequenceExpression",
          "LabeledStatement",
        ],

        // error — conventions that should nearly always be enforced
        // warn — conventions that should be enforced but there are valid cases where they may be ignored
        // off — conventions that should not be enforced

        // ESLint rules
        "accessor-pairs": "off",
        "array-callback-return": "off",
        "block-scoped-var": "off",
        camelcase: "off",
        "capitalized-comments": "off",
        complexity: "off",
        "consistent-return": "off",
        "consistent-this": "off",
        "default-case": "off",
        "default-param-last": "off",
        "dot-notation": "error",
        "func-name-matching": "off",
        "func-style": "off",
        "grouped-accessor-pairs": "off",
        "guard-for-in": "off",
        "init-declarations": "off",
        "logical-assignment-operators": [
          "error",
          "always",
          { enforceForIfStatements: true },
        ],
        "new-cap": ["error", { capIsNew: false }],
        "no-alert": "error",
        "no-array-constructor": "warn",
        "no-await-in-loop": "warn",
        "no-console": "warn",
        "no-continue": "off",
        "no-div-regex": "off",
        "no-else-return": ["error", { allowElseIf: false }],
        "no-empty": ["error", { allowEmptyCatch: true }],
        "no-empty-function": "off",
        "no-eq-null": "off",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-extra-label": "error",
        "no-implicit-coercion": "off",
        "no-implicit-globals": "off",
        "no-inline-comments": "off",
        "no-invalid-this": "off",
        "no-label-var": "off",
        "no-labels": "off",
        "no-lone-blocks": "error",
        "no-lonely-if": "error",
        "no-loop-func": "off",
        "no-magic-numbers": "off",
        "no-negated-condition": "off",
        "no-nested-ternary": "off",
        "no-new": "off",
        "no-new-func": "warn",
        "no-object-constructor": "warn",
        "no-param-reassign": "off",
        "no-plusplus": "off",
        "no-promise-executor-return": "off",
        "no-return-assign": "off",
        "no-self-compare": "off", // NaN
        "no-template-curly-in-string": "off",
        "no-unmodified-loop-condition": "error",
        "no-unneeded-ternary": "error",
        "no-unreachable-loop": "error",
        "no-unused-expressions": "error",
        "no-useless-call": "error",
        "no-useless-computed-key": "error",
        "no-useless-concat": "error",
        "no-useless-constructor": "error",
        "no-useless-rename": "error",
        "no-useless-return": "error",
        "object-shorthand": "error",
        "operator-assignment": ["error", "always"],
        "prefer-arrow-callback": "error",
        "prefer-const": "error",
        "prefer-destructuring": ["error", { object: true }],
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
        radix: ["error", "as-needed"],
        "require-atomic-updates": ["warn", { allowProperties: true }],
        "require-await": "warn",
        "require-unicode-regexp": "warn",
        "sort-imports": "off",
        "sort-keys": "off",
        "sort-vars": "off",
        strict: "off",
        "symbol-description": "error",

        "grules/no-charAt": "error",
        "grules/prefer-arrow-functions": "error",
        "grules/prefer-inc-dec": "error",
        "grules/prefer-literal-bigint": "error",
        "grules/prefer-negation-operator-boolean": "error",
        "grules/prefer-negation-operator-number": "error",
        "grules/prefer-property-access-at": "error",
        "grules/prefer-property-access-object-entries": "error",

        // Third-Party Rules

        "unicorn/better-regex": "error",
        "unicorn/consistent-destructuring": "error",
        "unicorn/consistent-function-scoping": "error",
        "unicorn/custom-error-definition": "error",
        "unicorn/error-message": "error",
        "unicorn/escape-case": "error",
        "unicorn/new-for-builtins": "error",
        "unicorn/no-array-for-each": "error",
        "unicorn/no-array-push-push": "error",
        "unicorn/no-console-spaces": "error",
        "unicorn/no-instanceof-array": "error",
        "unicorn/no-invalid-remove-event-listener": "error",
        "unicorn/no-lonely-if": "error",
        "unicorn/no-new-array": "error",
        "unicorn/no-new-buffer": "error",
        "unicorn/no-static-only-class": "error",
        "unicorn/no-thenable": "error",
        "unicorn/no-typeof-undefined": "error",
        "unicorn/no-unnecessary-await": "error",
        "unicorn/no-unnecessary-polyfills": "error",
        "unicorn/no-useless-fallback-in-spread": "error",
        "unicorn/no-useless-length-check": "error",
        "unicorn/no-useless-promise-resolve-reject": "error",
        "unicorn/no-useless-spread": "error",
        "unicorn/no-useless-switch-case": "error",
        "unicorn/no-useless-undefined": "error",
        "unicorn/no-zero-fractions": "error",
        "unicorn/number-literal-case": "error",
        "unicorn/prefer-array-find": "error",
        "unicorn/prefer-array-flat": "error",
        "unicorn/prefer-array-flat-map": "error",
        "unicorn/prefer-array-index-of": "error",
        "unicorn/prefer-array-some": "error",
        "unicorn/prefer-date-now": "error",
        "unicorn/prefer-default-parameters": "error",
        "unicorn/prefer-dom-node-append": "error",
        "unicorn/prefer-dom-node-dataset": "error",
        "unicorn/prefer-dom-node-remove": "error",
        "unicorn/prefer-dom-node-text-content": "error", // Don't forget to trim! Works better in all browsers.
        "unicorn/prefer-export-from": "error",
        "unicorn/prefer-includes": "error",
        "unicorn/prefer-keyboard-event-key": "error",
        "unicorn/prefer-logical-operator-over-ternary": "error",
        "unicorn/prefer-modern-dom-apis": "error",
        "unicorn/prefer-modern-math-apis": "error",
        "unicorn/prefer-native-coercion-functions": "error",
        "unicorn/prefer-negative-index": "error",
        "unicorn/prefer-node-protocol": "error",
        "unicorn/prefer-number-properties": "error",
        "unicorn/prefer-object-from-entries": "error",
        "unicorn/prefer-optional-catch-binding": "error",
        "unicorn/prefer-prototype-methods": "error",
        "unicorn/prefer-query-selector": "error",
        "unicorn/prefer-regexp-test": "error",
        "unicorn/prefer-set-has": "error",
        "unicorn/prefer-set-size": "error",
        "unicorn/prefer-spread": "error",
        "unicorn/prefer-string-slice": "error",
        "unicorn/prefer-string-starts-ends-with": "error",
        "unicorn/prefer-switch": "error",
        "unicorn/prefer-ternary": "error",
        "unicorn/prefer-type-error": "error",
        "unicorn/require-array-join-separator": "error",
        "unicorn/require-number-to-fixed-digits-argument": "warn",
        "unicorn/require-post-message-target-origin": "warn",
        "unicorn/text-encoding-identifier-case": "error",
        "unicorn/throw-new-error": "error",

        "n/no-deprecated-api": "error",
        "n/no-extraneous-import": "error",
        "n/no-missing-import": "error",
      },
    },
  },
  rules: {
    "no-charAt": require("./rules/no-charAt"),
    "prefer-arrow-functions": require("./rules/prefer-arrow-functions"),
    "prefer-inc-dec": require("./rules/prefer-inc-dec"),
    "prefer-literal-bigint": require("./rules/prefer-literal-bigint"),
    "prefer-negation-operator-boolean": require("./rules/prefer-negation-operator-boolean"),
    "prefer-negation-operator-number": require("./rules/prefer-negation-operator-number"),
    "prefer-property-access-at": require("./rules/prefer-property-access-at"),
    "prefer-property-access-object-entries": require("./rules/prefer-property-access-object-entries"),
  },
};
