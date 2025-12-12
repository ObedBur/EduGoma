# Script PowerShell pour appliquer le schéma Prisma et corriger les erreurs TypeScript

Write-Host "=== Configuration de la Base de Données Education Goma ===" -ForegroundColor Cyan
Write-Host ""

# Étape 1: Générer le client Prisma (résout les erreurs TypeScript)
Write-Host "Étape 1: Génération du client Prisma..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Client Prisma généré avec succès!" -ForegroundColor Green
} else {
    Write-Host "✗ Erreur lors de la génération du client Prisma" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Étape 2: Appliquer le schéma à la base de données
Write-Host "Étape 2: Application du schéma à la base de données..." -ForegroundColor Yellow
Write-Host "Note: Si demandé, tapez 'yes' pour confirmer" -ForegroundColor Gray

npx prisma migrate dev --name init

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Schéma appliqué avec succès!" -ForegroundColor Green
} else {
    Write-Host "⚠ La migration a échoué. Essayons avec db push..." -ForegroundColor Yellow
    npx prisma db push --accept-data-loss
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Schéma appliqué avec db push!" -ForegroundColor Green
    } else {
        Write-Host "✗ Erreur lors de l'application du schéma" -ForegroundColor Red
        Write-Host "Vérifiez que PostgreSQL est en cours d'exécution sur le port 5433" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "=== Configuration terminée! ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Yellow
Write-Host "1. Redémarrez le serveur de développement: pnpm run start:dev" -ForegroundColor White
Write-Host "2. Les erreurs TypeScript devraient avoir disparu" -ForegroundColor White
Write-Host "3. Testez les endpoints dans QUICK_START.md" -ForegroundColor White
Write-Host ""
