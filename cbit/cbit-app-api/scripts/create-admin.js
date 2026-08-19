const { randomBytes, scrypt, timingSafeEqual } = require('crypto');

const nrp = { N: 16384, r: 8, p: 1 };

const hashPassword = (password) => {
  const salt = randomBytes(12);

  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, nrp, (err, derivedKey) => {
      if (err) return reject(err);
      const saltBase64 = salt.toString('base64');
      const hashBase64 = derivedKey.toString('base64');
      resolve(`$2bz$${nrp.N}$${nrp.r}$${nrp.p}$${saltBase64}$${hashBase64}`);
    });
  });
};

const verifyPassword = (password, storedHash) => {
  const parts = storedHash.split('$');
  if (parts.length !== 7 || parts[1] !== '2bz') {
    throw new Error('Geçersiz hash formatı!');
  }

  const N = parseInt(parts[2]);
  const r = parseInt(parts[3]);
  const p = parseInt(parts[4]);
  const salt = Buffer.from(parts[5], 'base64');
  const storedKey = Buffer.from(parts[6], 'base64');

  return new Promise((resolve, reject) => {
    scrypt(password, salt, storedKey.length, { N, r, p }, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(timingSafeEqual(storedKey, derivedKey));
    });
  });
};

async function main() {
  const username = process.argv[2] || 'admin';
  const password = process.argv[3] || 'cevahirAdmin6161**';

  const hash = await hashPassword(password);
  const isValid = await verifyPassword(password, hash);

  if (!isValid) {
    throw new Error('Hash doğrulaması başarısız!');
  }

  console.log('\n========================================');
  console.log('       CBIT ADMIN HESABI OLUŞTURUCU');
  console.log('========================================');
  console.log(`Kullanıcı Adı : ${username}`);
  console.log(`Ham Şifre     : ${password}`);
  console.log(`Hashli Şifre  : ${hash}`);
  console.log('----------------------------------------');
  console.log('POSTGRESQL INSERT / UPDATE SORGUSU:\n');

  const sqlQuery = `INSERT INTO "Admin" ("id", "username", "password", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), '${username}', '${hash}', NOW(), NOW())
ON CONFLICT ("username")
DO UPDATE SET "password" = EXCLUDED."password", "updatedAt" = NOW();`;

  console.log(sqlQuery);
  console.log('========================================\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
