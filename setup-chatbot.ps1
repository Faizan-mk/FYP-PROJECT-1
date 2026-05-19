# One-time chatbot setup (packages + FAQ index)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$venvPython = Join-Path $root ".venv\Scripts\python.exe"
$aiDir = Join-Path $root "AI Chatbot model"

if (-not (Test-Path $venvPython)) {
    Write-Host "Creating virtual environment..."
    python -m venv (Join-Path $root ".venv")
}

Write-Host "Installing Python packages..."
& $venvPython -m pip install --upgrade pip -q
& $venvPython -m pip install -r (Join-Path $aiDir "requirements.txt") -q

Write-Host "Building FAQ index..."
Set-Location $aiDir
& $venvPython faq_builder.py

$envFile = Join-Path $aiDir ".env"
if (-not (Test-Path $envFile)) {
    Copy-Item (Join-Path $aiDir ".env.example") $envFile
}

Write-Host ""
Write-Host "Setup complete."
Write-Host "  1. Add GEMINI_API_KEY to: $envFile"
Write-Host "     Free key: https://aistudio.google.com/apikey"
Write-Host "  2. Start chatbot:"
Write-Host "     cd `"$aiDir`""
Write-Host "     ..\..venv\Scripts\Activate.ps1"
Write-Host "     python app.py"
Write-Host ""
