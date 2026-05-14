/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    project: false,
  },
  settings: {
    react: { version: 'detect' },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',
    'no-empty': ['warn', { allowEmptyCatch: true }],
  },
  overrides: [
    {
      files: ['app/components/GraffitiCanvas.tsx', 'app/components/HeroY2K.tsx', 'app/components/Product3DViewer.tsx', 'app/components/3D/**/*.tsx', 'app/components/Marketing/BlackBoxAnimation.tsx', 'app/components/Product/ProductDetailEnhanced.tsx'],
      rules: {
        // @react-three/fiber uses non-DOM props on <mesh />, <light />, etc.
        'react/no-unknown-property': [
          'error',
          {
            ignore: [
              'args',
              'position',
              'castShadow',
              'receiveShadow',
              'metalness',
              'roughness',
              'emissive',
              'emissiveIntensity',
              'envMapIntensity',
              'intensity',
              'distance',
              'decay',
              'scale',
              'rotation',
              'ref',
              'vertexShader',
              'fragmentShader',
              'uniforms',
              'depthWrite',
              'toneMapped',
              'sizeAttenuation',
              'transparent',
              'opacity',
              'blending',
            ],
          },
        ],
      },
    },
  ],
  ignorePatterns: [
    'dist',
    'node_modules',
    'build',
    '.cache',
    'compare-site',
    '*.config.js',
    'playwright-report',
    'test-results',
  ],
};
