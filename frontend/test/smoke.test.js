const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const requiredFiles = [
  'src/components/module-page.tsx',
  'src/components/shell.tsx',
  'src/app/login/page.tsx',
  'src/app/(protected)/layout.tsx',
  'src/app/(protected)/dashboard/page.tsx',
];

for (const relativePath of requiredFiles) {
  const absolutePath = path.join(root, relativePath);
  assert.ok(fs.existsSync(absolutePath), `${relativePath} should exist`);
  assert.ok(fs.statSync(absolutePath).size > 0, `${relativePath} should not be empty`);
}

const loginPage = fs.readFileSync(path.join(root, 'src/app/login/page.tsx'), 'utf8');
assert.ok(loginPage.includes('admin@infracare.local'), 'login page should document demo credentials');

console.log('Frontend smoke checks passed');
