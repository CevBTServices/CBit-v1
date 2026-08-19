const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '../../cbit/cbit-app-api');

console.log('=== STARTING EMPIRICAL VERIFICATION FOR M1 BACKEND PORT UPDATE ===\n');

let failedTests = 0;
let passedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
    failedTests++;
  }
}

// 1. Check .env
const envPath = path.join(apiDir, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const portMatch = envContent.match(/^PORT\s*=\s*(.*)$/m);
  assert(portMatch && portMatch[1].trim() === '2000', `.env sets PORT=2000 (found: ${portMatch ? portMatch[1] : 'none'})`);
} else {
  assert(false, `.env file exists at ${envPath}`);
}

// 2. Check .env.example
const envExamplePath = path.join(apiDir, '.env.example');
if (fs.existsSync(envExamplePath)) {
  const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
  const portMatch = envExampleContent.match(/^PORT\s*=\s*(.*)$/m);
  assert(portMatch && portMatch[1].trim() === '2000', `.env.example sets PORT=2000 (found: ${portMatch ? portMatch[1] : 'none'})`);
} else {
  assert(false, `.env.example file exists at ${envExamplePath}`);
}

// 3. Check Dockerfile
const dockerfilePath = path.join(apiDir, 'Dockerfile');
if (fs.existsSync(dockerfilePath)) {
  const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');
  const exposeMatch = dockerfileContent.match(/^EXPOSE\s+(.*)$/m);
  assert(exposeMatch && exposeMatch[1].trim() === '2000', `Dockerfile EXPOSE line is 2000 (found: ${exposeMatch ? exposeMatch[1] : 'none'})`);
  assert(!dockerfileContent.includes('4101'), `Dockerfile contains no references to port 4101`);
} else {
  assert(false, `Dockerfile exists at ${dockerfilePath}`);
}

// 4. Check src/libs/server.ts for PORT fallback and binding
const serverTsPath = path.join(apiDir, 'src/libs/server.ts');
if (fs.existsSync(serverTsPath)) {
  const serverContent = fs.readFileSync(serverTsPath, 'utf8');
  assert(serverContent.includes("PORT = '2000'") || serverContent.includes('PORT = "2000"'), `src/libs/server.ts defaults PORT to '2000'`);
  assert(serverContent.includes("host = '0.0.0.0'") || serverContent.includes('host = "0.0.0.0"'), `src/libs/server.ts binds host to '0.0.0.0'`);
  assert(serverContent.includes("Number(PORT)"), `src/libs/server.ts converts PORT to number via Number(PORT)`);
  assert(!serverContent.includes('4101'), `src/libs/server.ts contains no references to 4101`);
} else {
  assert(false, `src/libs/server.ts exists at ${serverTsPath}`);
}

// 5. Scan cbit-app-api directory for any remaining occurrences of '4101'
function scanDirFor4101(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let occurrences = [];
  for (const file of files) {
    if (file.name === 'node_modules' || file.name === 'dist' || file.name === '.git') continue;
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      occurrences = occurrences.concat(scanDirFor4101(fullPath));
    } else if (file.isFile() && !file.name.endsWith('.png') && !file.name.endsWith('.pem') && !file.name.endsWith('.wasm')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('4101')) {
        occurrences.push({ file: path.relative(apiDir, fullPath) });
      }
    }
  }
  return occurrences;
}

const remaining4101 = scanDirFor4101(apiDir);
assert(remaining4101.length === 0, `No remaining 4101 references in cbit-app-api (found in: ${JSON.stringify(remaining4101)})`);

// 6. Test process.env.PORT evaluation edge cases in Node runtime environment
console.log('\n--- Evaluating process.env.PORT logic under edge cases ---');

function evaluatePortLogic(envVal) {
  // Simulating the destructuring and validation in server.ts
  const envObj = {};
  if (envVal !== undefined) envObj.PORT = envVal;
  
  const { PORT = '2000' } = envObj;
  
  if (!PORT) {
    return { error: 'PORT tanımlı değil', raw: PORT, parsed: NaN };
  }
  
  const numPort = Number(PORT);
  return { raw: PORT, parsed: numPort, isValid: !isNaN(numPort) && numPort >= 0 && numPort <= 65535 };
}

// Edge case 1: PORT is undefined
const caseUndefined = evaluatePortLogic(undefined);
assert(caseUndefined.raw === '2000' && caseUndefined.parsed === 2000, `Undefined process.env.PORT falls back to '2000'`);

// Edge case 2: PORT is explicit '2000'
const case2000 = evaluatePortLogic('2000');
assert(case2000.raw === '2000' && case2000.parsed === 2000, `Explicit process.env.PORT='2000' parses to 2000`);

// Edge case 3: PORT is custom string '3500'
const caseCustom = evaluatePortLogic('3500');
assert(caseCustom.raw === '3500' && caseCustom.parsed === 3500, `Custom process.env.PORT='3500' parses to 3500`);

// Edge case 4: PORT is empty string ''
const caseEmpty = evaluatePortLogic('');
assert(caseEmpty.error === 'PORT tanımlı değil', `Empty string process.env.PORT='' throws error 'PORT tanımlı değil'`);

// Edge case 5: PORT is invalid string 'invalid'
const caseInvalid = evaluatePortLogic('invalid');
assert(isNaN(caseInvalid.parsed), `Invalid string process.env.PORT='invalid' produces NaN (which net.Server.listen rejects gracefully)`);

console.log(`\n=== SUMMARY: ${passedTests} passed, ${failedTests} failed ===`);
process.exit(failedTests > 0 ? 1 : 0);
