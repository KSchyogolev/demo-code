module.exports = {
  '*.{js,ts,tsx}': [
    'yarn prettier:check',
    () => 'tsc --skipLibCheck --noEmit',
    'npx eslint --fix',
    `npx stylelint --fix --allow-empty-input`,
  ],
  '*.json': ['yarn prettier:check'],
};
