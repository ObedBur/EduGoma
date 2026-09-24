const fs = require('fs');
const path = require('path');

console.log("Diagnostic de l'environnement...");

const checkPackage = (pkg) => {
  try {
    const pkgPath = require.resolve(pkg);
    console.log(`✅ ${pkg} trouvé: ${pkgPath}`);
    return true;
  } catch (e) {
    console.log(`❌ ${pkg} manquant`);
    return false;
  }
};

const swcCore = checkPackage('@swc/core');
const swcCli = checkPackage('@swc/cli');

if (swcCore && swcCli) {
  console.log('\nTout semble prêt pour SWC ! 🚀');
} else {
  console.log("\nIl manque des dépendances. Veuillez patienter la fin de l'installation.");
}
