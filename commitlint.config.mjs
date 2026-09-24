export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'project',
        'docs',
        'spec',
        'architecture',
        'quality',
        'tooling',
        'submodules',
      ],
    ],
    'scope-empty': [2, 'never'],
    'header-max-length': [2, 'always', 72],
  },
};
