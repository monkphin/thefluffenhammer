// bin/reset-theme.js
const mysql = require('mysql2/promise');
(async () => {
  const url = process.env.JAWSDB_URL || process.env.CLEARDB_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) { console.error('No MySQL URL env var found.'); process.exit(2); }
  const m = url.match(/^mysql:\/\/([^:]+):([^@]+)@([^:/]+):?(\d+)?\/(.+)$/i);
  if (!m) { console.error('DB URL not MySQL:', url); process.exit(2); }
  const [user, password, host, port, database] = [m[1], m[2], m[3], m[4] || '3306', decodeURIComponent(m[5])];
  const conn = await mysql.createConnection({ host, port, user, password, database });
  try {
    const [res] = await conn.execute("UPDATE settings SET value = 'casper' WHERE `key` = 'active_theme'");
    console.log('active_theme → casper (rows changed):', res.changedRows);
  } finally { await conn.end(); }
})().catch(e => { console.error(e); process.exit(1); });
