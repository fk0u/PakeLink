/**
 * Placeholder icons for different devices
 */

// Create icons for PWA
// These will be simple colored squares for demonstration purposes
function createPlaceholderIcons() {
  const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
  const iconColor = '#4338ca'; // Indigo color matching theme-color
  
  iconSizes.forEach(size => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Draw background
    ctx.fillStyle = iconColor;
    ctx.fillRect(0, 0, size, size);
    
    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size / 4}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PL', size / 2, size / 2);
    
    // Convert to blob and save
    canvas.toBlob(blob => {
      const iconPath = `assets/icons/icon-${size}x${size}.png`;
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `icon-${size}x${size}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Release the blob URL
      URL.revokeObjectURL(url);
    });
  });
}

// This script can be run in browser console to generate icons
