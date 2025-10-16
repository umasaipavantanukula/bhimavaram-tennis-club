# PowerShell Script to Apply CORS Configuration to Firebase Storage
# Run this script in PowerShell as Administrator

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Firebase Storage CORS Configuration Tool" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Google Cloud SDK is installed
Write-Host "Checking for Google Cloud SDK..." -ForegroundColor Yellow
$gcloudInstalled = Get-Command gcloud -ErrorAction SilentlyContinue

if (-not $gcloudInstalled) {
    Write-Host "❌ Google Cloud SDK not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please use one of these methods instead:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Method 1: Google Cloud Console (EASIEST)" -ForegroundColor Green
    Write-Host "1. Go to: https://console.cloud.google.com/" -ForegroundColor White
    Write-Host "2. Select project: bhimavaramtennis" -ForegroundColor White
    Write-Host "3. Navigate to: Cloud Storage → Browser" -ForegroundColor White
    Write-Host "4. Click on: bhimavaramtennis.firebasestorage.app" -ForegroundColor White
    Write-Host "5. Go to Configuration tab" -ForegroundColor White
    Write-Host "6. Click 'Edit CORS' and paste the config from firebase-cors-config.json" -ForegroundColor White
    Write-Host ""
    Write-Host "Method 2: Install Google Cloud SDK" -ForegroundColor Green
    Write-Host "Download from: https://cloud.google.com/sdk/docs/install" -ForegroundColor White
    Write-Host ""
    
    # Ask if user wants to download installer
    $download = Read-Host "Would you like to download the Google Cloud SDK installer? (y/n)"
    if ($download -eq "y" -or $download -eq "Y") {
        Write-Host "Opening download page..." -ForegroundColor Yellow
        Start-Process "https://cloud.google.com/sdk/docs/install"
    }
    
    exit
}

Write-Host "✅ Google Cloud SDK found!" -ForegroundColor Green
Write-Host ""

# Check if authenticated
Write-Host "Checking authentication status..." -ForegroundColor Yellow
$authCheck = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null

if (-not $authCheck) {
    Write-Host "❌ Not authenticated. Logging in..." -ForegroundColor Red
    gcloud auth login
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Authentication failed!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Authenticated as: $authCheck" -ForegroundColor Green
Write-Host ""

# Set project
Write-Host "Setting project to: bhimavaramtennis" -ForegroundColor Yellow
gcloud config set project bhimavaramtennis

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to set project!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Project set successfully!" -ForegroundColor Green
Write-Host ""

# Check if CORS config file exists
$corsConfigFile = "firebase-cors-config.json"
if (-not (Test-Path $corsConfigFile)) {
    Write-Host "❌ CORS config file not found: $corsConfigFile" -ForegroundColor Red
    Write-Host "Creating default CORS configuration..." -ForegroundColor Yellow
    
    $defaultCors = @'
[
  {
    "origin": [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://bhimavaram-tennis-club.vercel.app",
      "https://*.vercel.app"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    "responseHeader": [
      "Content-Type",
      "Content-Length",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Methods"
    ],
    "maxAgeSeconds": 3600
  }
]
'@
    
    Set-Content -Path $corsConfigFile -Value $defaultCors
    Write-Host "✅ Created $corsConfigFile" -ForegroundColor Green
}

Write-Host ""
Write-Host "Current CORS configuration to be applied:" -ForegroundColor Cyan
Get-Content $corsConfigFile | Write-Host -ForegroundColor White
Write-Host ""

# Confirm before applying
$confirm = Read-Host "Apply this CORS configuration? (y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "❌ Operation cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Applying CORS configuration..." -ForegroundColor Yellow
gsutil cors set $corsConfigFile gs://bhimavaramtennis.firebasestorage.app

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to apply CORS configuration!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please try using Google Cloud Console instead:" -ForegroundColor Yellow
    Write-Host "https://console.cloud.google.com/storage/browser/bhimavaramtennis.firebasestorage.app" -ForegroundColor White
    exit 1
}

Write-Host "✅ CORS configuration applied successfully!" -ForegroundColor Green
Write-Host ""

# Verify CORS configuration
Write-Host "Verifying CORS configuration..." -ForegroundColor Yellow
gsutil cors get gs://bhimavaramtennis.firebasestorage.app

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ CORS Configuration Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Clear your browser cache (Ctrl+Shift+R)" -ForegroundColor White
Write-Host "2. Wait 1-2 minutes for changes to propagate" -ForegroundColor White
Write-Host "3. Try uploading a video in the admin panel" -ForegroundColor White
Write-Host ""
Write-Host "If you still get CORS errors:" -ForegroundColor Yellow
Write-Host "- Try in incognito mode" -ForegroundColor White
Write-Host "- Check browser console (F12) for specific errors" -ForegroundColor White
Write-Host "- Verify your domain matches the CORS origins" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
