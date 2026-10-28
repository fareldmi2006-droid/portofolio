// Publishes the built site in dist/ to the gh-pages branch (GitHub Pages).
// Usage: npm run deploy
import { execSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';

const run = (cmd, cwd = 'dist') => execSync(cmd, { cwd, stdio: 'inherit' });
const remote = execSync('git remote get-url origin').toString().trim();

if (!existsSync('dist/index.html')) throw new Error('dist/ is missing. Run "npm run build" first.');
writeFileSync('dist/.nojekyll', ''); // serve files as-is

run('git init -q -b gh-pages');
run('git add -A');
run('git -c user.name="Farrell Fathurrahman" -c user.email="fareldmi2006-droid@users.noreply.github.com" commit -q -m "Publish site"');
run(`git push -f ${remote} gh-pages`);
console.log('Published to GitHub Pages: https://fareldmi2006-droid.github.io/portofolio/');
