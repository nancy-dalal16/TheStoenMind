import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  { ignores: [".next/**", "node_modules/**", "out/**", "design/**"] },
];

export default eslintConfig;
