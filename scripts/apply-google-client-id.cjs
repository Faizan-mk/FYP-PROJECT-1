/**
 * Writes the same Web OAuth client ID into frontend/.env and Backend/.env.
 * Usage: node scripts/apply-google-client-id.cjs YOUR_ID.apps.googleusercontent.com
 */
const fs = require('fs');
const path = require('path');

const clientId = (process.argv[2] || '').trim();

if (!clientId || !clientId.includes('apps.googleusercontent.com')) {
  console.error(
    '\nUsage: npm run google:set -- YOUR_CLIENT_ID.apps.googleusercontent.com\n'
  );
  process.exit(1);
}

const root = path.join(__dirname, '..');
const frontendEnv = path.join(root, 'frontend', '.env');
const backendEnv = path.join(root, 'Backend', '.env');

function upsertLine(content, key, value) {
  const normalized = content.replace(/\r\n/g, '\n');
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, 'm');
  if (re.test(normalized)) {
    return normalized.replace(re, line);
  }
  const trimmed = normalized.replace(/\s+$/, '');
  return `${trimmed}\n${line}\n`;
}

for (const file of [frontendEnv, backendEnv]) {
  if (!fs.existsSync(file)) {
    console.error('Missing file:', file);
    process.exit(1);
  }
}

let fe = fs.readFileSync(frontendEnv, 'utf8');
fe = upsertLine(fe, 'VITE_GOOGLE_CLIENT_ID', clientId);
fe = upsertLine(fe, 'GOOGLE_CLIENT_ID', clientId);
fs.writeFileSync(frontendEnv, fe, 'utf8');

let be = fs.readFileSync(backendEnv, 'utf8');
be = upsertLine(be, 'GOOGLE_CLIENT_ID', clientId);
fs.writeFileSync(backendEnv, be, 'utf8');

console.log('\nUpdated:', frontendEnv);
console.log('Updated:', backendEnv);
console.log('\nRestart Vite and the backend server, then use Continue with Google.\n');
