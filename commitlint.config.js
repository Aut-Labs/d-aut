module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['build', 'chore', 'docs', 'improvement', 'feat', 'fix', 'perf', 'refactor', 'revert']],
  },
};
