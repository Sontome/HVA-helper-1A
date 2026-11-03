#Requires -Version 5.1
<#
.SYNOPSIS
Downloads or updates Tool Helper 1A from GitHub. Does not change Chrome policies.
.EXAMPLE
.\install.ps1 -RepoUrl https://github.com/OWNER/REPO -Ref main
.EXAMPLE
$env:GITHUB_TOKEN = 'a token with read access to the private repository'
.\install.ps1 -RepoUrl https://github.com/OWNER/REPO -NoOpen
#>
[CmdletBinding()]
param(
    [ValidatePattern('^https://github\.com/[A-Za-z0-9-]+/[A-Za-z0-9_.-]+/?$')]
    [string]$RepoUrl = 'https://github.com/Sontome/HVA-helper-1A',
    [ValidateNotNullOrEmpty()]
    [string]$Ref = 'main',
    [string]$Subdirectory = '',
    [string]$InstallRoot = (Join-Path $env:LOCALAPPDATA 'Hanvietair\ToolHelper1A'),
    [switch]$NoOpen
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Assert-ChildPath {
    param([string]$Path, [string]$Parent)
    $absolute = [IO.Path]::GetFullPath($Path)
    $prefix = [IO.Path]::GetFullPath($Parent).TrimEnd('\', '/') + [IO.Path]::DirectorySeparatorChar
    if (-not $absolute.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Path must stay inside the expected directory: $Parent"
    }
    return $absolute
}

function Assert-ManifestAsset {
    param([string]$RelativePath, [string]$Source)
    if ([string]::IsNullOrWhiteSpace($RelativePath)) { throw 'Manifest contains an empty asset path.' }
    $asset = Assert-ChildPath -Path ([IO.Path]::Combine($Source, $RelativePath)) -Parent $Source
    if (-not (Test-Path -LiteralPath $asset -PathType Leaf)) { throw "Missing extension asset: $RelativePath" }
}

$rootPath = [IO.Path]::GetFullPath($InstallRoot)
if ($rootPath -eq [IO.Path]::GetPathRoot($rootPath)) { throw 'InstallRoot must not be a drive root.' }
$extensionPath = Assert-ChildPath -Path (Join-Path $rootPath 'extension') -Parent $rootPath
$markerPath = Assert-ChildPath -Path (Join-Path $rootPath 'installation.json') -Parent $rootPath
$appId = 'hanvietair-tool-helper-1a'

# Refuse to replace an unrelated folder. Existing installations have our marker.
if (Test-Path -LiteralPath $rootPath) {
    if (-not (Test-Path -LiteralPath $rootPath -PathType Container)) { throw 'InstallRoot must be a directory.' }
    if (Test-Path -LiteralPath $markerPath -PathType Leaf) {
        $oldMarker = Get-Content -LiteralPath $markerPath -Raw | ConvertFrom-Json
        if ($oldMarker.appId -ne $appId) { throw 'This directory belongs to another application.' }
    } elseif (@(Get-ChildItem -LiteralPath $rootPath -Force).Count -gt 0) {
        throw 'InstallRoot is not empty and has no Tool Helper installation marker. Choose another InstallRoot.'
    }
    if ((Get-Item -LiteralPath $rootPath).Attributes -band [IO.FileAttributes]::ReparsePoint) {
        throw 'InstallRoot must not be a junction or symbolic link.'
    }
}

$parts = ([Uri]$RepoUrl).AbsolutePath.Trim('/').Split('/')
$owner = $parts[0]
$repository = $parts[1] -replace '\.git$', ''
if ($repository -eq '.' -or $repository -eq '..') { throw 'Invalid GitHub repository name.' }
$canonicalRepo = "https://github.com/$owner/$repository"
$archiveUrl = "https://api.github.com/repos/$owner/$repository/zipball/$([Uri]::EscapeDataString($Ref))"
$headers = @{ 'User-Agent' = 'Tool-Helper-1A-Installer'; 'Accept' = 'application/vnd.github+json' }
if ($env:GITHUB_TOKEN) { $headers['Authorization'] = "Bearer $env:GITHUB_TOKEN" }

$temporaryParent = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
$temporaryPath = Assert-ChildPath -Path (Join-Path $temporaryParent ('hva-install-' + [Guid]::NewGuid().ToString('N'))) -Parent $temporaryParent
$originalTls = [Net.ServicePointManager]::SecurityProtocol
$stagePath = $null
$backupPath = $null
$promoted = $false
try {
    [Net.ServicePointManager]::SecurityProtocol = $originalTls -bor [Net.SecurityProtocolType]::Tls12
    New-Item -ItemType Directory -Path $temporaryPath | Out-Null
    $archivePath = Join-Path $temporaryPath 'repository.zip'
    Write-Host "Downloading $canonicalRepo ($Ref)..."
    try {
        Invoke-WebRequest -Uri $archiveUrl -Headers $headers -OutFile $archivePath -UseBasicParsing -TimeoutSec 90 -MaximumRedirection 5 | Out-Null
    } catch {
        throw 'GitHub download failed. Check the repository URL, branch/tag, network, or GITHUB_TOKEN for a private repository.'
    }
    # Never persist a GitHub token in the installed extension or installation marker.
    $headers.Remove('Authorization')

    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $extractionPath = Join-Path $temporaryPath 'extracted'
    New-Item -ItemType Directory -Path $extractionPath | Out-Null
    $archive = [IO.Compression.ZipFile]::OpenRead($archivePath)
    try {
        if ($archive.Entries.Count -gt 10000) { throw 'Repository archive contains too many files.' }
        [long]$unpackedSize = 0
        foreach ($entry in $archive.Entries) {
            $null = Assert-ChildPath -Path ([IO.Path]::Combine($extractionPath, $entry.FullName.Replace('/', '\'))) -Parent $extractionPath
            if (($entry.ExternalAttributes -shr 16 -band 0xF000) -eq 0xA000) { throw 'Archive contains a symbolic link.' }
            $unpackedSize += $entry.Length
            if ($unpackedSize -gt 200MB) { throw 'Unpacked repository exceeds 200 MB.' }
        }
    } finally { $archive.Dispose() }
    [IO.Compression.ZipFile]::ExtractToDirectory($archivePath, $extractionPath)
    $archiveRoots = @(Get-ChildItem -LiteralPath $extractionPath -Directory)
    if ($archiveRoots.Count -ne 1) { throw 'Expected one root folder in the GitHub archive.' }
    $sourcePath = $archiveRoots[0].FullName
    if ($Subdirectory) {
        $sourcePath = Assert-ChildPath -Path ([IO.Path]::Combine($sourcePath, $Subdirectory)) -Parent $sourcePath
    }
    $manifestPath = Join-Path $sourcePath 'manifest.json'
    if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
        throw 'manifest.json was not found. Use -Subdirectory if the extension is in a subfolder of the repository.'
    }
    $manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
    if ($manifest.manifest_version -ne 3 -or $manifest.name -ne 'Tool Helper 1A') {
        throw 'The archive is not a Tool Helper 1A Manifest V3 extension.'
    }
    foreach ($file in @('bridge.js', 'sidebar.js', 'availability.js', 'booking.js', 'background.js', 'notification.js')) {
        Assert-ManifestAsset -RelativePath $file -Source $sourcePath
    }
    foreach ($contentScript in $manifest.content_scripts) {
        foreach ($file in $contentScript.js) { Assert-ManifestAsset -RelativePath $file -Source $sourcePath }
        if ($contentScript.PSObject.Properties['css']) {
            foreach ($file in $contentScript.css) { Assert-ManifestAsset -RelativePath $file -Source $sourcePath }
        }
    }
    Assert-ManifestAsset -RelativePath $manifest.background.service_worker -Source $sourcePath
    foreach ($icon in $manifest.icons.PSObject.Properties) { Assert-ManifestAsset -RelativePath $icon.Value -Source $sourcePath }

    New-Item -ItemType Directory -Path $rootPath -Force | Out-Null
    if (-not (Test-Path -LiteralPath $markerPath)) {
        @{ appId = $appId; repository = $canonicalRepo; ref = $Ref; version = '' } | ConvertTo-Json | Set-Content -LiteralPath $markerPath -Encoding UTF8
    }
    $stagePath = Assert-ChildPath -Path (Join-Path $rootPath ('.stage-' + [Guid]::NewGuid().ToString('N'))) -Parent $rootPath
    New-Item -ItemType Directory -Path $stagePath | Out-Null
    foreach ($item in Get-ChildItem -LiteralPath $sourcePath -Force) {
        Copy-Item -LiteralPath $item.FullName -Destination $stagePath -Recurse -Force
    }
    if (Test-Path -LiteralPath $extensionPath) {
        if ((Get-Item -LiteralPath $extensionPath).Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Extension directory must not be a junction or symbolic link.' }
        $backupPath = Assert-ChildPath -Path (Join-Path $rootPath ('backup-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '-' + [Guid]::NewGuid().ToString('N').Substring(0, 8))) -Parent $rootPath
        # Both resolved targets are verified children of the managed installation root.
        Move-Item -LiteralPath $extensionPath -Destination $backupPath
    }
    Move-Item -LiteralPath $stagePath -Destination $extensionPath
    $promoted = $true
    $marker = [ordered]@{ appId = $appId; repository = $canonicalRepo; ref = $Ref; version = $manifest.version; installedAt = [DateTime]::UtcNow.ToString('o') }
    $marker | ConvertTo-Json | Set-Content -LiteralPath $markerPath -Encoding UTF8
    Write-Host "Ready: Tool Helper 1A $($manifest.version)" -ForegroundColor Green
    Write-Host "Extension folder: $extensionPath"
    if ($backupPath) { Write-Host "Previous version kept at: $backupPath" }
    Write-Host ''
    Write-Host 'FIRST INSTALL: chrome://extensions -> Developer mode -> Load unpacked -> select the extension folder above.'
    Write-Host 'UPDATE: click Reload on Tool Helper 1A in chrome://extensions, accept new permissions if asked, then reload Altea.'
    Write-Host 'Chrome on regular Windows computers does not silently install unpacked extensions from GitHub.'
    if (-not $NoOpen) {
        $chromePaths = @(
            (Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'),
            (Join-Path ${env:ProgramFiles(x86)} 'Google\Chrome\Application\chrome.exe'),
            (Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe')
        )
        $chromePath = $chromePaths | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } | Select-Object -First 1
        if ($chromePath) {
            try { Start-Process -FilePath $chromePath -ArgumentList 'chrome://extensions/' } catch { Write-Warning 'Open chrome://extensions manually.' }
        } else { Write-Host 'Chrome was not found automatically. Open chrome://extensions manually.' }
    }
} catch {
    if ($backupPath -and (Test-Path -LiteralPath $backupPath)) {
        if ($promoted -and (Test-Path -LiteralPath $extensionPath)) {
            $failedPath = Assert-ChildPath -Path (Join-Path $rootPath ('failed-' + [Guid]::NewGuid().ToString('N'))) -Parent $rootPath
            Move-Item -LiteralPath $extensionPath -Destination $failedPath
        }
        if (-not (Test-Path -LiteralPath $extensionPath)) { Move-Item -LiteralPath $backupPath -Destination $extensionPath }
    }
    if ($stagePath -and (Test-Path -LiteralPath $stagePath)) {
        $stageCleanup = Assert-ChildPath -Path $stagePath -Parent $rootPath
        Remove-Item -LiteralPath $stageCleanup -Recurse -Force
    }
    throw
} finally {
    [Net.ServicePointManager]::SecurityProtocol = $originalTls
    $headers.Remove('Authorization')
    if (Test-Path -LiteralPath $temporaryPath) {
        $cleanupPath = Assert-ChildPath -Path $temporaryPath -Parent $temporaryParent
        Remove-Item -LiteralPath $cleanupPath -Recurse -Force
    }
}
