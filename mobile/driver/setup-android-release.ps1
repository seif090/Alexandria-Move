# Alexandria Driver - Android Release Build Setup
# Run this script to prepare for Android release

param(
    [string]$KeystorePassword = "changeit",
    [string]$KeyAlias = "alexandria-driver",
    [string]$KeyPassword = "changeit"
)

Write-Host "=== Alexandria Driver - Android Release Setup ===" -ForegroundColor Cyan

if (-not (Test-Path "android/app/release.keystore")) {
    Write-Host "`n[1/4] Generating keystore..." -ForegroundColor Yellow
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
    Write-Host "  ✓ Keystore generated" -ForegroundColor Green
} else {
    Write-Host "`n[1/4] Keystore already exists" -ForegroundColor Green
}

if (-not (Test-Path "google-services.json")) {
    Write-Host "`n[2/4] Creating google-services.json placeholder..." -ForegroundColor Yellow
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
          "package_name": "com.alexandriacommunitymobility.driver"
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
    Write-Host "  ✓ google-services.json created (replace placeholders)" -ForegroundColor Green
} else {
    Write-Host "`n[2/4] google-services.json already exists" -ForegroundColor Green
}

Write-Host "`n[3/4] Check app icons..." -ForegroundColor Yellow
Write-Host "  ! Replace placeholder icons in assets/ with real ones" -ForegroundColor Yellow
Write-Host "    Required: icon.png (1024x1024), adaptive-icon.png (1024x1024), notification-icon.png (96x96)" -ForegroundColor Yellow

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
