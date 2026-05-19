# Paste your OpenAI API key once — saves to .env
$envPath = Join-Path $PSScriptRoot ".env"
$key = Read-Host "Paste OPENAI_API_KEY (from https://platform.openai.com/api-keys)"
if (-not $key.Trim()) { Write-Host "Cancelled."; exit 1 }

$content = Get-Content $envPath -Raw -ErrorAction SilentlyContinue
if ($content -match '(?m)^OPENAI_API_KEY=.*') {
    $content = $content -replace '(?m)^OPENAI_API_KEY=.*', "OPENAI_API_KEY=$key"
} else {
    $content = "OPENAI_API_KEY=$key`nLLM_PROVIDER=openai`nOPENAI_MODEL=gpt-4o-mini`nCHATBOT_PORT=5001`n`n$content"
}
Set-Content -Path $envPath -Value $content.TrimEnd()
Write-Host "Saved. Restart: python app.py"
