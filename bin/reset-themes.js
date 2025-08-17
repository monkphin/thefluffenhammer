// Flip Ghost's active theme to 'casper' using JAWSDB_URL (MySQL)
const mysql = require('mysql2/promise');

async function main() {
  const url = process.env.JAWSDB_URL || process.env.CLEARDB_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) {
    console.error('No MySQL URL found (JAWSDB_URL / CLEARDB_DATABASE_URL / DATABASE_URL).');
    process.exit(2);
  }

  // Parse mysql://user:pass@host:port/db
  const m = url.match(/^mysql:\/\/([^:]+):([^@]+)@([^:/]+):?(\d+)?\/(.+)$/i);
  if (!m) {
    console.error('DB URL is not a MySQL URL:', url);
    process.exit(2);
  }

  const [user, password, host, port, database] = [m[1], m[2], m[3], m[4] || '3306', m[5]];
  const conn = await mysql.createConnection({ host, port, user, password, database });
  try {
    // Ghost stores settings as key/value (table name is `settings`)
    const [res] = await conn.execute("UPDATE settings SET value = 'casper' WHERE `key` = 'active_theme'");
    console.log('active_theme → casper (rows changed):', res.changedRows);
  } finally {
    await conn.end();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
