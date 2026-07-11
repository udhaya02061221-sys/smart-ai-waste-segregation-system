$ErrorActionPreference = "Stop"

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDir

Write-Host "EcoSort Nexus deploy started..." -ForegroundColor Cyan

git config --global --add safe.directory "C:/Users/gopin/Documents/Codex/2026-07-11/br/outputs/eco-sort-ai"
git branch -M main
git remote set-url origin "https://github.com/udhaya02061221-sys/smart-ai-waste-segregation-system.git"

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main --force

if ($env:RENDER_API_KEY) {
  Write-Host "Triggering Render deploy with clear cache..." -ForegroundColor Cyan
  curl.exe -X POST "https://api.render.com/v1/services/srv-d97v7ha8qa3s73arhflg/deploys" `
    -H "Authorization: Bearer $env:RENDER_API_KEY" `
    -H "Content-Type: application/json" `
    -d "{\"clearCache\":\"clear\"}"
  Write-Host "Render deploy requested." -ForegroundColor Green
} else {
  Write-Host "GitHub push done. RENDER_API_KEY not set, so open Render and click Manual Deploy -> Clear build cache & deploy." -ForegroundColor Yellow
  Write-Host "Render service: https://dashboard.render.com/web/srv-d97v7ha8qa3s73arhflg" -ForegroundColor Yellow
}

Write-Host "Done." -ForegroundColor Green
