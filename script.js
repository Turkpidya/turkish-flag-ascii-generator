// Function to generate the ASCII representation of the Turkish flag
function generateFlag() {
    // Get the width and height of the flag based on user input
    const width = Math.max(30, Math.min(100, parseInt(document.getElementById('width').value) || 50));
    const height = Math.round(width * 2 / 3);
    const G = height / 30; // G is the measurement unit for the flag
    
    // Calculate positions and sizes for the crescent and star
    const crescentCenterX = Math.round(width * 0.25);
    const crescentCenterY = Math.round(height * 0.5);
    const crescentRadius = Math.round(G * 6);
    const starCenterX = Math.round(width * 0.3125);
    const starCenterY = Math.round(height * 0.5);
    const starRadius = Math.round(G * 2.5);
    
    // Get style and color from user input
    let style = document.getElementById('style').value;
    let color = document.getElementById('color').value;
    
    // Randomly select a style if 'random' is chosen
    if (style === 'random') {
        const styles = ['basic', 'detailed', 'minimal', 'dots', 'ascii'];
        style = styles[Math.floor(Math.random() * styles.length)];
    }
    
    // Randomly select a color if 'random' is chosen
    if (color === 'random') {
        const colors = ['red', 'white', 'blackwhite'];
        color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Initialize the flag string and character variables
    let flag = '';
    let bgChar, starChar, crescentChar;
    
    // Set characters based on the selected style
    switch (style) {
        case 'detailed':
            bgChar = '▓'; starChar = '✦'; crescentChar = '☽';
            break;
        case 'minimal':
            bgChar = '['; starChar = 'O'; crescentChar = ')';
            break;
        case 'dots':
            bgChar = '•'; starChar = '●'; crescentChar = '◦';
            break;
        case 'ascii':
            bgChar = '#'; starChar = '*'; crescentChar = '@';
            break;
        default:
            bgChar = '█'; starChar = '★'; crescentChar = '☾';
    }
    
    // Build the flag line by line
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Check if the current position is within the star or crescent
            if (isInStar(x, y, starCenterX, starCenterY, starRadius)) {
                flag += starChar;
            } else if (isInCrescent(x, y, crescentCenterX, crescentCenterY, crescentRadius)) {
                flag += crescentChar;
            } else {
                flag += bgChar;
            }
        }
        flag += '\n'; // New line after each row
    }
    
    // Display the generated flag in the output div
    const outputDiv = document.getElementById('flagOutput');
    outputDiv.textContent = flag;
    
    // Set flag and background colors based on user selection
    let flagColor, bgColor;
    switch (color) {
        case 'white':
            flagColor = '#FFFFFF';
            bgColor = '#E30A17';
            break;
        case 'blackwhite':
            flagColor = '#000000';
            bgColor = '#FFFFFF';
            break;
        default:
            flagColor = '#E30A17';
            bgColor = '#FFFFFF';
    }
    
    // Apply the selected colors to the output div
    outputDiv.style.color = flagColor;
    outputDiv.style.backgroundColor = bgColor;
}

// Function to determine if a point is within the star shape
function isInStar(x, y, centerX, centerY, radius) {
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > radius) return false; // Outside the star radius
    
    const angle = Math.atan2(dy, dx);
    const starAngle = (Math.PI * 2) / 5; // Star has 5 points
    const rotatedAngle = (angle + Math.PI / 2) % starAngle; // Rotate for star points
    const normalizedDistance = distance / radius;
    
    return normalizedDistance <= 0.5 + 0.5 * Math.cos(rotatedAngle * 5); // Check if within star shape
}

// Function to determine if a point is within the crescent shape
function isInCrescent(x, y, centerX, centerY, radius) {
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const innerRadius = radius * 0.8; // Inner radius for crescent
    const outerRadius = radius * 1.2; // Outer radius for crescent
    
    return distance <= outerRadius && distance > innerRadius && dx < 0; // Check if within crescent shape
}

// Function to copy the generated flag to the clipboard
function copyToClipboard() {
    const flagText = document.getElementById('flagOutput').textContent;
    navigator.clipboard.writeText(flagText).then(() => {
        showNotification('Flag copied to clipboard!', 'success'); // Show success notification
    }, (err) => {
        console.error('Could not copy text: ', err);
        showNotification('Failed to copy to clipboard', 'error'); // Show error notification
    });
}

// Function to display notifications to the user
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification ${type}`; // Set notification type class
    document.body.appendChild(notification);
    setTimeout(() => {
        document.body.removeChild(notification); // Remove notification after 3 seconds
    }, 3000);
}

// Function to download the generated flag as a TXT file
function downloadTxt() {
    const flagText = document.getElementById('flagOutput').textContent;
    const blob = new Blob([flagText], { type: 'text/plain' }); // Create a text blob
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); // Create a URL for the blob
    a.download = 'turkish_flag_ascii.txt'; // Set the download file name
    document.body.appendChild(a);
    a.click(); // Trigger the download
    document.body.removeChild(a); // Clean up
}

// Function to share the flag configuration via URL
function shareFlag() {
    const width = document.getElementById('width').value;
    const style = document.getElementById('style').value;
    const color = document.getElementById('color').value;
    const shareUrl = `${window.location.href}?width=${width}&style=${style}&color=${color}`; // Construct shareable URL
    const shareLinkDiv = document.getElementById('shareLink');
    shareLinkDiv.textContent = `Share this link: ${shareUrl}`; // Display the share link
    shareLinkDiv.style.display = 'block'; // Make the share link visible
};

// Load preferences from local storage on page load
window.onload = function() {
    const savedWidth = localStorage.getItem('flagWidth');
    const savedStyle = localStorage.getItem('flagStyle');
    const savedColor = localStorage.getItem('flagColor');
    
    // Restore saved preferences if they exist
    if (savedWidth) document.getElementById('width').value = savedWidth;
    if (savedStyle) document.getElementById('style').value = savedStyle;
    if (savedColor) document.getElementById('color').value = savedColor;
    
    // Check for URL parameters to set initial values
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('width')) document.getElementById('width').value = urlParams.get('width');
    if (urlParams.has('style')) document.getElementById('style').value = urlParams.get('style');
    if (urlParams.has('color')) document.getElementById('color').value = urlParams.get('color');
    
    generateFlag(); // Generate the flag based on loaded preferences
    updateStylePreview(); // Update the style preview
};

// Debounce function to limit the rate of flag generation
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args); // Call the original function
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait); // Set a new timeout
    };
}

// Create a debounced version of the generateFlag function
const debouncedGenerateFlag = debounce(generateFlag, 300);

// Add event listeners for real-time updates
document.getElementById('width').addEventListener('input', debouncedGenerateFlag);
document.getElementById('style').addEventListener('change', debouncedGenerateFlag);
document.getElementById('color').addEventListener('change', debouncedGenerateFlag);

// Function to update the style preview based on selected style
function updateStylePreview() {
    const style = document.getElementById('style').value;
    const previewDiv = document.getElementById('stylePreview');
    previewDiv.innerHTML = ''; // Clear previous preview
    
    // Define available styles and their characters
    const styles = {
        'basic': ['█', '★', '☾'],
        'detailed': ['▓', '✦', '☽'],
        'minimal': ['[', 'O', ')'],
        'dots': ['•', '●', '◦'],
        'ascii': ['#', '*', '@']
    };
    
    const chars = styles[style] || styles['basic']; // Get characters for the selected style
    
    // Create and append preview characters to the preview div
    chars.forEach(char => {
        const span = document.createElement('span');
        span.className = 'style-preview-item';
        span.innerHTML = `<span class="preview-chars">${char}</span>`;
        previewDiv.appendChild(span);
    });
}

// Add event listener to update style preview on style change
document.getElementById('style').addEventListener('change', updateStylePreview);
updateStylePreview(); // Call this on page load to set initial preview
