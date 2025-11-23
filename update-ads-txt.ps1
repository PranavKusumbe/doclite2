$url = "https://srv.adstxtmanager.com/19390/doclite.me"
$output = "ads.txt"

try {
    # Ensure TLS 1.2 is used
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    
    Write-Host "Fetching ads.txt from $url..."
    Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
    
    if (Test-Path $output) {
        $content = Get-Content $output
        if ($content.Length -gt 0) {
            Write-Host "Successfully updated ads.txt"
        } else {
            Write-Warning "Downloaded file is empty."
        }
    }
} catch {
    Write-Error "Failed to update ads.txt. Please ensure your domain is registered with Ezoic and Adstxtmanager."
    Write-Error "Error details: $_"
}
