New-Item -ItemType Directory -Force -Path "public" | Out-Null
$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
$wc.Headers.Add("Accept", "image/jpeg,image/*,*/*")

# Try different Pexels photo IDs for a car/SUV/jeep
$candidates = @(
    "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/35967/mini-cooper-auto-model-vehicle.jpg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=800"
)

foreach ($url in $candidates) {
    $destPath = (Resolve-Path ".").Path + "\public\car-jeep.jpg"
    try {
        $wc.DownloadFile($url, $destPath)
        $sz = (Get-Item "public\car-jeep.jpg").Length
        if ($sz -gt 5000) {
            Write-Host "OK $url ($sz bytes)"
            break
        }
    } catch {
        Write-Host "FAIL $url"
    }
}
$wc.Dispose()
