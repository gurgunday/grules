nonbreakin**grules** is a carefully curated subset of JavaScript that focuses on harmony.

It will not prevent you from writing code that is fast, but it will guide you to write code that is coherent and elegant.

![grules.png](./grules.png)

## Installation

```shell
npm i grules
```

## Usage

Create `.eslintrc.json` at the root of the project:

```json
{
  "root": true,
  "env": { "node": true },
  "extends": ["plugin:grules/all"]
}
```

Add the following to `package.json`:

```json
"scripts": {
  "lint": "eslint . && prettier --check .",
  "lint:fix": "eslint --fix . && prettier --write ."
}
```
