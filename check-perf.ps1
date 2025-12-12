$start = Get-Date
Write-Host "Démarrage du test de performance..." -ForegroundColor Cyan

# Lancer la commande et attendre qu'elle affiche le message de succès
$process = Start-Process -FilePath "pnpm" -ArgumentList "run start:dev" -PassThru -NoNewWindow

# Attendre un peu (simulation)
Start-Sleep -Seconds 10
$end = Get-Date

Write-Host "Temps écoulé: $(($end - $start).TotalSeconds) secondes" -ForegroundColor Green
Write-Host "Note: Ceci est une estimation. Regardez le temps de 'Build' dans la console." -ForegroundColor Gray
