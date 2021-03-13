const variant = [
  'accessibility',
  'alignContents',
  'alignItems',
  'alignSelf',
  'animation',
  'appearance',
  'backgroundAttachment',
  'backgroundClip',
  'backgroundColor',
  'backgroundImage',
  'backgroundOpacity'
]
const childrenVariants = [
  'children',
  'DEFAULT',
  'children-first',
  'children-last',
  'children-odd',
  'children-even',
  'children-not-first',
  'children-not-last',
  'children-hover',
  'hover',
  'children-focus',
  'focus',
  'children-focus-within',
  'focus-within',
  'children-active',
  'active',
  'children-visited',
  'visited',
  'children-disabled',
  'disabled',
  'responsive'
];
const childrenVariantRegister = [
  'boxShadow',
  'textDecoration',
  'display',
  'width',
  'padding',
  'margin',
  'textAlign'
];

const childrenVariantMake = Object.fromEntries(childrenVariantRegister.map(
  variant => [variant, childrenVariants]
));

module.exports = {
  purge: {
    enabled: false,
    content: ['./src/**/*.svelte']
  },
  theme: {
  },
  variants: {
    extend: {
      backgroundColor: ['even', 'odd'],
      fontSize: ['hover'],
      ...childrenVariantMake,
    },
  },
  plugins: [
    require('tailwindcss-children')
  ]
}