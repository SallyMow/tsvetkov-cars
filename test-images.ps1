New-Item -ItemType Directory -Force -Path "public" | Out-Null

$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

# Test multiple CDNs for car images
$tests = @(
    "https://live.staticflickr.com/65535/51615894960_2b5c9d0b7a_b.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/2019_Audi_Q7_facelift%2C_front_8.15.19.jpg/1280px-2019_Audi_Q7_facelift%2C_front_8.15.19.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/2019_Tesla_Model_3_Performance_AWD_%28facelift%2C_red%29%2C_front_8.15.19.jpg/1280px-2019_Tesla_Model_3_Performance_AWD_%28facelift%2C_red%29%2C_front_8.15.19.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/2018_Jeep_Wrangler_Unlimited_%28JL%29%2C_front_11.14.19.jpg/1280px-2018_Jeep_Wrangler_%28JL%29%2C_front_11.14.19.jpg",
    "https://www.motortrend.com/uploads/sites/5/2020/07/2020-Audi-Q7-55-TFSI-quattro-front-three-quarter.jpg"
)

foreach ($url in $tests) {
    try {
        $bytes = $wc.DownloadData($url)
        Write-Host "OK $($bytes.Length) bytes — $url"
    } catch {
        Write-Host "FAIL — $url"
    }
}
$wc.Dispose()
