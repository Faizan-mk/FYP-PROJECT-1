/**
 * Opens Google Cloud Console → Credentials (create OAuth Web client ID).
 * Run: npm run google:console   (from frontend/ or Backend/)
 */
const { exec } = require('child_process');

const url = 'https://console.cloud.google.com/apis/credentials';

const cmd =
  process.platform === 'win32'
    ? `start "" "${url}"`
    : process.platform === 'darwin'
      ? `open "${url}"`
      : `xdg-open "${url}"`;

exec(cmd, (err) => {
  if (err) console.error(err);
});

console.log(`
Google Cloud should open in your browser.

1) Create or pick a project.
2) APIs & Services → Credentials → Create Credentials → OAuth client ID.
3) Application type: Web application.
4) Authorized JavaScript origins — add BOTH:
     http://localhost:5173
     http://127.0.0.1:5173
5) Copy the "Client ID" (ends with .apps.googleusercontent.com).

Then in the project folder run (paste your real ID):

   cd frontend
   npm run google:set -- YOUR_CLIENT_ID.apps.googleusercontent.com

Restart "npm run dev" for frontend and backend after that.
`);
