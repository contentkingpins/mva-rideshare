# PowerShell script to create optimized image copies
# This is a temporary solution - these should ideally be properly optimized versions

$sourceImage = "public\images\shutterstock_2428486561.jpg"
$mobileWebp = "public\images\shutterstock_2428486561-mobile.webp"
$tabletWebp = "public\images\shutterstock_2428486561-tablet.webp"
$desktopWebp = "public\images\shutterstock_2428486561-desktop.webp"
$desktopJpg = "public\images\shutterstock_2428486561-desktop.jpg"

# Check if source image exists
if (-not (Test-Path $sourceImage)) {
    Write-Error "Source image not found at $sourceImage"
    exit 1
}

# As a temporary measure, just copy the original image to the desktop jpg location
Write-Host "Copying original image to desktop JPG location..."
Copy-Item $sourceImage $desktopJpg

# For a proper solution, you would need to:
# 1. Use a tool like ImageMagick, Sharp, or another image processing library
# 2. Resize images to appropriate sizes for each device
# 3. Convert to WebP format for modern browsers
# 4. Optimize compression to reduce file sizes

Write-Host "NOTE: This script creates copies of the original image without proper optimization."
Write-Host "For production, you should replace these with properly optimized images."
Write-Host "For now, make these changes:"
Write-Host ""
Write-Host "1. Update the HeroSection.tsx component to use the original image for all formats:"
Write-Host "   - Change all srcSet attributes to '/images/shutterstock_2428486561.jpg'"
Write-Host ""
Write-Host "2. OR install proper image optimization tools and re-run with optimization."

# Output that files were created
Write-Host "Created desktop JPG copy at $desktopJpg" 