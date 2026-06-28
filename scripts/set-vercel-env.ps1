$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

function Read-DotEnvValue([string]$Key, [string]$Path = ".env") {
  if (-not (Test-Path $Path)) { return $null }
  $line = Get-Content $Path | Where-Object { $_ -match "^$Key=" } | Select-Object -First 1
  if (-not $line) { return $null }
  return ($line -split "=", 2)[1].Trim().Trim('"')
}

function Add-VercelEnv([string]$Name, [string]$Value, [string[]]$Targets = @("production", "preview", "development")) {
  if ([string]::IsNullOrWhiteSpace($Value)) {
    Write-Host "Skipping empty: $Name"
    return
  }
  foreach ($target in $Targets) {
    vercel env add $Name $target --value $Value --force --sensitive 2>&1 | Out-Null
    Write-Host "Set $Name ($target)"
  }
}

$productionUrl = "https://marwa-crystal.vercel.app"
$nextAuthSecret = Read-DotEnvValue "NEXTAUTH_SECRET"
$adminEmail = Read-DotEnvValue "ADMIN_EMAIL"
$adminPassword = Read-DotEnvValue "ADMIN_PASSWORD"
$cloudName = Read-DotEnvValue "CLOUDINARY_CLOUD_NAME"
$cloudKey = Read-DotEnvValue "CLOUDINARY_API_KEY"
$cloudSecret = Read-DotEnvValue "CLOUDINARY_API_SECRET"

Add-VercelEnv "NEXTAUTH_URL" $productionUrl
Add-VercelEnv "NEXTAUTH_SECRET" $nextAuthSecret
Add-VercelEnv "NEXT_PUBLIC_STORE_NAME" "Marwa Crystal" @("production", "preview", "development")
Add-VercelEnv "NEXT_PUBLIC_STORE_URL" $productionUrl @("production", "preview", "development")
Add-VercelEnv "NEXT_PUBLIC_WHATSAPP_PHONE" "212704460891" @("production", "preview", "development")
Add-VercelEnv "NEXT_PUBLIC_CONTACT_EMAIL" "marwacrystal1@gmail.com" @("production", "preview", "development")
Add-VercelEnv "ADMIN_EMAIL" $adminEmail
Add-VercelEnv "ADMIN_PASSWORD" $adminPassword
Add-VercelEnv "CLOUDINARY_CLOUD_NAME" $cloudName
Add-VercelEnv "CLOUDINARY_API_KEY" $cloudKey
Add-VercelEnv "CLOUDINARY_API_SECRET" $cloudSecret

Write-Host "Environment variables configured."
