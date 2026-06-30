# Generate stub CQRS files for all missing types
# Usage: pwsh -File generate-stubs.ps1

# Get all error lines from build
$errors = dotnet build Alexandria.sln 2>&1 | Select-String -Pattern "error CS0246|error CS0234"

# Extract missing type names
$missingTypes = @()
foreach ($err in $errors) {
    if ($err -match "'([^']+)' could not be found") {
        $missingTypes += $matches[1]
    }
}
$missingTypes = $missingTypes | Sort-Object -Unique
Write-Host "Missing types: $($missingTypes.Count)"
$missingTypes
