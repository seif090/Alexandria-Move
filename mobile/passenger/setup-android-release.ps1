# Alexandria Passenger - Android Release Build Setup
# Run this script to prepare for Android release

param(
    [string]$KeystorePassword = "changeit",
    [string]$KeyAlias = "alexandria-passenger",
    [string]$KeyPassword = "changeit"
)

Write-Host "=== Alexandria Passenger - Android Release Setup ===" -ForegroundColor Cyan

# Step 1: Generate Keystore
Write-Host "`n[1/4] Generating keystore..." -ForegroundColor Yellow
if (-not (Test-Path "android/app/release.keystore")) {
    New-Item -ItemType Directory -Path "android/app" -Force | Out-Null
    keytool -genkeypair -v `
        -keystore android/app/release.keystore `
        -alias $KeyAlias `
        -keyalg RSA `
        -keysize 2048 `
        -validity 10000 `
        -storepass $KeystorePassword `
        -keypass $KeyPassword `
        -dname "CN=Alexandria Mobility, OU=Mobile, O=Alexandria Community, L=Alexandria, ST=Alexandria, C=EG"
    Write-Host "  ✓ Keystore generated: android/app/release.keystore" -ForegroundColor Green
} else {
    Write-Host "  ✓ Keystore already exists" -ForegroundColor Green
}

# Step 2: Generate google-services.json placeholder
Write-Host "`n[2/4] Creating google-services.json placeholder..." -ForegroundColor Yellow
if (-not (Test-Path "google-services.json")) {
    @"
{
  "project_info": {
    "project_number": "YOUR_PROJECT_NUMBER",
    "project_id": "YOUR_PROJECT_ID",
    "storage_bucket": "YOUR_STORAGE_BUCKET"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "YOUR_MOBILE_SDK_APP_ID",
        "android_client_info": {
          "package_name": "com.alexandriacommunitymobility.passenger"
        }
      },
      "oauth_client": [
        {
          "client_id": "YOUR_GOOGLE_CLIENT_ID",
          "client_type": 3
        }
      ],
      "api_key": [
        {
          "current_key": "YOUR_ANDROID_API_KEY"
        }
      ]
    }
  ],
  "configuration_version": "1"
}
"@ | Out-File -FilePath "google-services.json" -Encoding utf8
    Write-Host "  ✓ google-services.json created (replace placeholders with Firebase Console values)" -ForegroundColor Green
} else {
    Write-Host "  ✓ google-services.json already exists" -ForegroundColor Green
}

# Step 3: Generate app icon assets
Write-Host "`n[3/4] Generating placeholder app icons..." -ForegroundColor Yellow
$assetsDir = "assets"
if (-not (Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir -Force | Out-Null
}

# Create a simple 1024x1024 PNG icon using .NET (since we need a real image)
$iconPath = "$assetsDir/icon.png"
$adaptiveIconPath = "$assetsDir/adaptive-icon.png"
$notificationIconPath = "$assetsDir/notification-icon.png"

if (-not (Test-Path $iconPath)) {
    Write-Host "  ! Replace placeholder icons in assets/ with real ones from your designer" -ForegroundColor Yellow
    Write-Host "    Required: icon.png (1024x1024), adaptive-icon.png (1024x1024), notification-icon.png (96x96)" -ForegroundColor Yellow
} else {
    Write-Host "  ✓ Icons already exist" -ForegroundColor Green
}

# Step 4: Build instructions
Write-Host "`n[4/4] Build instructions:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Development APK:" -ForegroundColor White
Write-Host "    npx expo run:android" -ForegroundColor Gray
Write-Host ""
Write-Host "  Preview APK (EAS):" -ForegroundColor White
Write-Host "    npx eas build --platform android --profile preview" -ForegroundColor Gray
Write-Host ""
Write-Host "  Production AAB:" -ForegroundColor White
Write-Host "    npx eas build --platform android --profile production" -ForegroundColor Gray
Write-Host ""
Write-Host "  Direct APK without EAS:" -ForegroundColor White
Write-Host "    cd android" -ForegroundColor Gray
Write-Host "    ./gradlew assembleRelease" -ForegroundColor Gray
Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Cyan
