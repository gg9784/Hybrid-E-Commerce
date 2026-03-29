const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Convert `const { a, b } = require('./c')` => `import { a, b } from './c.js'`
  content = content.replace(/const\s+(\{[^}]+\})\s*=\s*require\((['"])([^'"]+)\2\);?/g, (match, vars, quote, reqPath) => {
    let newPath = reqPath;
    if (newPath.startsWith('.')) {
      if (!newPath.endsWith('.js')) newPath += '.js';
    }
    return `import ${vars} from '${newPath}';`;
  });

  // 2. Convert `const a = require('./b')` => `import a from './b.js'`
  content = content.replace(/const\s+([a-zA-Z0-9_]+)\s*=\s*require\((['"])([^'"]+)\2\);?/g, (match, varName, quote, reqPath) => {
    let newPath = reqPath;
    if (newPath.startsWith('.')) {
      if (!newPath.endsWith('.js')) newPath += '.js';
    }
    return `import ${varName} from '${newPath}';`;
  });

  // 3. Convert `require('dotenv').config()` => `import dotenv from 'dotenv';\ndotenv.config();`
  content = content.replace(/require\((['"])dotenv\1\)\.config\(\);?/g, `import dotenv from 'dotenv';\ndotenv.config();`);

  // 4. Convert `module.exports = { a, b }` => `export { a, b }`
  content = content.replace(/module\.exports\s*=\s*(\{[\s\S]*?\});?/g, "export $1;");

  // 5. Convert `module.exports = a` => `export default a`
  content = content.replace(/module\.exports\s*=\s*([a-zA-Z0-9_]+);?/g, "export default $1;");

  // Fix __dirname in app.js
  if (filePath.endsWith('app.js') && content.includes('__dirname')) {
    const importMetaPolyfill = `
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
`;
    // Find the first line that is not an import
    const lines = content.split('\n');
    const lastImportIdx = lines.findLastIndex(line => line.startsWith('import'));
    lines.splice(lastImportIdx + 1, 0, importMetaPolyfill);
    content = lines.join('\n');
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.js')) {
      processFile(fullPath);
    }
  });
}

const targetDir = path.join(__dirname, 'LocalCart-V2', 'src');
console.log(`Processing directory: ${targetDir}`);
walkDir(targetDir);

// Update package.json
const pkgPath = path.join(__dirname, 'LocalCart-V2', 'package.json');
let pkgStr = fs.readFileSync(pkgPath, 'utf8');
pkgStr = pkgStr.replace(/"type":\s*"commonjs"/, '"type": "module"');
fs.writeFileSync(pkgPath, pkgStr);
console.log('package.json type updated to module');
