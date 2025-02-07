const fs = require('fs');
const path = require('path');

const directoryPath = './projects/eqp-ui/src/lib/scss'; // Modifica il percorso in base alla tua struttura delle cartelle

function getAllFiles(dir, fileArray = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileArray);
    } else {
      fileArray.push(filePath);
    }
  });

  return fileArray;
}

const allFiles = getAllFiles(directoryPath);

// Genera le importazioni
const importStatements = allFiles.map((file) => `export * from '${file.replace('./src', '..')}';`);

// Scrivi le importazioni nel file public-api.ts
fs.writeFileSync('./src/public-scss.ts', importStatements.join('\n'));
