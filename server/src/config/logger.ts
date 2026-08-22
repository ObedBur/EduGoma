// src/config/logger.ts

// 1. Importez la librairie principale Pino.
import pino from 'pino';
import { Logger } from 'pino'; // Optionnel: pour le typage explicite

// Déclaration du transport (utilitaire de formatage)
let transportTarget: any = undefined;

// 2. Configuration du transport pour le mode Développement

/**
 * Nous vérifions si l'environnement n'est PAS la production.
 * L'option 'pino-pretty' est utilisée UNIQUEMENT en développement
 * car il est lent et inutile en production (où les logs doivent rester en JSON structuré).
 */
if (process.env.NODE_ENV !== 'production') {
  try {
    // Tente de résoudre le chemin de 'pino-pretty' pour s'assurer que Node.js le trouve.
    // Ceci est crucial pour éviter l'erreur "unable to determine transport target" avec pnpm.
    const pinoPrettyPath = require.resolve('pino-pretty');

    transportTarget = {
      // Utilisez le chemin résolu comme cible.
      target: pinoPrettyPath,
      options: {
        // Options de formatage
        colorize: true,     // Active la coloration des logs
        singleLine: true,   // Affiche les logs sur une seule ligne (plus compact)
        // timeStampKey: 'time', // Décommenter si vous voulez un horodatage spécifique
      },
    };
  } catch (error) {
    // Si 'pino-pretty' n'est pas trouvé (par exemple, dépendance non installée),
    // nous journalisons une erreur et continuons sans formatage (logs bruts en JSON).
    console.error('Pino-pretty module not found. Please install it with: pnpm install pino-pretty');
    // Le transport reste 'undefined', Pino utilisera le comportement par défaut (JSON brut).
  }
}

// 3. Configuration de l'objet Logger

/**
 * Initialisation du logger Pino avec la configuration de base et le transport conditionnel.
 */
const logger: Logger = pino({
  // Utilise le transport que nous avons défini ci-dessus (sera undefined en production)
  transport: transportTarget,
  
  // Définit le niveau minimum de log (par défaut 'info').
  // Ceci permet de filtrer les logs. Ex: 'debug', 'info', 'warn', 'error'.
  level: process.env.LOG_LEVEL || 'info',
});

// 4. Exportation du Logger

/**
 * Exporte l'instance du logger pour qu'elle soit utilisée partout dans l'application NestJS.
 */
export default logger;