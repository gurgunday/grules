import grules from "grules";
import eslintPlugin from "eslint-plugin-eslint-plugin";

export default [...grules, eslintPlugin.configs["flat/recommended"]];
