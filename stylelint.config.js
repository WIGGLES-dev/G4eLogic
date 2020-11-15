module.exports = {
  extends: ['stylelint-config-recommended'],
  "prettier.stylelintIntegration": true,
  rules: {
    "selector-pseudo-class-no-unknown": [
      true,
      {
        "ignorePseudoClasses": ["global"]
      }
    ],
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
          "layer"
        ],
      },
    ],
    "block-no-empty": null,
    "declaration-block-trailing-semicolon": null,
    "no-descending-specificity": null,
    "no-empty-source": null,
    "selector-pseudo-class-no-unknown": null
  },
};