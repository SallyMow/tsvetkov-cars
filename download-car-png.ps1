New-Item -ItemType Directory -Force -Path "public" | Out-Null
$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
$wc.Headers.Add("Referer", "https://www.google.com/")
$dest = (Resolve-Path ".").Path + "\public\car-hero.png"
$wc.DownloadFile("https://pngimg.com/uploads/porsche/porsche_PNG10622.png", $dest)
$sz = (Get-Item $dest).Length
Write-Host "pngimg size=$sz"
$wc.Dispose()
