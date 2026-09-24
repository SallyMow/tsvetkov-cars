New-Item -ItemType Directory -Force -Path "public" | Out-Null
Write-Host "Downloading video..."
try {
    $url = "https://videos.pexels.com/video-files/5309381/5309381-hd_1920_1080_25fps.mp4"
    $out = "public\hero-video.mp4"
    $wc = New-Object System.Net.WebClient
    $wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
    $wc.DownloadFile($url, (Resolve-Path ".").Path + "\" + $out)
    $size = (Get-Item $out).Length
    Write-Host "SUCCESS size=$size"
} catch {
    Write-Host "FAILED: $_"
}
