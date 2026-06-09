Param(
    [string]$IconFileName = "whatsapp.ico",
    [string]$ShortcutName = "Bijouterie.lnk"
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$target = Join-Path $scriptDir "Logiciel bijoux.bat"
if (-not (Test-Path $target)) {
    Write-Error "Target batch not found: $target"
    exit 1
}

$iconPath = Join-Path $scriptDir $IconFileName
if (-not (Test-Path $iconPath)) {
    Write-Warning "Icon not found at $iconPath. Shortcut will use default icon."
    $iconPath = $null
}

$desktop = [Environment]::GetFolderPath("Desktop")
$linkPath = Join-Path $desktop $ShortcutName

$WshShell = New-Object -ComObject WScript.Shell
$shortcut = $WshShell.CreateShortcut($linkPath)
$shortcut.TargetPath = $target
$shortcut.WorkingDirectory = Split-Path $target
if ($iconPath) { $shortcut.IconLocation = $iconPath }
$shortcut.Save()

Write-Output "Shortcut created at $linkPath"
